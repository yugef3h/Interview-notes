"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legendenery = exports.doThing = void 0;
// tsc .ts
// 编译时静态检查
function greet(person) {
    return 'Hello,' + person;
}
console.log(greet('TypeScript'));
// 数字枚举支持反向映射
var Direction;
(function (Direction) {
    Direction[Direction["NORTH"] = 3] = "NORTH";
    Direction[Direction["SOUTH"] = 4] = "SOUTH";
    Direction[Direction["EAST"] = 5] = "EAST";
    Direction[Direction["WEST"] = 6] = "WEST";
})(Direction || (Direction = {}));
let dir = Direction.NORTH;
let value;
// 编译可以，但执行依旧报错
// console.log(value.foo)
// console.log(value.foo.bar)
let tupleType;
tupleType = ['name', true];
function fanxing(arg) {
    console.log(arg.length);
    return arg;
}
let myFanxing = fanxing;
let xiaojie = { name: 'yuql' };
console.log(xiaojie);
const girl = {
    name: 'yu',
    age: 18,
    sex: '♀',
    ad: 'ad'
};
function obj1({ name, age, sex, ad }) {
    console.log(name + age + sex + ad);
}
obj1(girl);
var ActiveType;
(function (ActiveType) {
    ActiveType[ActiveType["active"] = 1] = "active";
    ActiveType[ActiveType["inactive"] = 2] = "inactive";
    ActiveType["type"] = "type3";
})(ActiveType || (ActiveType = {}));
function isActive(type) { }
isActive(ActiveType.active);
// ============================== compile result:
// var ActiveType;
// (function (ActiveType) {
//     ActiveType[ActiveType["active"] = 1] = "active";
//     ActiveType[ActiveType["inactive"] = 2] = "inactive";
// })(ActiveType || (ActiveType = {}));
// function isActive(type) { }
// isActive(ActiveType.active);
console.log(ActiveType[1]); // OK
console.log(ActiveType.active);
console.log(ActiveType.type);
console.log(ActiveType);
ActiveType[10]; // OK！！！
var EvidenceTypeEnum;
(function (EvidenceTypeEnum) {
    EvidenceTypeEnum["UNKNOWN"] = "";
    EvidenceTypeEnum["PASSPORT_VISA"] = "passport_visa";
    EvidenceTypeEnum["PASSPORT"] = "passport";
    EvidenceTypeEnum["SIGHTED_STUDENT_CARD"] = "sighted_tertiary_edu_id";
})(EvidenceTypeEnum || (EvidenceTypeEnum = {}));
console.log(EvidenceTypeEnum.PASSPORT);
// 返回的是 key
const arg1 = 'name';
const arg2 = 'push';
class Person1 {
    constructor() {
        this.name = 'person';
        this.age = 18;
    }
}
let man = {
    name: "S",
    age: 30
};
let sname; // 限制了 sname 只能为 Person1 的属性 key
sname = 'name';
function prop(obj, key) {
    // return (obj as any)[key]
    return obj[key];
}
const todo = {
    id: 1,
    text: '1',
    done: false
};
// 泛型约束  extends + 属性约束 keyof
function props(obj, key) {
    return obj[key];
}
const id = props(todo, 'id');
class ClassWithNumbericProperty {
    constructor() {
        this[1] = 'Semlinker';
    }
}
let classNumber = new ClassWithNumbericProperty();
console.log(`${classNumber[1]}`);
var Currency;
(function (Currency) {
    Currency[Currency["CNY"] = 6] = "CNY";
    Currency[Currency["EUR"] = 8] = "EUR";
    Currency[Currency["USD"] = 10] = "USD";
})(Currency || (Currency = {}));
const CurrencyName = {
    [Currency.CNY]: "人民币",
    [Currency.EUR]: "欧元",
    [Currency.USD]: "美元"
};
function getCur(key, map) {
    return map[key];
}
console.log(`name=${getCur(Currency.CNY, CurrencyName)}`);
// const sym=Symbol();
// let obj= {  
//   [sym]: "semlinker",
// };
// console.log(obj[sym]);
Object.create(null);
const yxiu = {};
yxiu.toString();
function controlFlowAnalysisWithNever(foo) {
    if (typeof foo === 'string') {
        // 
    }
    else if (typeof foo === 'number') {
        // 
    }
    else {
        const check = foo;
    }
}
let someValue = 'this is a string';
let strLength = someValue.length;
// 非空断言
function myFunc(maybeString) {
    const onlyString = maybeString;
    console.log(onlyString);
    return onlyString;
}
myFunc('yuql');
function printEmployeeInformation(emp) {
    console.log("Name: " + emp.name);
    if ("privileges" in emp) { }
    if ("startDate" in emp) { }
    if (typeof emp.name === 'string') { }
    switch (typeof emp.name) {
        case "string":
            return emp.name;
    }
}
class SpaceRepeatingPadder {
    constructor(numSpaces) {
        this.numSpaces = numSpaces;
    }
    getPaddingString() {
        return Array(this.numSpaces + 1).join(" ");
    }
}
let padder = new SpaceRepeatingPadder(6);
if (padder instanceof SpaceRepeatingPadder) { }
// 自定义 isNumber 的类型保护
function isNumber(x) {
    return typeof x === 'number';
}
console.log(isNumber('1'));
let union = 2;
// 联合类型不仅仅是基础属性还可以是接口、甚至是复合类型。
let type1 = {
    vType: "motorcycle",
    make: 1
};
let point = {
    x: 1,
    y: 1
};
let ab = {
    x: {
        d: true,
        e: 'semlinker'
    }
};
// 数组解构
let x1;
let y1;
let z1;
let five_array = [0, 1, 2, 3, 4];
[x1, y1, z1] = five_array;
let person = {
    name1: 'semlinker',
    gender: 'male',
    address: 'xiamen'
};
let { name1, ...rest } = person;
console.log(rest);
let p9 = {
    name: '1'
};
// p9.name = '2';
// 确保数组创建后不可变，应用场景在哪？
let a8 = [1, 2, 3, 4];
let ro = a8;
// 异常???
let anonymousFn = (x, y) => {
    return 1;
};
anonymousFn(1, 2);
class Greeter {
    constructor(message) {
        this.greeting = message;
    }
    static getClassName() {
        return "Class name is Greeter";
    }
}
Greeter.cname = 'Greeter';
console.log(Greeter.cname);
console.log(Greeter.getClassName());
let passcode = 'hello';
class Em {
    get fullName() {
        return this._fullName;
    }
    set fullName(newName) {
        if (passcode && passcode === 'hello') {
            this._fullName = newName;
        }
        else {
            console.log('error');
        }
    }
}
let emp1 = new Em();
emp1.fullName = 's';
if (emp1.fullName)
    console.log(emp1.fullName);
