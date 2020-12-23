const selfMap = function (fn, context) {
  // note1: slice 创建一个新对象，因为 map 返回一个新数组，原 this 数组对象不改变
  const array = Array.prototype.slice.call(this);
  let res = [];
  for (let i = 0; i < array.length; i++) {
    // note2: index i 假如是稀疏数组需要判断是否是自身的属性，这里注意，与对象属性不同，数组的属性是序号 i
    if (!array.hasOwnProperty(i)) continue;
    // note3: context 是当前 fn 回调的 this 指向，箭头函数不会绑定
    res[i] = fn.call(context, array[i], i, this);
  }
  return res;
};
Array.prototype.selfMap = selfMap;
const selfMapData = [1, 2, 3];
const selfMapRes = selfMapData.selfMap((item) => item * 2);
console.log(selfMapRes);

// note1: 会 map 就会 filter，可忽略
const selfFilter = function (fn, context) {
  const array = Array.prototype.slice.call(this);
  let res = [];
  for (let i = 0; i < array.length; i++) {
    if (!array.hasOwnProperty(i)) continue;
    const boolean = fn.call(context, array[i], i, this);
    if (boolean) res.push(array[i]);
  }
  return res;
};

// note1: 特判空数组始终为 false
const selfSome = function (fn, context) {
  const array = Array.prototype.slice.call(this);
  if (!array.length) return false;
  for (let i = 0; i < array.length; i++) {
    if (!array.hasOwnProperty(i)) continue;
    const boolean = fn.call(context, array[i], i, this);
    if (boolean) return true;
  }
  return false;
};
Array.prototype.selfSome = selfSome;
const selfSomeData = [];
const selfSomeRes = selfSomeData.selfSome((item) => item === undefined);
console.log(selfSomeRes);

// note1: 特判空数组始终 true
const selfEvery = () => {
  /** 逻辑与 some 类似 **/
};

// flat
let arr = [1, 2, [3, 4, 5, [6, 7], 8], 9, 10, [11, [12, 13]]];
const flatten = (arr) => {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
};
const flatten2 = (arr) => {
  return arr.reduce((pre, cur) => {
    return Array.isArray(cur) ? [...pre, ...flatten(cur)] : [...pre, cur];
  }, []);
};
console.log(flatten(arr));

// 防抖
const debounce = (fn, wait = 50, immediate) => {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    // note1: clear 后 timer 还是有值的，!timer 代表首次 null 的情况
    if (immediate && !timer) fn.apply(this, args);
    timer = setTimeout(() => {
      // note2: 频繁触发后的第一次
      // clearTimeout(timer)
      // timer = null
      fn.apply(this, args);
    }, wait);
  };
};
let f = debounce(() => console.log(9), 3000);
f();

// 节流
const throttle = (cb, wait = 50) => {
  let previous = 0;
  return function (...args) {
    const now = +new Date();
    // note1: 第一次就执行节流函数
    if (now - previous > wait) {
      previous = now;
      cb.apply(this, args);
    }
  };
};

// 加强版节流：防抖和节流的组合
// note1: 小于 wait 时间用防抖，大于等于 wait 时间用节流
const THROTTLE = (cb, wait = 50) => {
  let previous = 0,
    timer = null;
  return function (...args) {
    const now = +new Date();
    if (now - previous < wait) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        previous = now;
        cb.apply(this, args);
      }, wait);
    } else {
      previous = now;
      cb.apply(this, args);
    }
  };
};

// 两数之和
var twoSum = function (nums, target) {
  let map = {};
  for (let i = 0; i < nums.length; i++) {
    const value = nums[i];
    // note1: 判断 undefined，因为在这里 0 也是正常值
    if (map[value] !== undefined) {
      return [i, map[value]];
    } else {
      map[target - value] = i;
    }
  }
};

// 工卡部门分级
function convert(list) {
  const res = [];
  // note1: map 里存的是一个个引用地址，与 list 是共享同一份数据的
  const map = list.reduce((res, v) => ((res[v.id] = v), res), {});
  for (const item of list) {
    if (item.parentId === 0) {
      // note3: res 的数据源自 list，根据引用关系，不论 push 的早晚，里面的数据都会变动
      res.push(item);
      continue;
    }
    if (item.parentId in map) {
      // note2：更新 parent 就是在更新源数据，list 也会跟着改变
      const parent = map[item.parentId];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
  }
  return res;
}
let list = [
  { id: 1, name: "部门A", parentId: 0 },
  { id: 2, name: "部门B", parentId: 0 },
  { id: 3, name: "部门C", parentId: 1 },
  { id: 4, name: "部门D", parentId: 1 },
  { id: 5, name: "部门E", parentId: 2 },
  { id: 6, name: "部门F", parentId: 3 },
  { id: 7, name: "部门G", parentId: 2 },
  { id: 8, name: "部门H", parentId: 4 },
];
console.log(convert(list));

// class
function newClass(subType, superType) {
  subType.prototype = Object.create(superType.prototype, {
    constructor: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: subType,
    },
  });
  Object.setPrototypeOf(subType, superType);
}

