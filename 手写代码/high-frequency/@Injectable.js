var metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
}

var HttpService = /** @class */ (function() {
  function HttpService(httpClient) {
    this.httpClient = httpClient; // 这里类型 HttpClient 已经被擦除
  }
  var _a;
  // 由于编译后类型会被擦除，为了保证运行时能注入正确的依赖对象，故要保存元数据
  // 利用 Reflect.metadata 存储元数据，在这里即 HttpClient
  // 装饰器必须搭配 import "reflect-metadata";
  HttpService = __decorate([
    Injectable(), // params1
    __metadata("design:paramtypes", [typeof (_a = typeof      HttpClient !== 'undefined' && HttpClient) === 'function' ? _a : Object]) // params2
  ],
  HttpService);
  return HttpService;
})()