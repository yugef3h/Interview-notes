// 声明文件 .d.ts
declare module 'foo' {
  var bar: number;
  export = bar;
}

declare var __foo__: boolean;
// export default __foo__;