// 冒泡 On^2
// note1: 相邻依次比较并交换，进行 n-1 次，每轮最后一个一定是最大
function bubbleSort(arr) {
  // note：n-1 次
  for (let i = arr.length - 1; i > 0; i--) {
    // note：每轮最后一个已经是最大，不用比了
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], j];
      }
    }
  }
  return arr;
}
// 冒泡：双指针改进
function bubbleSort_2(arr) {
  let left = 0,
    right = arr.length - 1;
  while (left < right) {
    for (let i = left; i < right; i++) {
      if (arr[left] > arr[left + 1]) {
        [arr[left], arr[left + 1]] = [arr[left + 1], arr[left]];
      }
    }
    // note1: right 的位置已经是最大值，故 -1
    right -= 1;
    for (let j = right; j > left; j--) {
      if (arr[right - 1] > arr[right]) {
        [arr[right], arr[right - 1]] = [arr[right - 1], arr[right]];
      }
    }
    left += 1;
  }
  return arr;
}

// 模拟 sort
function bubbleSort(arr, compareFunc) {
  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (compareFunc(arr[j], arr[j + 1]) > 0) {
        swap(arr, j, j + 1);
      }
    }
  }

  return arr;
}

// test
const arr = [91, 60, 96, 7, 35, 65, 10, 65, 9, 30, 20, 31, 77, 81, 24];
console.log(bubbleSort(arr, (a, b) => a - b));
console.log(bubbleSort(arr, (a, b) => b - a));

// 插入
function insertionSort(arr) {
  // note1: 默认第一个数已排好
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i];
    let preIndex = i - 1;
    // note2：大于当前已排好的牌就往前一步
    while (arr[preIndex] > temp) {
      arr[preIndex + 1] = arr[preIndex];
      // note3：多减了 1，后面要加 1
      preIndex -= 1;
    }
    arr[preIndex + 1] = temp;
  }
  return arr;
}

// 二分查找
function binarySearch(arr, value) {
  let min = 0,
    max = arr.length - 1;
  while (min <= max) {
    let mid = Math.floor((min + max) / 2);
    if (arr[mid] === value) {
      return mid;
    } else if (arr[mid] > value) {
      max = mid - 1;
    } else {
      min = mid + 1;
    }
  }
  return "Not Found";
}

// 二分插入排序
function binarySearch(arr, maxi, value) {
  let start = 0,
    end = maxi;
  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    const cur = arr[mid];
    if (cur > value) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return start;
}
const insertionSort = (arr) => {
  // 扑克牌第一张为标准
  for (let i = 1; i < arr.length; i++) {
    const cur = arr[i];
    const insert = binarySearch(arr, i - 1, cur);
    // 综合考虑 start=end=0 的情况
    let pre = i - 1;
    for (let j = i - 1; j >= insert; j--) {
      arr[j + 1] = arr[j];
    }
    arr[insert] = cur;
  }
  return arr;
};
const arr = [91, 60, 96, 7, 35, 65, 10, 65, 9, 30, 20, 31, 77, 81, 24];
console.log(insertionSort(arr));

// 归并排序 O(nlogn)
// 刨析：优先是本身时间复杂度低且稳定，缺点是需要额外的空间，但非常适合链表排序，只需要额外的 O(logn) 空间
const merge = (left, right) => {
  let result = [];
  // 迭代
  while (left.length && right.length) {
    result.push(left[0] <= right[0] ? left.shift() : right.shift());
  }
  // note2: 假如left.length !== right.length，还需要 concat
  return result.concat(left, right);
};
const mergeSort = (arr) => {
  const len = arr.length,
    mid = Math.floor(len / 2);
  // note1: 防止栈溢出
  if (len < 2) return arr;
  const left = arr.splice(0, mid);
  const right = arr;
  // 递归
  return merge(mergeSort(left), mergeSort(right));
};
const arr = [91, 60, 96, 7, 35, 65, 10, 65, 9, 30, 20, 31, 77, 81, 24];
console.log(mergeSort(arr));

// 快速排序 O(nlogn)
// 刨析：同样是分而治之的思想，但相比归并，快排并不稳定
const quickSort = (arr) => {
  // note1: 特判终止
  if (arr.length < 2) return arr;
  // note2: 找一个基准 pivot，然后左右分类
  const pivot = arr[0],
    left = [],
    right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] >= pivot) {
      right.push(arr[i]);
    } else {
      left.push(arr[i]);
    }
  }
  return quickSort(left).concat([pivot], quickSort(right));
};
const arr = [91, 60, 96, 7, 35, 65, 10, 65, 9, 30, 20, 31, 77, 81, 24];
console.log(quickSort(arr));

