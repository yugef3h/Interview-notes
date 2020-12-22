const enum AnimalFlags {
  None = 0,
  HasClaws = 1 << 0,
  CanFly = 1 << 1
}
interface Animal {
  flags: AnimalFlags;
  [key: string]: any;
}
function printAnimalAbilities(animal: Animal) {
  var animalFlags = animal.flags;
  if (animalFlags & AnimalFlags.HasClaws) {
    console.log(animalFlags, AnimalFlags.HasClaws, animalFlags & AnimalFlags.HasClaws)
    console.log('animal has claws')
  }
  if (animalFlags & AnimalFlags.CanFly) {
    console.log(animalFlags, AnimalFlags.CanFly, animalFlags & AnimalFlags.CanFly)
    console.log('animal can fly')
  }
  if (animalFlags === AnimalFlags.None) {
    console.log(animalFlags, AnimalFlags.None, animalFlags & AnimalFlags.None)
    console.log('nothing')
  }
}
var animal = {
  flags: AnimalFlags.HasClaws
};
printAnimalAbilities(animal);

const lie = AnimalFlags.CanFly;


enum Weekday {
  Monday,
  Tuesday
}
namespace Weekday {
  export function isBusinessDay(day: Weekday) {
    switch(day) {
      case Weekday.Monday:
      case Weekday.Tuesday:
        return true;
      default:
        return false;
    }
  }
}
const mon = Weekday.Monday;
console.log(Weekday.isBusinessDay(mon));

// 重载接口
type LongHandAllowsOverloadDeclarations = {
  (a: number): number;
  (a: string): string;
};


function newMethod(a: string): string;
function newMethod(a: number): number;
function newMethod(a: any) {
  return a;
}

const newM1: LongHandAllowsOverloadDeclarations = newMethod;
const newM2 = newM1('1');

type LongHand = {
  (a: number): number
};
type ShortHand = (a: number) => number;

interface MidHand {
  (a: number): number;
}
const mesd: MidHand = function(a: number): number {
  return a;
}
declare const fyu: MidHand;
// const byu = fyu(1); // number

interface CallMeWithNewToGetString {
  new (): string;
}
declare const Foo1: CallMeWithNewToGetString;
// const bar1 = new Foo1();

const foo2 = {} as any;
foo2.bar = 123;

interface Test1 {
  name: string;
}
function logName(something: Test1) {
  console.log(something.name);
}

let tes7: Test1;


const person = { name: 'matt', job: 'being awesome' };
const animal1 = { name: 'cow', diet: 'vegan, but has milk of own specie' };
const randow = { note: `I don't have a name property` };

tes7 = person;

logName(person); // ok 经过一个变量的转移变得不新鲜了，不再检测。
logName(animal1); // ok
logName({ name: 'matt' });

function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}
const Direction = strEnum(['North', 'South', 'East', 'West']);
type Direction = keyof typeof Direction;
let sample: Direction;
sample = Direction.East;
sample = 'East';

let foo: ReadonlyArray<number> = [1, 2, 3];
console.log(foo[0]); // ok
// foo.push(4); // Error: ReadonlyArray 上不存在 `push`，因为他会改变数组
foo = foo.concat(4);
console.log(foo);

class Queue<T> {
  private data: T[] = [];
  push = (item: T) => this.data.push(item);
  pop = (): T | undefined => this.data.shift();
}
const queue = new Queue<number>();
queue.push(0);
queue.push(1);

function reverse<T>(items: T[]): T[] {
  const toreturn = []
  for (let i=items.length-1; i>=0; i--) {
    toreturn.push(items[i])
  }
  return toreturn;
}

const sample1 = [1, 2, 3];
let reversed = reverse(sample1);
reversed[0] = 1;
reversed = [1, 2]

const getJSON = <T>(config: { url: string; headers?: { [key: string]: string }}): Promise<T> => {
  const fetchConfig = {
    method: 'GET',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(config.headers || {})
  };
  return fetch(config.url, fetchConfig).then<T>(response => response.json());
}

type LoadUserResponse = {
  user: {
    name: string;
    email: string;
  }[];
};

function loaderUser() {
  return getJSON<LoadUserResponse>({
    url: 'https://example.com/users'
  })
}

interface Point2D {
  x: number;
  y: number;
}
interface Point3D {
  x: number;
  y: number;
  z: number;
}

let iTakePoint2D = (point: Point2D) => {};
let iTakePoint3D = (point: Point3D) => {};

iTakePoint3D = iTakePoint2D; // ok, 这是合理的
// iTakePoint2D = iTakePoint3D;

class Animal1 {
  feet: number = 1;
  constructor(name: string, numFeet: number) {}
}

class Size {
  feet: number = 1;
  constructor(meters: number) {}
}

let a: Animal1;
let s1!: Size;

a = s1; // OK
s1 = a; // OK

type FieldState = {
  value: string;
};

type FromState = { isValid: boolean } & { [fieldName: string]: FieldState };

class Foo {
  foo!: number; // 我们想要捕获的类型
}

declare let _foo: Foo;

// 与之前做法相同
let bar: typeof _foo.foo;

try {
  throw new Error('Something bad happened');
} catch (e) {
  console.log(e,1);
}

type Constructor<T = {}> = new (...args: any[]) => T;
// 混合函数
function TimesTamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  }
}
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActivated = false
    activate() {
      this.isActivated = true
    }
    deactivate() {
      this.isActivated = false
    }
  }
}

class User {
  name = ''
}

const TimestampedUser = TimesTamped(User);
const TimestampedActivatableUser = TimesTamped(Activatable(User));

type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>;
}

type Id<T extends string> = {
  type: T;
  value: string;
}
type FooId = Id<'foo'>;
type BarId = Id<'bar'>;
const createFoo = (value: string): FooId => ({type: 'foo', value});
const createBar = (value: string): BarId => ({type: 'bar', value});
let foo6 = createFoo('sample') 
let bar6 = createBar('sample');

enum FooIdBrand {
  _ = ''
}
type FooIdBr = FooIdBrand & string;

interface IFooId extends String {
  _fooIdBrand: string;
}

let fooIdd: IFooId;

class Singleton {
  private static instance: Singleton;
  private constructor() {}
  public static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
  someMethod() {}
}
// let someThing = new Singleton();
let instance = Singleton.getInstance();

namespace Singleton1 {
  export function someMethod() {}
}
Singleton1.someMethod();

function foo8(flagA: boolean, flagB: boolean) {}

export interface Listener<T> {
  (event: T): any;
}
export interface Disposable {
  dispose(): any;
}
export class TypedEvent<T> {
  private listeners: Listener<T>[] = [];
  private listenersOncer: Listener<T>[] = [];

  public on = (listener: Listener<T>): Disposable => {
    this.listeners.push(listener);
    return {
      dispose: () => this.off(listener)
    }
  }
  public once = (listener: Listener<T>): void => {
    this.listenersOncer.push(listener);
  }
  public off = (listener: Listener<T>) => {
    const callbackIndex = this.listeners.indexOf(listener);
    if (callbackIndex > -1) this.listeners.splice(callbackIndex, 1);
  }
  public emit = (event: T) => {
    this.listeners.forEach(listener =>  listener(event));
    this.listenersOncer.forEach(listener => listener(event));
    this.listenersOncer = [];
  }
  public pipe = (te: TypedEvent<T>): Disposable => {
    return this.on(e => te.emit(e));
  }
}

export interface Options {}
export function doThing(options: Options) {}
