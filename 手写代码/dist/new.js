"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doThing = exports.TypedEvent = void 0;
function printAnimalAbilities(animal) {
    var animalFlags = animal.flags;
    if (animalFlags & 1 /* HasClaws */) {
        console.log(animalFlags, 1 /* HasClaws */, animalFlags & 1 /* HasClaws */);
        console.log('animal has claws');
    }
    if (animalFlags & 2 /* CanFly */) {
        console.log(animalFlags, 2 /* CanFly */, animalFlags & 2 /* CanFly */);
        console.log('animal can fly');
    }
    if (animalFlags === 0 /* None */) {
        console.log(animalFlags, 0 /* None */, animalFlags & 0 /* None */);
        console.log('nothing');
    }
}
var animal = {
    flags: 1 /* HasClaws */
};
printAnimalAbilities(animal);
const lie = 2 /* CanFly */;
var Weekday;
(function (Weekday) {
    Weekday[Weekday["Monday"] = 0] = "Monday";
    Weekday[Weekday["Tuesday"] = 1] = "Tuesday";
})(Weekday || (Weekday = {}));
(function (Weekday) {
    function isBusinessDay(day) {
        switch (day) {
            case Weekday.Monday:
            case Weekday.Tuesday:
                return true;
            default:
                return false;
        }
    }
    Weekday.isBusinessDay = isBusinessDay;
})(Weekday || (Weekday = {}));
const mon = Weekday.Monday;
console.log(Weekday.isBusinessDay(mon));
function newMethod(a) {
    return a;
}
const newM1 = newMethod;
const newM2 = newM1('1');
const mesd = function (a) {
    return a;
};
// const bar1 = new Foo1();
const foo2 = {};
foo2.bar = 123;
function logName(something) {
    console.log(something.name);
}
let tes7;
const person = { name: 'matt', job: 'being awesome' };
const animal1 = { name: 'cow', diet: 'vegan, but has milk of own specie' };
const randow = { note: `I don't have a name property` };
tes7 = person;
logName(person); // ok 经过一个变量的转移变得不新鲜了，不再检测。
logName(animal1); // ok
logName({ name: 'matt' });
function strEnum(o) {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
const Direction = strEnum(['North', 'South', 'East', 'West']);
let sample;
sample = Direction.East;
sample = 'East';
let foo = [1, 2, 3];
console.log(foo[0]); // ok
// foo.push(4); // Error: ReadonlyArray 上不存在 `push`，因为他会改变数组
foo = foo.concat(4);
console.log(foo);
class Queue {
    constructor() {
        this.data = [];
        this.push = (item) => this.data.push(item);
        this.pop = () => this.data.shift();
    }
}
const queue = new Queue();
queue.push(0);
queue.push(1);
function reverse(items) {
    const toreturn = [];
    for (let i = items.length - 1; i >= 0; i--) {
        toreturn.push(items[i]);
    }
    return toreturn;
}
const sample1 = [1, 2, 3];
let reversed = reverse(sample1);
reversed[0] = 1;
reversed = [1, 2];
const getJSON = (config) => {
    const fetchConfig = {
        method: 'GET',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(config.headers || {})
    };
    return fetch(config.url, fetchConfig).then(response => response.json());
};
function loaderUser() {
    return getJSON({
        url: 'https://example.com/users'
    });
}
let iTakePoint2D = (point) => { };
let iTakePoint3D = (point) => { };
iTakePoint3D = iTakePoint2D; // ok, 这是合理的
// iTakePoint2D = iTakePoint3D;
class Animal1 {
    constructor(name, numFeet) {
        this.feet = 1;
    }
}
class Size {
    constructor(meters) {
        this.feet = 1;
    }
}
let a;
let s1;
a = s1; // OK
s1 = a; // OK
class Foo {
}
// 与之前做法相同
let bar;
try {
    throw new Error('Something bad happened');
}
catch (e) {
    console.log(e, 1);
}
// 混合函数
function TimesTamped(Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.timestamp = Date.now();
        }
    };
}
function Activatable(Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.isActivated = false;
        }
        activate() {
            this.isActivated = true;
        }
        deactivate() {
            this.isActivated = false;
        }
    };
}
class User {
    constructor() {
        this.name = '';
    }
}
const TimestampedUser = TimesTamped(User);
const TimestampedActivatableUser = TimesTamped(Activatable(User));
const createFoo = (value) => ({ type: 'foo', value });
const createBar = (value) => ({ type: 'bar', value });
let foo6 = createFoo('sample');
let bar6 = createBar('sample');
var FooIdBrand;
(function (FooIdBrand) {
    FooIdBrand["_"] = "";
})(FooIdBrand || (FooIdBrand = {}));
let fooIdd;
class Singleton {
    constructor() { }
    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
    someMethod() { }
}
// let someThing = new Singleton();
let instance = Singleton.getInstance();
var Singleton1;
(function (Singleton1) {
    function someMethod() { }
    Singleton1.someMethod = someMethod;
})(Singleton1 || (Singleton1 = {}));
Singleton1.someMethod();
function foo8(flagA, flagB) { }
class TypedEvent {
    constructor() {
        this.listeners = [];
        this.listenersOncer = [];
        this.on = (listener) => {
            this.listeners.push(listener);
            return {
                dispose: () => this.off(listener)
            };
        };
        this.once = (listener) => {
            this.listenersOncer.push(listener);
        };
        this.off = (listener) => {
            const callbackIndex = this.listeners.indexOf(listener);
            if (callbackIndex > -1)
                this.listeners.splice(callbackIndex, 1);
        };
        this.emit = (event) => {
            this.listeners.forEach(listener => listener(event));
            this.listenersOncer.forEach(listener => listener(event));
            this.listenersOncer = [];
        };
        this.pipe = (te) => {
            return this.on(e => te.emit(e));
        };
    }
}
exports.TypedEvent = TypedEvent;
function doThing(options) { }
exports.doThing = doThing;