// 堆排序 O(nlogn)
// 空间复杂度 O(1)
// 从某个 index 开始，依次往下 index++ 比较
const heapify = (arr, n, pivot) => {
  let max = pivot;
  // note1: 递归出口
  if (pivot >= n) return;
  let c1 = 2 * pivot + 1;
  let c2 = 2 * pivot + 2;
  if (c1 < n && arr[c1] > arr[max]) {
    max = c1;
  }
  if (c2 < n && arr[c2] > arr[max]) {
    max = c2;
  }
  // 不等于才交换
  if (max !== pivot) {
    [arr[max], arr[pivot]] = [arr[pivot], arr[max]];
    heapify(arr, n, max);
  }
};
// 建立堆，从某个 index 开始，依次往上 index-- 比较
const buildHeap = (arr, n) => {
  let last = n - 1;
  // note2: 找到 parent = (child - 1) / 2
  let parent = Math.floor((last - 1) / 2);
  for (let i = last; i >= 0; i--) {
    heapify(arr, n, i);
  }
};
// 堆排序
const heapSort = (arr, n) => {
  buildHeap(arr, n);
  for (let i = n - 1; i >= 0; i--) {
    // note3：头尾交换，尾一直变
    [arr[0], arr[i]] = [arr[i], arr[0]];
    // note4：arr 限制长度，后面已经排好了
    heapify(arr, i, 0);
  }
};
let arr = [2, 5, 3, 1, 10, 4];
heapSort(arr, arr.length);
console.log(arr);

// instanceof 判断基本数据类型
class PrimitiveNumber {
  static [Symbol.hasInstance](x) {
    return typeof x === "number";
  }
}
console.log(9 instanceof PrimitiveNumber);

const myInstanceof = (left, right) => {
  if (typeof left !== "object" || left === null) return false;
  let proto = Object.getPrototypeOf(left);
  while (true) {
    if (proto === null) return false;
    if (proto === right.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
};

// Object.is

function myIs(x, y) {
  if (x === y) {
    // 运行到 1/x === 1/y 的时候x和y都为0，
    // 但是1/+0 = +Infinity， 1/-0 = -Infinity, 是不一样的
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // NaN===NaN 是 false, 这是不对的，我们在这里做一个拦截，x !== x，那么一定是 NaN, y 同理
    //两个都是NaN的时候返回true
    return x !== x && y !== y;
  }
}

let f = document.createDocumentFragment();
let el = document.querySelector("#app");
while ((child = el.firstChild)) {
  f.appendChild(child);
}
// console.dir(f.childNodes[0].attributes);

let ary = [12, 8, 24, 16, 1];
// 冒泡:两数比较，大的靠后，当轮最大的必定在后面，每轮不用比较上一轮的胜者。
// 需要比较 length - 1 轮，因为5个数，只要把4个最大的一次放末尾即可。
let temp = null;
function bubble(arr) {
  let l = arr.length;
  for (let i = 0; i < l - 1; i++) {
    for (let j = 0; j < l - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }

      // if (arr[j+1] < arr[j]) [arr[j+1], arr[j]] = [arr[j], arr[j + 1]]
    }
  }
  console.log(arr);
}
// 插入：
function insert(arr) {
  let handle = [];
  handle.push(arr[0]);
  // 从第二张牌开始
  for (let i = 1; i < arr.length; i++) {
    const A = arr[i];
    // 从handle的最后一张牌开始
    for (let j = handle.length - 1; j >= 0; j--) {
      const B = handle[j];
      if (A > B) {
        handle.splice(j + 1, 0, A);
        break;
      }
      if (j === 0) handle.unshift(A);
    }
    // 12,8,24,16,1
    // [12] 1 => [1, 12]
    // [1, 12] 24 => splice(j+1, 0, 24) break; => [1, 12, 24]
    // [1, 12, 24] 16
  }
  console.log(handle);
}
// 快速排序
function quick(arr) {
  if (arr.length <= 1) return arr;
  let middleIndex = Math.floor(arr.length / 2);
  let middleValue = arr.splice(middleIndex, 1)[0];
  let arrLeft = [];
  let arrRight = [];
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    item > middleValue ? arrRight.push(item) : arrLeft.push(item);
  }
  return quick(arrLeft).concat(middleValue, quick(arrRight));
}
// 选择排序
// 归并排序
// 希尔排序
// 堆排序
// 计数排序
// 桶排序
// 基数排序
bubble(ary);
insert(ary);
console.log(quick(ary));

// 数组去重，考虑使用 new Map() 重构
function uniqueEasy(arr) {
  if (!arr instanceof Array) {
    throw Error("当前传入的不是数组！");
  }
  let list = [];
  let obj = {};
  arr.forEach((item) => {
    if (!obj[item]) {
      list.push(item);
      obj[item] = true;
    }
  });
  return list;
}

// 计算重复个数
var cars = ["BMW", "Benz", "Benz", "Tesla"];
var carsObj = cars.reduce(function (obj, name) {
  obj[name] = obj[name] ? ++obj[name] : 1;
  return obj;
}, {});
carsObj;

// 判断是否是回文字符串
function run(input) {
  if (typeof input !== "string") return false;
  return input.split("").reverse().join("") === input;
}
