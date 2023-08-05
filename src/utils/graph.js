const data = [
    {
        "title": "Bruce.Hu 在 Twitter: \"今天用 Zeabur 终于成功且稳定地部署了 n8n。 参考了@novoreorx、@rayepeng_、@pseudo_yu的文章教程。目前有豆瓣、网易云、YouTube、个人博客、Raindrop、哔哩哔哩、GitHub activities 等内容同步至 Telegram 频道，逐渐形成一个赛博空间~ 如有兴趣，欢迎关注我的个人频道！ https://t.co/SbZNgfyN7y\" / X",
        "tags": ["技术", "n8n", "豆瓣", "网易云", "YouTube", "博客", "Raindrop", "GitHub"]
    },
    {
        "title": "Kubernetes Tutorial for Beginners [FULL COURSE in 4 Hours] - YouTube",
        "tags": ["技术", "Kubernetes", "YouTube"]
    },
    {
        "title": "程序员的乌托邦 - YouTube",
        "tags": ["技术", "程序员", "乌托邦", "YouTube"]
    },
    {
        "title": "新的里程碑 🎉 独立开发的作品简单简历月收入达到3000元 - YouTube",
        "tags": ["收入", "简历", "YouTube"]
    },
    {
        "title": "花果山大圣 - YouTube",
        "tags": ["技术", "花果山大圣", "YouTube"]
    },
    {
        "title": "开源软件怎样赚钱？ - Tailwind.css 是怎样半年赚到 200万美金的？💰💰💰 - YouTube",
        "tags": ["技术", "开源软件", "Tailwind.css", "YouTube"]
    },
    {
        "title": "[BetterExplained]为什么你应该（从现在开始就）写博客 – 刘未鹏 | Mind Hacks",
        "tags": ["技术", "BetterExplained", "博客"]
    },
    {
        "title": "《卡片笔记写作法》笔记 - lcomplete 的个人博客",
        "tags": ["技术", "卡片笔记", "博客"]
    },
    {
        "title": "2022亏了多少 # 组合季报(2022Q4) · BMPI",
        "tags": ["技术", "组合季报"]
    },
    {
        "title": "30 mins FREE Talk | Sean G | Cal.com",
        "tags": ["技术", "Talk"]
    },
    {
        "title": "安装并配置 AdGuardHome | 小狼狼的博客",
        "tags": ["技术", "AdGuardHome", "博客"]
    },
    {
        "title": "被動收入方法有哪些？43種創造被動收入的方法 - Mr.Market市場先生",
        "tags": ["收入", "被动收入"]
    },
    {
        "title": "博客來-極簡創業家：找出新創極簡之道",
        "tags": ["收入", "極簡創業家"]
    },
    {
        "title": "博客主要应用技术及支持特性-挖站否网站与服务器优化方法总结 - 挖站否-挖掘建站的乐趣",
        "tags": ["技术", "挖站否", "博客"]
    },
    {
        "title": "不露脸的YouTube频道可以赚取超过9,000美元/月的收入。 但是创建和编辑YouTube视频需要数小时。 现在，任何人都可以立即与AI一起制作YouTube视频： - Rattibha",
        "tags": ["技术", "YouTube频道"]
    },
    {
        "title": "不上班的1000天，程序员自由职业 B 计划 - 我做了什么/收入怎样/以及经验教训 - YouTube",
        "tags": ["技术", "自由职业", "程序员", "YouTube"]
    },
    {
        "title": "趁着熊市，手把手教你定投比特币|一亩三分地投资版",
        "tags": ["技术", "比特币"]
    },
    {
        "title": "大厂项目复盘",
        "tags": ["技术", "大厂"]
    },
    {
        "title": "第1章：DeFi快照 - How to DeFi: Advanced（中文版）",
        "tags": ["技术", "DeFi"]
    },
    {
        "title": "分享三种常用的 drone 工作流 CI 配置 - 思有云 - IOIOX",
        "tags": ["技术", "drone"]
    },
    {
        "title": "海外交流 | ZAPRO · 杂铺",
        "tags": ["交流", "海外交流"]
    },
    {
        "title": "恢复更新 - GeekPlux",
        "tags": ["技术"]
    },
    {
        "title": "简介 — Ethereum Homestead中文文档 0.1 文档",
        "tags": ["技术", "Ethereum"]
    },
    {
        "title": "开始使用 — ethers.js v4中文文档 — 登链社区",
        "tags": ["技术", "ethers.js"]
    }
]



function structGrapgData() {

}

const result = {
    "nodes": [],
    "edges": []
};

// create an object to store the tag counts
const tagCounts = {};

// loop through the data and count the tags
for (let i = 0; i < data.length; i++) {
    const item = data[i];

    for (let j = 0; j < item.tags.length; j++) {
        const tag = item.tags[j];

        if (tagCounts[tag]) {
            tagCounts[tag]++;
        } else {
            tagCounts[tag] = 1;
        }
    }
}

let pNodeConns = []
for (let i = 0; i < data.length; i++) {
    let pNodeConn={}
    const item = data[i]['tags'];
    // console.log(item)
    const pNode = item.filter((tag) => {
        return tagCounts[tag] > 1
    })
    const cNode = item.filter((tag) => {
        return tagCounts[tag] == 1
    })
    pNode.map((tag) => {
        pNodeConn[tag] = cNode
    })
    // console.log(pNode)
    // console.log(pNodeConn)
    pNodeConns.push(pNodeConn)
}

// create a color array for the nodes
const colors = ["#B30000", "#4C4CFF", "#009900", "#FF8000", "#9933FF", "#FF3399"];

// create a node for each tag
for (const tag in tagCounts) {
    const count = tagCounts[tag];
    // create a new node object
    const node = {
        "key": tag,
        "attributes": {
            "label": tag,
            "size": count,
            "color": colors[Math.floor(Math.random() * colors.length)]
        }
    };

    // add the node to the result object
    result.nodes.push(node);

    // if the node's size is greater than 1, create an edge to the root node
    if (count > 1) {
        result.edges.push({
            "key": `${tag}-Root`,
            "source": tag,
            "target": "Root",
            "size": 1
        })
    }
}

console.log(pNodeConns)

for (const idx in pNodeConns) {
    const pNodeConn = pNodeConns[idx];
    // create a new edge object
    // console.log(pNodeConn)
    for (const conns in pNodeConn) {
        for (const conn in pNodeConn[conns]) {
            const tag = pNodeConn[conns][conn];
            console.log(tag)
            const edge = {
                "key": `${tag}-${conns}`,
                "source": tag,
                "target": conns,
                // "size": count
            };
            result.edges.push(edge);
        }
    }
    // add the edge to the result object
}

// create the root node object
const rootNode = {
    "key": "Root",
    "attributes": {
        "label": "Root",
        "size": 20,
        "color": "#B30000"
    }
};

// add the root node to the result object
result.nodes.unshift(rootNode);

// print the result object
console.log(result);
console.log(JSON.stringify(result));
