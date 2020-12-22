"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFoo = void 0;
const TypeScript_1 = require("./TypeScript");
// 当我传一个尚未声明初始化赋值的变量时，如 name，doThingOperator 并没有消息提示
function doThingOperator(options) {
    TypeScript_1.doThing(options);
}
const parameter = {
    name: 'sem',
    age: 18
};
doThingOperator(parameter);
function Greeter(target) {
    target.prototype.greet = function () {
        console.log('bala');
    };
}
function Greeter1(greeting) {
    return function (target) {
        target.prototype.greet = function () {
            console.log(greeting);
        };
    };
}
function Decortor1(inputValue) {
    return function (target) {
        target.prototype.sayHi = function () {
            console.log(inputValue);
        };
    };
}
let SayHi = class SayHi {
    constructor() { }
};
SayHi = __decorate([
    Decortor1('hi !'),
    __metadata("design:paramtypes", [])
], SayHi);
let shi1 = new SayHi();
shi1.sayHi();
/**
 *
 * @param target 被装饰的类
 * @param key 被装饰类的属性名
 */
function logProperty(target, key) {
    delete target[key];
    const backingField = "_" + key;
    Object.defineProperty(target, backingField, {
        writable: true,
        enumerable: true,
        configurable: true
    });
    const getter = function () {
        const currVal = this[backingField];
        console.log(`Get: ${key} => ${currVal}`);
        return currVal;
    };
    const setter = function (newVal) {
        console.log(`Set: ${key} => ${newVal}`);
        this[backingField] = newVal;
    };
    Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
}
class Person89 {
    constructor(name) {
        this.name = name;
    }
}
__decorate([
    logProperty,
    __metadata("design:type", String)
], Person89.prototype, "name", void 0);
const p89 = new Person89('sem');
p89.name = 'sem89';
function Log(target, key, parameterIndex) {
    let functionLogged = key || target.prototype.constructor.name;
    console.log(`The parameter in position ${parameterIndex} at ${functionLogged}
  has
  been decorated`);
}
let Greeter2 = class Greeter2 {
    constructor(other, phrase) {
        this.greeting = phrase;
    }
};
Greeter2 = __decorate([
    __param(1, Log),
    __metadata("design:paramtypes", [Object, String])
], Greeter2);
function addPerson(...args) {
    console.log(`Person info: name: ${args[0]}, age: ${args[1]}`);
}
addPerson('1', 1);
function identity(value, message) {
    let id = {
        value,
        message
    };
    return id;
}
class IdentityClass {
    constructor(value) {
        this.value = value;
    }
    getIdentity() {
        return this.value;
    }
}
const myNumberClass = new IdentityClass(68);
console.log(myNumberClass.getIdentity());
class Door {
}
class SecurityDoor extends Door {
    alert() {
        console.log('security');
    }
}
class Car {
    alert() {
        console.log('car');
    }
}
function ident(args) {
    console.log(args.length);
    return args;
}
function getProperty(obj, key) {
    return obj[key];
}
let pro = {
    name: `getProperty(pro, 'name')`
};
// 确保参数 key 是 T 的健值
console.log(getProperty(pro, 'name'));
let par = {
    name: 'yuql',
    age: 18
};
let par1 = {
    name: 'yuql',
    age: 18
};
let par2 = 'yuql';
async function stringPromise() {
    return "Hello, Semlinker!";
}
const x1 = {
    home: { title: 'yuql' },
    about: { title: 'yuql' },
    contact: { title: 'yuql' }
};
class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
const point1 = new Point2D(1, 2);
function newPoint(pointc, x, y) {
    return new pointc(x, y); // pointc 就是一个构造函数，即  new (x: number, y: number): Point1
}
const point2 = newPoint(Point2D, 1, 2);
// class fanxinglei<T> {
//   create(): T {
//     return new T();
//   }
// }
// class chuanRu {
//   id: number|undefined
// }
// const creator = new fanxinglei<chuanRu>();
// creator.create()
const a5 = undefined;
const b5 = a5; // x! 将从 x 值域中排除 null 和 undefined
console.log(b5);
console.log(void 0); // undefined
// ?. 只识别非 null/undefined
// const a: number = [].push?.();
const inhabitantsOfMunich = 1464301;
const fileSystemPermission = 504;
console.log(inhabitantsOfMunich);
const RE_NON_DIGIT = /[^0-9]/gu; // 除了 0-9 之外的任意字符
class Person88 {
    constructor(name) {
        this.#name = name;
    }
    #name;
    greet() {
        console.log(`Hello, my name is ${this.#name}!`);
    }
}
const per88 = new Person88('yuql');
// 简单工厂模式
class BWM {
}
class BWM730 extends BWM {
    run() {
        console.log('BWM730 发动!');
    }
}
class BWM840 extends BWM {
    run() {
        console.log('BWM840 running!');
    }
}
class BWMFactory {
    static produceBWM(model) {
        if (model === '730') {
            return new BWM730();
        }
        else {
            return new BWM840();
        }
    }
}
const bmw730 = BWMFactory.produceBWM('730');
bmw730.run();
class BWM730Factory {
    produceBWM() {
        return new BWM730();
    }
}
class BWM840Factory {
    produceBWM() {
        return new BWM840();
    }
}
const bWM730Factory = new BWM730Factory();
bWM730Factory.produceBWM().run();
// 发布订阅模式
// import EventEmitter from 'event-emitter';
function EventEmitter1(param) { }
class Proxy {
    constructor() {
        this._hasStart = false;
        EventEmitter1(this);
    }
}
class Player {
    constructor(param) {
        this.id = param.id;
        this.url = param.url;
    }
}
let player = new Player({
    id: 'mse',
    url: '//abc.com/**/*.mp4'
});
class EventEmitter {
    constructor() {
        this.c = new Map();
    }
    // 订阅指定的主题
    subscribe(topic, ...handlers) {
        let topics = this.c.get(topic);
        if (!topics) {
            this.c.set(topic, topics = []);
        }
        topics.push(...handlers);
    }
    // 取消订阅指定的主题
    unsubscribe(topic, handler) {
        if (!handler) {
            return this.c.delete(topic);
        }
        const topics = this.c.get(topic);
        if (!topics) {
            return false;
        }
        const index = topics.indexOf(handler);
        if (index < 0) {
            return false;
        }
        topics.splice(index, 1);
        if (topics.length === 0) {
            this.c.delete(topic);
        }
        return true;
    }
    // 为指定的主题发布消息
    publish(topic, ...args) {
        const topics = this.c.get(topic);
        if (!topics) {
            return null;
        }
        return topics.map(handler => {
            try {
                return handler(...args);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
}
const eventEmitter = new EventEmitter();
eventEmitter.subscribe('ts', msg => console.log(`收到订阅的消息：${msg}`));
eventEmitter.publish('ts', 'publish');
eventEmitter.unsubscribe('ts');
eventEmitter.publish('ts', 'publish');
// 创建 Adaptee 类
class Adaptee {
    specificRequest() {
        console.log('specificRequest of Adaptee is being called');
    }
}
// 创建 Adapter (适配器) 类
class Adapter {
    request() {
        console.log("Adapter's request method is being called");
        var adaptee = new Adaptee();
        adaptee.specificRequest();
    }
}
function show() {
    let adapter = new Adapter();
    adapter.request();
}
class FileLogger {
    async info(message) {
        console.log(message);
        console.log("This Message was saved with FileLogger");
    }
}
// 通知服务类
class NotificationService {
    constructor(logger) {
        this.logger = logger;
    }
    async send(message) {
        await this.logger.info(`Notification sended: ${message}`);
    }
}
(async () => {
    const fileLogger = new FileLogger();
    const notificationService = new NotificationService(fileLogger);
    await notificationService.send('hello sem, to file');
})();
// 日志实现类
class AliLogger {
    async sendToService(message, type) {
        console.log(message);
        console.log('This Message was saved with Alilogger');
    }
}
// 适配器
class CloudLoggerAdapter {
    constructor(cloudLogger) {
        this.cloudLogger = cloudLogger;
    }
    async info(message) {
        await this.cloudLogger.sendToService(message, 'info');
    }
}
(async () => {
    const ali = new AliLogger();
    const cloud = new CloudLoggerAdapter(ali);
    const notify = new NotificationService(cloud);
    await notify.send('hello sem, to Cloud');
})();
// 享元模式
class Iphone11 {
    constructor(model, screen, memory, sn) { }
}
const phones = [];
for (let i = 0; i < 1000; i++) {
    let memory = i % 2 == 0 ? 128 : 256;
    phones.push(new Iphone11('iphone11', 6.1, memory, i));
}
// 享元类
class IphoneFlyweight {
    constructor(model, screen, memory) { }
}
class FlyweightFactory {
    constructor() {
        // key/value 的形式
        this.phonesMap = {};
    }
    get(model, screen, memory) {
        const key = model + screen + memory;
        if (!this.phonesMap[key]) {
            this.phonesMap[key] = new IphoneFlyweight(model, screen, memory);
        }
        return this.phonesMap[key];
    }
}
// 定义 Iphone 类
class Iphone {
    constructor(flyweight, sn) { }
}
class IphoneFactory {
    getIphone(model, screen, memory, sn) {
        const flyweight = IphoneFactory.flyweightFactory.get(model, screen, memory);
        return new Iphone(flyweight, sn);
    }
}
IphoneFactory.flyweightFactory = new FlyweightFactory();
// 单例模式
class Singleton {
    constructor() { } // ?
    static getInstance() {
        if (!Singleton.singleton) {
            Singleton.singleton = new Singleton();
        }
        return Singleton.singleton;
    }
}
const ins1 = Singleton.getInstance();
const ins2 = Singleton.getInstance();
console.log(ins1 === ins2);
class ConcreteObserver {
    constructor(name) {
        this.name = name;
    }
    notify() {
        console.log(`${this.name} has been notified.`);
    }
}
class Subject {
    constructor() {
        this.observers = [];
    }
    addObserver(observer) {
        console.log(observer, 'is pushed!');
        this.observers.push(observer);
    }
    deleteObserver(observer) {
        console.log();
        const n = this.observers.indexOf(observer);
        n != -1 && this.observers.splice(n, 1);
    }
    notifyObservers() {
        console.log();
        this.observers.forEach(observer => observer.notify());
    }
}
const subject = new Subject();
const xiaoQin = new ConcreteObserver("⼩秦");
const xiaoWang = new ConcreteObserver("⼩王");
subject.addObserver(xiaoQin);
subject.addObserver(xiaoWang);
subject.notifyObservers();
subject.deleteObserver(xiaoQin);
subject.notifyObservers();
class Authenticator {
    constructor() {
        this.strategy = null;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    authenticate(...args) {
        if (!this.strategy)
            return console.log('尚未设置认证策略');
        return this.strategy.authenticate(...args);
    }
}
class WechatStrategy {
    authenticate(wechatToken) {
        if (wechatToken !== '123') {
            return console.log('无效的微信用户');
        }
        console.log('微信认证成功');
    }
}
class LocalStrategy {
    authenticate(username, password) {
        if (username !== 'abao' && password !== '123') {
            console.log('账号或密码错误');
            return;
        }
        console.log('账号和密码认证成功');
    }
}
const auth = new Authenticator();
auth.setStrategy(new WechatStrategy());
auth.authenticate('123456');
auth.setStrategy(new LocalStrategy());
auth.authenticate('abao', '123');
class AbstractHandler {
    addMiddleware(h) {
        this.next = h;
        return this.next;
    }
    get(url, callback) {
        if (this.next) {
            return this.next.get(url, callback);
        }
    }
}
// 定义 Auth 中间件
class Auth extends AbstractHandler {
    constructor(username, password) {
        super();
        this.isAuthenticated = false;
        if (username === 'abao' && password === '123') {
            this.isAuthenticated = true;
        }
        console.log(this.isAuthenticated);
    }
    get(url, callback) {
        if (this.isAuthenticated) {
            return super.get(url, callback);
        }
        else {
            throw new Error('Not Authorized');
        }
    }
}
// 定义 Logger 中间件
class Logger1 extends AbstractHandler {
    get(url, callback) {
        console.log('/GET Request to: ', url);
        return super.get(url, callback);
    }
}
class Route extends AbstractHandler {
    constructor() {
        super();
        this.URLMaps = {
            '/api/todos': [{ title: 'learn ts' }, { title: 'learn react' }],
            '/api/random': Math.random(),
        };
    }
    get(url, callback) {
        super.get(url, callback);
        if (this.URLMaps.hasOwnProperty(url)) {
            callback(this.URLMaps[url]);
        }
    }
}
const route = new Route();
route.addMiddleware(new Auth('abao', '123')).addMiddleware(new Logger1());
console.log(route);
route.get('/api/todos', data => {
    console.log(JSON.stringify({ data }, null, 2));
});
// 1. 初始化声明 URLMaps
// 2. route 对象调用父类方法 addMiddleware
// 3. 执行 Auth 的构造函数，isAuthenticated = true
// 4. 返回 this.next，即 Ihandler，可以继续调用 addMiddleware
const Ioc = __importStar(require("./IoC"));
console.log(Ioc.legendenery);
function loadFoo() {
    // 这是懒加载 foo，原始的加载仅仅用来做类型注解
    // const _foo: typeof foo = require('foo');
    // 现在，你可以使用 `_foo` 替代 `foo` 来作为一个变量使用
}
exports.loadFoo = loadFoo;
const albums = [{
        artist: "Michael Jackson",
        title: "Dangerous",
        releaseDate: new Date("1991-12-02"),
        recordingType: "studio",
    }];
function pluck(record, key) {
    // console.log(record)
    const res = record.map((r) => {
        // console.log(r[key]);
        return r[key];
    });
    console.log(res);
    return res;
}
let releaseDateArr = pluck(albums, 'releaseDate');
function renderPage(state) {
    const { currentPage } = state; // currentPage: string
    const requestState = state.requests[currentPage];
    switch (requestState.state) {
        case "pending":
            return `⻚⾯加载中~~~`;
        case "error":
            return `呜呜呜，加载第${currentPage}⻚出现异常了...${requestState.errorMsg}`;
        case "ok":
            `<div>第${currentPage}⻚的内容：${requestState.pageContent}</div>`;
    }
}
function double(x) {
    return x + x;
}
const num = double(10);
const str = double('ts');
console.log(num);
function doubleFn(x) {
    return double(x);
}
const pt = {
    x: 3,
    y: 4
};
const id = {
    name: "Pythagoras"
};
// 扩展符比  Object.assign 更加好用
const namedPoint = { ...pt, ...id };
namedPoint.name;
var hasMiddle = true;
const firstLast = {
    first: "Harry",
    last: "Truman",
};
const president = {
    ...firstLast,
    ...(hasMiddle ? { middle: 'S' } : {})
};
console.log(president.middle);
let numArr = [1, 2];
let reversedNum = numArr.reverse();
console.log(reversedNum);
function extend(first, second) {
    const result = {};
    for (let id in first) {
        result[id] = first[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) { // 以 T 优先级为准？
            result[id] = second[id];
        }
    }
    return result;
}
bui = 123;
function createCrazy(ctor) {
    return new ctor();
}
class CrazyClass {
    constructor() {
        this.hello = 123;
        return {
            hello: this.hello
        };
    }
}
const digital = createCrazy(CrazyClass);
