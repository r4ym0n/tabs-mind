/// <reference types="chrome"/>
/**
 * This example showcases sigma's reducers, which aim to facilitate dynamically
 * changing the appearance of nodes and edges, without actually changing the
 * main graphology data.
 */

import Sigma from "sigma";

import { Coordinates, EdgeDisplayData, NodeDisplayData } from "sigma/types";

import Graph from "graphology";

import data from "./data.json";

data.nodes.forEach((node, index) => {
  data["nodes"][index]['attributes']['x'] = Math.random() * 100;
  data["nodes"][index]['attributes']['y'] = Math.random() * 100;
})

console.log(data)
// 插件页面

document.addEventListener("DOMContentLoaded", function () {
  console.log("send message");

  chrome.runtime.sendMessage({
    type: "FROM_PAGE",
    payload: "Hello from the page!",
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.message) {
        console.log('Message received from background script: ', request.message);
        console.log("load Graph data")
        graph.import(data);
        // circlepack.assign(graph);
        // collectLayoutAsFlatArray(graph)
        // forceLayout.assign(graph, {
        //   maxIterations: 50,
        //   settings: {
        //     gravity: 10
        //   }});
        const layout = new ForceSupervisor(graph, {
            settings: {
              gravity: 0.002,
              repulsion: 0.2
            }});
        layout.start()
      }
  });

});

// Retrieve some useful DOM elements:
const container = document.getElementById("sigma-container") as HTMLElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchSuggestions = document.getElementById(
  "suggestions"
) as HTMLDataListElement;

// Instantiate sigma:
const graph = new Graph();
graph.import({});
const renderer = new Sigma(graph, container);
// import {collectLayoutAsFlatArray} from 'graphology-layout/utils';
// import forceLayout from 'graphology-layout-force';
import ForceSupervisor from 'graphology-layout-force/worker';

// import {circlepack} from 'graphology-layout';

// To directly assign the positions to the nodes:

// Type and declare internal state:
interface State {
  hoveredNode?: string;
  searchQuery: string;

  // State derived from query:
  selectedNode?: string;
  suggestions?: Set<string>;

  // State derived from hovered node:
  hoveredNeighbors?: Set<string>;
}
const state: State = { searchQuery: "" };

// Feed the datalist autocomplete values:
searchSuggestions.innerHTML = graph
  .nodes()
  .map(
    (node) =>
      `<option value="${graph.getNodeAttribute(node, "label")}"></option>`
  )
  .join("\n");

// Actions:
function setSearchQuery(query: string) {
  state.searchQuery = query;

  if (searchInput.value !== query) searchInput.value = query;

  if (query) {
    const lcQuery = query.toLowerCase();
    const suggestions = graph
      .nodes()
      .map((n) => ({
        id: n,
        label: graph.getNodeAttribute(n, "label") as string,
      }))
      .filter(({ label }) => label.toLowerCase().includes(lcQuery));

    // If we have a single perfect match, them we remove the suggestions, and
    // we consider the user has selected a node through the datalist
    // autocomplete:
    if (suggestions.length === 1 && suggestions[0].label === query) {
      state.selectedNode = suggestions[0].id;
      state.suggestions = undefined;

      // Move the camera to center it on the selected node:
      const nodePosition = renderer.getNodeDisplayData(
        state.selectedNode
      ) as Coordinates;
      renderer.getCamera().animate(nodePosition, {
        duration: 500,
      });
    }
    // Else, we display the suggestions list:
    else {
      state.selectedNode = undefined;
      state.suggestions = new Set(suggestions.map(({ id }) => id));
    }
  }
  // If the query is empty, then we reset the selectedNode / suggestions state:
  else {
    state.selectedNode = undefined;
    state.suggestions = undefined;
  }

  // Refresh rendering:
  renderer.refresh();
}
function setHoveredNode(node?: string) {
  if (node) {
    state.hoveredNode = node;
    state.hoveredNeighbors = new Set(graph.neighbors(node));
  } else {
    state.hoveredNode = undefined;
    state.hoveredNeighbors = undefined;
  }

  // Refresh rendering:
  renderer.refresh();
}

// Bind search input interactions:
searchInput.addEventListener("input", () => {
  setSearchQuery(searchInput.value || "");
});
searchInput.addEventListener("blur", () => {
  setSearchQuery("");
});

// Bind graph interactions:
renderer.on("enterNode", ({ node }) => {
  setHoveredNode(node);
});
renderer.on("leaveNode", () => {
  setHoveredNode(undefined);
});

// Render nodes accordingly to the internal state:
// 1. If a node is selected, it is highlighted
// 2. If there is query, all non-matching nodes are greyed
// 3. If there is a hovered node, all non-neighbor nodes are greyed
renderer.setSetting("nodeReducer", (node, data) => {
  const res: Partial<NodeDisplayData> = { ...data };

  if (
    state.hoveredNeighbors &&
    !state.hoveredNeighbors.has(node) &&
    state.hoveredNode !== node
  ) {
    res.label = "";
    res.color = "#f6f6f6";
  }

  if (state.selectedNode === node) {
    res.highlighted = true;
  } else if (state.suggestions && !state.suggestions.has(node)) {
    res.label = "";
    res.color = "#f6f6f6";
  }

  return res;
});

// Render edges accordingly to the internal state:
// 1. If a node is hovered, the edge is hidden if it is not connected to the
//    node
// 2. If there is a query, the edge is only visible if it connects two
//    suggestions
renderer.setSetting("edgeReducer", (edge, data) => {
  const res: Partial<EdgeDisplayData> = { ...data };

  if (state.hoveredNode && !graph.hasExtremity(edge, state.hoveredNode)) {
    res.hidden = true;
  }

  if (
    state.suggestions &&
    (!state.suggestions.has(graph.source(edge)) ||
      !state.suggestions.has(graph.target(edge)))
  ) {
    res.hidden = true;
  }

  return res;
});
