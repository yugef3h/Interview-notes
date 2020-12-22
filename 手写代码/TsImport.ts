import { doThing, exportOptions } from './TypeScript'

// 当我传一个尚未声明初始化赋值的变量时，如 name，doThingOperator 并没有消息提示
function doThingOperator(options: exportOptions) {
  doThing(options)
}
const parameter = {
  name: 'sem',
  age: 18
}
doThingOperator(parameter)

function Greeter(target: Function) {
  target.prototype.greet = function (): void {
    console.log('bala')
  }
}
function Greeter1(greeting: string) {
  return function (target: Function) {
    target.prototype.greet = function (): void {
      console.log(greeting)
    }
  }
}
function Decortor1(inputValue: string) {
  return function (target: Function) {
    target.prototype.sayHi = function (): void {
      console.log(inputValue)
    }
  }
}
@Decortor1('hi !')
class SayHi {
  constructor() { }
}
let shi1 = new SayHi();
(<any>shi1).sayHi()
/**
 * 
 * @param target 被装饰的类
 * @param key 被装饰类的属性名
 */
function logProperty(target: any, key: string) {
  delete target[key];
  const backingField = "_" + key;
  Object.defineProperty(target, backingField, {
    writable: true,
    enumerable: true,
    configurable: true
  })
  const getter = function (this: any) {
    const currVal = this[backingField];
    console.log(`Get: ${key} => ${currVal}`);
    return currVal;
  }
  const setter = function (this: any, newVal: any) {
    console.log(`Set: ${key} => ${newVal}`);
    this[backingField] = newVal;
  }
  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  })
}

class Person89 {
  @logProperty
  public name: string;
  constructor(name: string) {
    this.name = name
  }
}
const p89 = new Person89('sem')
p89.name = 'sem89'

function Log(target: Function, key: string, parameterIndex: number) {
  let functionLogged = key || target.prototype.constructor.name;
  console.log(`The parameter in position ${parameterIndex} at ${functionLogged}
  has
  been decorated`);
}
class Greeter2 {
  greeting: string;
  constructor(other: any, @Log phrase: string) {
    this.greeting = phrase;
  }
}

function addPerson(...args: [name: string, age: number]): void {
  console.log(`Person info: name: ${args[0]}, age: ${args[1]}`)
}

addPerson('1', 1)

interface Identities<V, M> {
  value: V,
  message: M
}
function identity<T, U> (value: T, message: U): Identities<T, U> {
  let id: Identities<T, U> = {
    value,
    message
  }
  return id;
}

interface GenericInterface<U> {
  value: U,
  getIdentity: () => U
}
class IdentityClass<T> implements GenericInterface<T> {
  value: T;
  constructor(value: T) {
    this.value = value
  }
  getIdentity(): T {
    return this.value
  }
}
const myNumberClass = new IdentityClass<Number>(68);
console.log(myNumberClass.getIdentity())


// 举例来说，门是一个类，防盗门是门的子类。如果防盗门有一个报警器的功能，
// 我们可以简单的给防盗门添加一个报警方法。这时候如果有另一个类，车，也有
// 报警器的功能，就可以考虑把报警器提取出来，作为一个接口，防盗门和车都去实现它
interface Alerm {
  alert(): void;
}
class Door {}
class SecurityDoor extends Door implements Alerm {
  alert() {
    console.log('security')
  }
}
class Car implements Alerm {
  alert() {
    console.log('car')
  }
}

function ident<T> (args: T[]): T[] {
  console.log(args.length)
  return args
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
	return obj[key];
}

let pro = {
  name: `getProperty(pro, 'name')`
}
// 确保参数 key 是 T 的健值
console.log(getProperty(pro, 'name'))

interface User {
  name: string;
  age: number;
}

type Func = () => User
type Test1 = ReturnType<Func>
let par: Test1 = {
  name: 'yuql',
  age: 18
}

type ParamType<T> = T extends (param: infer P) => any ? P : T;
type Func1 = (user: User) => void
type Param = ParamType<Func1> // User
let par1: Param = {
  name: 'yuql',
  age: 18
}
type Str = ParamType<string> // string
let par2: Str = 'yuql'

async function stringPromise() {
  return "Hello, Semlinker!"; 
}
type myself = typeof stringPromise

interface PageInfo {
  title: string;
}
type Page = 'home' | 'about' | 'contact';
const x1: Record<Page, PageInfo> = { // in Page: PageInfo
  home: { title: 'yuql' },
  about: { title: 'yuql' },
  contact: { title: 'yuql' }
}

type T0 = Exclude<'a'|'b'|'c', 'a'>;
type T1 = 'a'|'b'|'c'
type T2 = ReturnType<<T>() => T>;
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;

interface Point1 {
  x: number;
  y: number;
}

interface PointConstructor {
  new (x: number, y: number): Point1;
}

