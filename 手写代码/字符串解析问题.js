var a = {
  b: 123,
  c: '456',
  e: '789',
}
var str=`a{a.b}aa{a.c}aa {a.d}aaaa`;
// => 'a123aa456aa {a.d}aaaa'

// 实现函数使得将str字符串中的{}内的变量替换，如果属性不存在保持原样（比如{a.d}）

// 类似于模版字符串，但有一点出入，实际上原理大差不差
const fn1 = (str, obj) => {
  let res = '';
  // 标志位，标志前面是否有{
  let flag = false;
  let start;
  for (let i = 0; i < str.length; i++) {
      if (str[i] === '{') {
          flag = true;
          start = i + 1;
          continue;
      }
      if (!flag) res += str[i];
      else {
          if (str[i] === '}') {
              flag = false;
              res += match(str.slice(start, i), obj);
          }
      }
  }
  return res;
}
// 对象匹配操作
const match = (str, obj) => {
  const keys = str.split('.').slice(1);
  let index = 0;
  let o = obj;
  while (index < keys.length) {
      const key = keys[index];
      if (!o[key]) {
          return `{${str}}`;
      } else {
          o = o[key];
      }
      index++;
  }
  return o;
}