class Per1 {
    constructor(name) {
        this.name = name;
    }
}
class Dev extends Per1 {
    constructor(name) {
        super(name); // 调用父类的构造函数
    }
    say(words) {
        console.log(`${this.name} say ${words}`);
    }
}
function add(a, b) {
    if (typeof a === "string" || typeof b === "string") {
        return a.toString() + b.toString();
    }
    return a + b;
}
console.log(add(1, 2));
console.log(add('1', '2', '3'));
class ProductService {
    getProducts(id) {
        if (typeof id === 'number') { }
        else { }
    }
}
function identity(value, message) {
    return value;
}
identity(Number.MAX_VALUE, 'e');
class GenericNumber {
}
let na = { 1: 1 };
let na1 = [1, 2, 3];
console.log(na, na1);
function sum8() {
    const args = arguments;
}
let list = ['xcatliu', 25, { website: 'http://xcatliu.com' }];
// interface Document extends Node, GlobalEventHandlers, DocumentEvent {
//   addEventListener(
//     type: string, 
//     listener: (ev: MouseEvent) => any, useCapture?: boolean
//   ): void;
// }
class CFoo {
    constructor(foo) {
        // This works.
        this.#foo = foo;
    }
    /** @type {number} */
    #foo;
}
class H1 {
    constructor() {
        this.attr = 10;
    }
}
console.log(new H1()['attr']);
// Partial<T>  属性变为可选
// type Partial<T> = {
//   [P in keyof T]?: T[P];
// };
function updateTdo(todo, fieldsToUpdate) {
    return { ...todo, ...fieldsToUpdate };
}
function doThing(options) {
    console.log(options);
}
exports.doThing = doThing;
exports.legendenery = 'LOL';
