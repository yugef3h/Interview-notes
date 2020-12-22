// tsc .ts
// 编译时静态检查
function greet(person: string) {
  return 'Hello,' + person
}
console.log(greet('TypeScript'))


// 数字枚举支持反向映射
enum Direction {
  NORTH = 3,
  SOUTH,
  EAST,
  WEST,
}
let dir: Direction = Direction.NORTH

let value: any;
// 编译可以，但执行依旧报错
// console.log(value.foo)
// console.log(value.foo.bar)

let tupleType: [string, boolean];
tupleType = ['name', true];

function fanxing<T> (arg: T[]): T[] {
  console.log(arg.length)
  return arg
}
let myFanxing: <T>(arg: Array<T>) => Array<T> = fanxing

interface xiaojiejie {
  uname: string
  age: number
}

let xiaojie: { name: string } = { name: 'yuql' }
console.log(xiaojie)

interface Girl {
  name: string
  age: number;
  student?: string;
  [propName: string]: any,
  // exam: boolean
}
const girl = {
  name: 'yu',
  age: 18,
  sex: '♀',
  ad: 'ad'
}
function obj1({name, age, sex, ad}: Girl): void {
  console.log(name + age + sex + ad)
}
obj1(girl)

enum ActiveType {
  active = 1,
  inactive = 2,
  type = 'type3'
}

function isActive(type: ActiveType) {}
isActive(ActiveType.active);

// ============================== compile result:
// var ActiveType;
// (function (ActiveType) {
//     ActiveType[ActiveType["active"] = 1] = "active";
//     ActiveType[ActiveType["inactive"] = 2] = "inactive";
// })(ActiveType || (ActiveType = {}));
// function isActive(type) { }
// isActive(ActiveType.active);

console.log(ActiveType[1]) // OK
console.log(ActiveType.active)
console.log(ActiveType.type)
console.log(ActiveType)
ActiveType[10]; // OK！！！
enum EvidenceTypeEnum {
  UNKNOWN = '',
  PASSPORT_VISA = 'passport_visa',
  PASSPORT = 'passport',
  SIGHTED_STUDENT_CARD = 'sighted_tertiary_edu_id'
}
console.log(EvidenceTypeEnum.PASSPORT)
interface Person {
  name: string;
  age: number;
  location: boolean;
}
type K1 = keyof Person; // "name" | "age" | "location""
type K2 = keyof Person[];
type K3 = keyof { [x: string]: Person }; // 对象本身是有长度的
type K4 = keyof { [x: string]: 1 }
type K5 = keyof { [x: number]: string }
// 返回的是 key
const arg1: K1 = 'name'
const arg2: K2 = 'push'


class Person1 {
  name: string = 'person'
  age: number = 18
}

let man: Person1 = {
  name: "S",
  age: 30
}

type Human = typeof man
type H = Person1

let sname: keyof Person1 // 限制了 sname 只能为 Person1 的属性 key
sname = 'name'

type P1 = Person1['name' | 'age']

function prop<T extends object, K extends keyof T>(obj: T, key: K) {
  // return (obj as any)[key]
  return obj[key]
}

type Todo = {
  id: number;
  text: string;
  done: boolean;
}

const todo: Todo = {
  id: 1,
  text: '1',
  done: false
}
// 泛型约束  extends + 属性约束 keyof
function props<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
const id = props(todo, 'id');

class ClassWithNumbericProperty {
  [1]: string = 'Semlinker'
}

let classNumber = new ClassWithNumbericProperty()
console.log(`${classNumber[1]}`)

enum Currency {
  CNY = 6,
  EUR = 8,
  USD = 10
}

const CurrencyName = {
  [Currency.CNY]: "人民币",
  [Currency.EUR]: "欧元",
  [Currency.USD]: "美元"
}

function getCur<T, K extends keyof T>(key: K, map: T): T[K] {
  return map[key];
}
console.log(`name=${getCur(Currency.CNY, CurrencyName)}`)

// const sym=Symbol();
// let obj= {  
//   [sym]: "semlinker",
// };
// console.log(obj[sym]);

Object.create(null);

const yxiu = {}
yxiu.toString()


type FOO1 = string | number;
function controlFlowAnalysisWithNever(foo: FOO1) {
  if (typeof foo === 'string') {
    // 
  } else if (typeof foo === 'number') {
    // 
  } else {
    const check: never = foo
  }
}

let someValue: any = 'this is a string'
let strLength: number = (someValue as string).length

// 非空断言
function myFunc(maybeString: string|undefined|null): string {
  const onlyString: string = maybeString!
  console.log(onlyString)
  return onlyString
}
myFunc('yuql')

interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log("Name: " + emp.name);
  if ("privileges" in emp) {}
  if ("startDate" in emp) {}
  if (typeof emp.name === 'string' ) {}
  switch(typeof emp.name) {
    case "string":
      return emp.name;
  }
}

interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}

