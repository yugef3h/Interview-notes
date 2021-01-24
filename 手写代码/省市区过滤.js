// 快手

const source = [
  // 待检索元数据

  {
    label: "江苏省",

    children: [
      {
        label: "南京市",

        children: [
          {
            label: "a区",
          },

          {
            label: "b区",
          },
        ],
      },

      {
        label: "无锡市",

        children: [
          {
            label: "南区",
          },

          {
            label: "c区",
          },
        ],
      },
    ],
  },

  {
    label: "海南省",

    children: [
      {
        label: "海口市",

        children: [
          {
            label: "d区",
          },

          {
            label: "e区",
          },
        ],
      },

      {
        label: "三亚市",

        children: [
          {
            label: "f区",
          },

          {
            label: "g区",
          },
        ],
      },
    ],
  },
];

function formatRes(source) {
  return source.map((item) => {
    let children = item.children;
    let res = [];
    if (children && children.length) {
      for (let i = 0; i < children.length; i++) {
        let item_2 = children[i].children;
        if (item_2 && item_2.length) {
          for (let j = 0; j < item_2.length; j++) {
            res.push(
              item.label + "-" + children[i].label + "-" + item_2[j].label
            );
          }
        }
      }
    }
    return res;
  });
}
let res = formatRes(source);
let cur = [];
for (let k = 0; k < res.length; k++) {
  Array.isArray(res[k]) ? (cur = cur.concat(...res[k])) : cur.push(res[k]);
}
console.log(cur.filter((item) => item.indexOf("南") !== -1));

// 封装下，假如有多级 label 和 children 呢
// 启发 for / let j = 0 / while
var longestCommonPrefix = function(strs) {
  if (!strs.length) return ''
  let res = strs[0]
  for (let i=1; i<strs.length; i++) {
    let cur = strs[i]
    let j = 0
    while (j < res.length) {
      if (res[j] === cur[j]) {
        j++
      } else {
        res = res.slice(0, j)
        if (res === '') return res
      }
    }
  }
  return res
}