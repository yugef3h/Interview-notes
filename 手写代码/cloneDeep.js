function cloneDeep(obj, map = new WeakMap()) {
  // 基本数据
  if (!obj instanceof Object) return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);

  if (map.get(obj)) return map.get(obj);
  if (obj instanceof Function) {
    return function () {
      return obj.apply(this, [...arguments]);
    };
  }
  const res = new obj.constructor();
  //   const res = Array.isArray(obj) ? [] : {};
  obj instanceof Object && map.set(obj, res);
  if (obj instanceof Map) {
    obj.forEach((item, index) => {
      res.set(cloneDeep(index, map), cloneDeep(item, map));
    });
  }
  if (obj instanceof Set) {
    obj.forEach((item) => {
      res.add(cloneDeep(item, map));
    });
  }
  Object.keys(obj).forEach((key) => {
    if (obj[key] instanceof Object) {
      res[key] = cloneDeep(obj[key], map);
    } else {
      res[key] = obj[key];
    }
  });
  return res;
}
const map = new Map();
map.set({ a: 1 }, "1");
const source = {
  name: "Jack",
  meta: {
    age: 12,
    birth: new Date("1997-10-10"),
    ary: [1, 2, { a: 1 }],
    say() {
      console.log("Hello");
    },
    map
  },
};
source.source = source;
const newObj = cloneDeep(source);
console.log(newObj.meta.ary[2] === source.meta.ary[2]); // false
console.log(newObj.meta.birth === source.meta.birth); // false
console.log(newObj);