let padder: Padder = new SpaceRepeatingPadder(6);
if (padder instanceof SpaceRepeatingPadder) {}


// 自定义 isNumber 的类型保护
function isNumber(x: any): x is number {
  return typeof x === 'number';
}

console.log(isNumber('1'));

let union: 1|2 = 2;

interface MotorCycle {
  vType: "motorcycle";
  make: number;
}

// 联合类型不仅仅是基础属性还可以是接口、甚至是复合类型。
let type1: MotorCycle = {
  vType: "motorcycle",
  make: 1
}

interface point {
  x: number;
}
type PartialPointX = {x: number;};
type Point = PartialPointX & {y: number;};
let point: Point = {
  x: 1,
  y: 1
}

interface D {d: boolean}
interface E {e: string}
interface A {x: D}
interface B {x: E}
type AB = A & B
let ab: AB = {
  x: {
    d: true,
    e: 'semlinker'
  }
}




// 数组解构
let x1: number;
let y1: number;
let z1: number;
let five_array = [0,1,2,3,4];
[x1,y1,z1] = five_array

let person = {
  name1: 'semlinker',
  gender: 'male',
  address: 'xiamen'
}

let {name1, ...rest} = person
console.log(rest)

interface Person9 {
  readonly name: string;
}

let p9: Person9 = {
  name: '1'
}
// p9.name = '2';
// 确保数组创建后不可变，应用场景在哪？
let a8: number[] = [1,2,3,4];
let ro: ReadonlyArray<number> = a8;
// ro[0] = 12;

interface SetPoint {
  (x: number, y: number): void
}
// 异常???
let anonymousFn: SetPoint = (x: number, y: number): number => {
  return 1;
}
anonymousFn(1, 2);

// 扩展  extends or &
interface PartialPointX1 {x: number}
type Point1 = PartialPointX1 & {y: number}

class Greeter {
  constructor(message: string) {
    this.greeting = message
  }
  static cname: string = 'Greeter'
  greeting: string;
  static getClassName() {
    return "Class name is Greeter";
  }
}

console.log(Greeter.cname)
console.log(Greeter.getClassName())

let passcode = 'hello'
class Em {
  private _fullName!: string;
  get fullName(): string {
    return this._fullName
  }
  set fullName(newName: string) {
    if (passcode && passcode === 'hello') {
      this._fullName = newName
    } else {
      console.log('error')
    }
  }
}
let emp1 = new Em()
emp1.fullName = 's'
if (emp1.fullName) console.log(emp1.fullName)

abstract class Per1 {
  constructor(public name: string) {}
  abstract say(words: string): void;
}

class Dev extends Per1 {
  constructor(name: string) {
    super(name) // 调用父类的构造函数
  }
  say(words: string): void {
    console.log(`${this.name} say ${words}`)
  }
}

// 重载的意义？
// 编译时就查出问题，比如一个 Number.prototype.toFixed
// 重载的定义：最后一个非重载列表是一个联合类型或者说是一个 ?:
type Combinable = string | number;
function add(a: number, b: number): number;
function add(a: string, b: string, c: string): string;
function add(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}
console.log(add(1,2))
console.log(add('1','2','3'))

class ProductService {
  getProducts(): void;
  getProducts(id: number): void;
  getProducts(id?: number): void {
    if (typeof id === 'number') {}
    else {}
  }
}

function identity <T, U>(value: T, message: U): T {
  return value
}
identity<Number, string>(Number.MAX_VALUE, 'e')
interface GenericIdentityFn<T> {
  (arg: T): T;
}
class GenericNumber<T> {
  zeroValue!: T;
  add!: (x: T, y: T) => T
}

interface NA {
  [index: number]: number;
}

let na: NA = {1: 1}
let na1: NA = [1, 2, 3]
console.log(na, na1)

function sum8() {
  const args: IArguments = arguments;
}

let list: any[] = ['xcatliu', 25, { website: 'http://xcatliu.com' }];

// interface Document extends Node, GlobalEventHandlers, DocumentEvent {
//   addEventListener(
//     type: string, 
//     listener: (ev: MouseEvent) => any, useCapture?: boolean
//   ): void;
// }

class CFoo {
  /** @type {number} */
  #foo: number;

  constructor(foo: number) {
    // This works.
    this.#foo = foo;
  }
}

class H1 {
  private attr = 10
}
console.log(new H1()['attr'])


type keys1 = "a"|"b"|"c"
type keys2 = {
  [k in keys1]: string
}

interface Todo2 {
  title: string;
  description: string;
}

// Partial<T>  属性变为可选
// type Partial<T> = {
//   [P in keyof T]?: T[P];
// };
function updateTdo(todo: Todo2, fieldsToUpdate: Partial<Todo2>) {
  return { ...todo, ...fieldsToUpdate };
}

interface Options {
  name: string;
  age: number;
}

export type exportOptions = Options;

export function doThing(options: Options) {
  console.log(options)
}

export const legendenery = 'LOL'