class Point2D implements Point1 {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const point1 = new Point2D(1, 2);

function newPoint(
  pointc: PointConstructor,
  x: number,
  y: number
): Point1 {
  return new pointc(x,y); // pointc 就是一个构造函数，即  new (x: number, y: number): Point1
}

const point2: Point1 = newPoint(Point2D, 1, 2);

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

const a5: number | undefined = undefined;
const b5: number = a5!; // x! 将从 x 值域中排除 null 和 undefined
console.log(b5)
console.log(void 0) // undefined
// ?. 只识别非 null/undefined
// const a: number = [].push?.();


const inhabitantsOfMunich = 1_464_301;
const fileSystemPermission = 0b111_111_000;
console.log(inhabitantsOfMunich)

const RE_NON_DIGIT = /[^0-9]/gu; // 除了 0-9 之外的任意字符

class Person88 {
  #name: string;
  constructor(name: string) {
    this.#name = name;
  }
  greet() {
    console.log(`Hello, my name is ${this.#name}!`);
  }
}
const per88 = new Person88('yuql')

// 简单工厂模式
abstract class BWM {
  abstract run(): void;
}

class BWM730 extends BWM {
  run(): void {
    console.log('BWM730 发动!')
  }
}

class BWM840 extends BWM {
  run(): void {
    console.log('BWM840 running!')
  }
}

class BWMFactory {
  public static produceBWM(model: '730' | '840'): BWM {
    if (model === '730') {
      return new BWM730();
    } else {
      return new BWM840();
    }
  }
}

const bmw730 = BWMFactory.produceBWM('730');
bmw730.run();

// 工厂方法模式：创建不同的工厂来生成对象

interface IBWMFactory {
  produceBWM(): BWM;
}

class BWM730Factory implements IBWMFactory {
  produceBWM(): BWM {
    return new BWM730();
  }
}

class BWM840Factory implements IBWMFactory {
  produceBWM(): BWM {
    return new BWM840();
  }
}

const bWM730Factory = new BWM730Factory();
bWM730Factory.produceBWM().run();

// 发布订阅模式

// import EventEmitter from 'event-emitter';

function EventEmitter1(param: any) {}

class Proxy {
  _hasStart: boolean;
  constructor() {
    this._hasStart = false;
    EventEmitter1(this);
  }
}

interface Paramer {
  id: string;
  url: string;
}

class Player {
  id: string;
  url: string;
  constructor(param: Paramer) {
    this.id = param.id;
    this.url = param.url;
  }
}

let player: Paramer = new Player({
  id: 'mse',
  url: '//abc.com/**/*.mp4'
})

type EventHandler = (...args: any[]) => any;

class EventEmitter {
  private c = new Map<string, EventHandler[]>();
  // 订阅指定的主题
  subscribe(topic: string, ...handlers: EventHandler[]) { // handlers 订阅的对象。
    let topics = this.c.get(topic);
    if (!topics) {
      this.c.set(topic, topics = []);
    }
    topics.push(...handlers);
  }
  // 取消订阅指定的主题
  unsubscribe(topic: string, handler?: EventHandler): boolean {
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
  publish(topic: string, ...args: any[]): any[] | null {
    const topics = this.c.get(topic);
    if (!topics) {
      return null;
    }
    return topics.map(handler => {
      try {
        return handler(...args);
      } catch(e) {
        console.error(e);
        return null;
      }
    });
  }
}

const eventEmitter = new EventEmitter();
eventEmitter.subscribe('ts', msg => console.log(`收到订阅的消息：${msg}`));
eventEmitter.publish('ts', 'publish')
eventEmitter.unsubscribe('ts')
eventEmitter.publish('ts', 'publish')

// 适配器
interface Target {
  request(): void;
}
// 创建 Adaptee 类
class Adaptee {
  public specificRequest(): void {
    console.log('specificRequest of Adaptee is being called')
  }
}
// 创建 Adapter (适配器) 类
class Adapter implements Target {
  public request(): void {
    console.log("Adapter's request method is being called");
    var adaptee: Adaptee  = new Adaptee();
    adaptee.specificRequest();
  }
}
function show(): void {
  let adapter: Adapter = new Adapter();
  adapter.request();
}


// 适配器模式
interface Logger {
  info(message: string): Promise<void>;
}

interface CloudLogger {
  sendToService(message: string, type: string): Promise<void>;
}

class FileLogger implements Logger {
  public async info(message: string): Promise<void> {
    console.log(message);
    console.log("This Message was saved with FileLogger");
  }
}
// 通知服务类
class NotificationService {
  protected logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger
  }
  public async send(message: string): Promise<void> { // async...: Promise<void>
    await this.logger.info(`Notification sended: ${message}`);
  }
}

(async () => {
  const fileLogger = new FileLogger();
  const notificationService = new NotificationService(fileLogger);
  await notificationService.send('hello sem, to file');
})();


// 日志实现类
class AliLogger implements CloudLogger {
  public async sendToService(message: string, type: string): Promise<void> {
    console.log(message);
    console.log('This Message was saved with Alilogger');
  }
}
// 适配器
class CloudLoggerAdapter implements Logger {
  protected cloudLogger: CloudLogger;
  constructor (cloudLogger: CloudLogger) {
    this.cloudLogger = cloudLogger;
  }
  public async info (message: string): Promise<void> {
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
  constructor(model: string, screen: number, memory: number, sn: number) {}
}
const phones = []
for (let i=0; i<1000; i++) {
  let memory = i % 2 == 0 ? 128 : 256;
  phones.push(new Iphone11('iphone11', 6.1, memory, i))
}

// 享元类
class IphoneFlyweight {
  constructor(model: string, screen: number, memory: number) {}
}

class FlyweightFactory {
  // key/value 的形式
  private phonesMap: { [s: string]: IphoneFlyweight } = {}
  public get(model: string, screen: number, memory: number): IphoneFlyweight {
    const key = model + screen + memory;
    if (!this.phonesMap[key]) {
      this.phonesMap[key] = new IphoneFlyweight(model, screen, memory);
    }
    return this.phonesMap[key];
  }
}

// 定义 Iphone 类
class Iphone {
  constructor(flyweight: IphoneFlyweight, sn: number) {}
}

class IphoneFactory {
  private static flyweightFactory: FlyweightFactory = new FlyweightFactory();
  public getIphone(
    model: string,
    screen: number,
    memory: number,
    sn: number
  ) {
    const flyweight: IphoneFlyweight = IphoneFactory.flyweightFactory.get(
      model,
      screen,
      memory
    );
    return new Iphone(flyweight, sn);
  }
}

// 单例模式
class Singleton {
  private static singleton: Singleton;
  private constructor() {} // ?
  public static getInstance(): Singleton {
    if (!Singleton.singleton) {
      Singleton.singleton = new Singleton()
    }
    return Singleton.singleton;
  }
}

const ins1 = Singleton.getInstance()
const ins2 = Singleton.getInstance()
console.log(ins1 === ins2)

// 观察者模式
interface Observer {
  notify: Function;
}
class ConcreteObserver implements Observer {
  constructor(private name: string) {}
  notify() {
    console.log(`${this.name} has been notified.`);
  }
}
class Subject {
  private observers: Observer[] = [];
  public addObserver(observer: Observer): void {
    console.log(observer, 'is pushed!');
    this.observers.push(observer);
  }
  public deleteObserver(observer: Observer): void {
    console.log()
    const n: number = this.observers.indexOf(observer);
    n != -1 && this.observers.splice(n, 1);
  }
  public notifyObservers(): void {
    console.log()
    this.observers.forEach(observer => observer.notify())
  }
}

const subject: Subject = new Subject();
const xiaoQin = new ConcreteObserver("⼩秦");
const xiaoWang = new ConcreteObserver("⼩王");
subject.addObserver(xiaoQin);
subject.addObserver(xiaoWang);
subject.notifyObservers();
subject.deleteObserver(xiaoQin);
subject.notifyObservers();

// 策略模式
interface Strategy {
  authenticate(...args: any): any;
}

class Authenticator {
  strategy: any;
  constructor() {
    this.strategy = null;
  }
  setStrategy(strategy: any) {
    this.strategy = strategy;
  }
  authenticate(...args: any) {
    if (!this.strategy) return console.log('尚未设置认证策略');
    return this.strategy.authenticate(...args);
  }
}

class WechatStrategy implements Strategy {
  authenticate(wechatToken: string) {
    if (wechatToken !== '123') {
      return console.log('无效的微信用户')
    }
    console.log('微信认证成功')
  }
}
class LocalStrategy implements Strategy {
  authenticate(username: string, password: string) {
    if (username !== 'abao' && password !== '123') {
      console.log('账号或密码错误');
      return;
    }
    console.log('账号和密码认证成功');
  }
}

const auth = new Authenticator()
auth.setStrategy(new WechatStrategy());
auth.authenticate('123456');
auth.setStrategy(new LocalStrategy());
auth.authenticate('abao', '123')

// 职责链模式
interface IHandler {
  addMiddleware(h: IHandler): IHandler;
  get(url: string, callback: (data: any) => void): void;
}
abstract class AbstractHandler implements IHandler {
  next!: IHandler;
  addMiddleware(h: IHandler) {
    this.next = h;
    return this.next;
  }
  get(url: string, callback: (data: any) => void) {
    if (this.next) {
      return this.next.get(url, callback);
    }
  }
}

// 定义 Auth 中间件
class Auth extends AbstractHandler {
  isAuthenticated: boolean;
  constructor(username: string, password: string) {
    super();
    this.isAuthenticated = false
    if (username === 'abao' && password === '123') {
      this.isAuthenticated = true
    }
    console.log(this.isAuthenticated)
  }
  get(url: string, callback: (data: any) => void) {
    if (this.isAuthenticated) {
      return super.get(url, callback);
    } else {
      throw new Error('Not Authorized');
    }
  }
}

// 定义 Logger 中间件
class Logger1 extends AbstractHandler {
  get(url: string, callback: (data: any) => void) {
    console.log('/GET Request to: ', url);
    return super.get(url, callback);
  }
}

class Route extends AbstractHandler {
  URLMaps: { [key: string]: any };
  constructor() {
    super();
    this.URLMaps = {
      '/api/todos': [{title: 'learn ts'}, {title: 'learn react'}],
      '/api/random': Math.random(),
    }
  }
  get(url: string, callback: (data: any) => void) {
    super.get(url, callback);
    if (this.URLMaps.hasOwnProperty(url)) {
      callback(this.URLMaps[url]);
    }
  }
}

const route = new Route();
route.addMiddleware(new Auth('abao', '123')).addMiddleware(new Logger1());
console.log(route)
route.get('/api/todos', data => {
  console.log(JSON.stringify({data}, null, 2));
});

// 1. 初始化声明 URLMaps
// 2. route 对象调用父类方法 addMiddleware
// 3. 执行 Auth 的构造函数，isAuthenticated = true
// 4. 返回 this.next，即 Ihandler，可以继续调用 addMiddleware

import * as Ioc from './IoC'
console.log(Ioc.legendenery)

// import * as foo from 'foo' // ? global.d.ts
import foo = require('foo');
export function loadFoo() {
  // 这是懒加载 foo，原始的加载仅仅用来做类型注解
  // const _foo: typeof foo = require('foo');
  // 现在，你可以使用 `_foo` 替代 `foo` 来作为一个变量使用
}

interface SaveAction {
  type: 'save'
}
interface LoadAction {
  type: 'load'
}
type Action = SaveAction | LoadAction;
type ActionType = Action['type'];

interface Album {
  artist: string;
  title: string;
  releaseDate: Date;
  recordingType: "studio" | "other"
}

const albums: Album[] = [{
  artist: "Michael Jackson",
  title: "Dangerous",
  releaseDate: new Date("1991-12-02"),
  recordingType: "studio",
}];

function pluck<T, K extends keyof T>(record:T[], key:K): T[K][] {
  // console.log(record)
  const res = record.map((r) => {
    // console.log(r[key]);
    return r[key]
  });
  console.log(res);
  return res
}

let releaseDateArr = pluck(albums, 'releaseDate')

interface RequestPending {
  state: "pending"; 
}
interface RequestError {
  state: "error";
  errorMsg: string;
}
interface RequestSuccess {
  state: "ok";
  pageContent: string;
}
type RequestState = RequestError | RequestPending | RequestSuccess;

interface State {
  currentPage: string;
  requests: {
    [page: string]: RequestState
  };
}

function renderPage(state: State) {
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
// 重载
function double<T extends number | string>(x: T): T extends string ? string : number;
function double(x: any) {
  return x + x;
}
const num = double(10);
const str = double('ts');
console.log(num)

function doubleFn(x: number | string) {
  return double(x);
}

const pt = {
  x: 3,
  y: 4
}
const id = {
  name: "Pythagoras"
}
// 扩展符比  Object.assign 更加好用
const namedPoint = {...pt, ...id}
namedPoint.name;

declare var hasMiddle: boolean;
var hasMiddle = true;
const firstLast = {
  first: "Harry",
  last: "Truman",
};
const president = {
  ...firstLast,
  ...(hasMiddle ? { middle: 'S' } : {})
};
console.log(president.middle)

let numArr = [1,2];
let reversedNum = numArr.reverse();
console.log(reversedNum)

function extend<T extends object, U extends object>(first: T, second: U): T & U {
  const result = <T & U>{};
  for (let id in first) {
    (<T>result)[id] = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) { // 以 T 优先级为准？
      (<U>result)[id] = second[id];
    }
  }
  return result;
}

declare var bui: any;
bui = 123;

// [参考资料](https://stackoverflow.com/questions/37654840/constructor-provides-no-match-for-signature-new)
// constructor provides no match for signature new
interface CrazyInterface {
  hello: number
}
interface CrazyConstructor {
  new (): CrazyInterface
}
function createCrazy(ctor: CrazyConstructor): CrazyInterface {
  return new ctor();
}
class CrazyClass implements CrazyInterface {
  hello: number;
  constructor() {
    this.hello = 123;
    return {
      hello: this.hello
    }
  }
}
const digital = createCrazy(CrazyClass);

