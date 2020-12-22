"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = exports.getInjectionToken = exports.isInjectable = exports.HttpService = exports.Inject = exports.Injectable = exports.isFactoryProvider = exports.isValueProvider = exports.isClassProvider = void 0;
require("reflect-metadata");
class InjectionToken {
    constructor(injectionIdentifier) {
        this.injectionIdentifier = injectionIdentifier;
    }
}
// 类型守卫函数
function isClassProvider(provider) {
    return provider.useClass !== undefined;
}
exports.isClassProvider = isClassProvider;
function isValueProvider(provider) {
    return provider.useValue !== undefined;
}
exports.isValueProvider = isValueProvider;
function isFactoryProvider(provider) {
    return provider.useFactory !== undefined;
}
exports.isFactoryProvider = isFactoryProvider;
const INJECTABLE_METADATA_KEY = Symbol('INJECTABLE_KEY');
function Injectable() {
    return function (target) {
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
        return target;
    };
}
exports.Injectable = Injectable;
const INJECT_METADATA_KEY = Symbol('INJECT_KEY');
function Inject(token) {
    return function (target, _, index) {
        Reflect.defineMetadata(INJECT_METADATA_KEY, token, target, `index-${index}`);
        return target;
    };
}
exports.Inject = Inject;
const API_URL = new InjectionToken('apiUrl');
let HttpService = class HttpService {
    constructor(httpClient, apiUrl) {
        this.httpClient = httpClient;
        this.apiUrl = apiUrl;
    }
};
HttpService = __decorate([
    Injectable(),
    __param(1, Inject(API_URL)),
    __metadata("design:paramtypes", [HttpService, String])
], HttpService);
exports.HttpService = HttpService;
__exportStar(require("./TypeScript"), exports);
var Utility;
(function (Utility) {
    function log(msg) {
        console.log(msg);
    }
    Utility.log = log;
    function error(msg) {
        console.log(msg);
    }
    Utility.error = error;
    // 命名空间嵌套命名空间 ？
})(Utility || (Utility = {}));
Utility.log('log');
/**
 *
 * @param target
 * @param propertyName 属性的名称/方法名，在这里是 sayHello
 * @param index
 */
function logParameter(target, propertyName, index) {
    const metadatakey = `log_${propertyName}_parameters`;
    console.log(metadatakey);
    if (Array.isArray(target[metadatakey])) {
        target[metadatakey].push(index);
    }
    else {
        target[metadatakey] = [index];
    }
}
class HelloWorldClass {
    constructor() {
        console.log('我是构造函数');
    }
    sayHello(name) {
        console.log(name + ' sayHello');
    }
}
__decorate([
    __param(0, logParameter),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HelloWorldClass.prototype, "sayHello", null);
let pHello = new HelloWorldClass();
pHello.sayHello('zzb');
function isInjectable(target) {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true;
}
exports.isInjectable = isInjectable;
const REFLECT_PARAMS = "design:paramtypes";
function getInjectionToken(target, index) {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target, `index-${index}`);
}
exports.getInjectionToken = getInjectionToken;
class Container {
    constructor() {
        this.providers = new Map();
    }
    addProvider(provider) {
        this.assertInjectableIfClassProvider(provider);
        this.providers.set(provider.provide, provider);
    }
    assertInjectableIfClassProvider(provider) {
        if (isClassProvider(provider) && isInjectable(provider.useClass))
            throw new Error(`Cannot provide ${this.getTokenName(provider.provide)}...`);
    }
    /**
     * 获取 token 对应的名称
     * @param token
     */
    getTokenName(token) {
        return token instanceof InjectionToken ? token.injectionIdentifier : token.name; // Function.name
    }
    inject(type) {
        let provider = this.providers.get(type);
        // 处理使⽤Injectable装饰器修饰的类
        if (provider === undefined && !(type instanceof InjectionToken)) {
            provider = {
                provide: type,
                useClass: type
            };
            this.assertInjectableIfClassProvider(provider);
        }
        return this.injectWithProvider(type, provider);
    }
    injectWithProvider(type, provider) {
        if (provider === undefined) {
            throw new Error(`No provider for type ${this.getTokenName(type)}`);
        }
        if (isClassProvider(provider)) {
            return this.injectClass(provider);
        }
        else if (isValueProvider(provider)) {
            return this.injectValue(provider);
        }
        else {
            return this.injectFactory(provider);
        }
    }
    injectValue(valueProvider) {
        return valueProvider.useValue;
    }
    // const input = { x: 200 };
    // container.addProvider({ provide: BasicClass, useFactory: () => input });
    injectFactory(valueProvider) {
        return valueProvider.useFactory();
    }
    injectClass(classProvider) {
        const target = classProvider.useClass;
        const params = this.getInjectedParams(target);
        return Reflect.construct(target, params);
    }
    // ⽤于获取类构造函数中声明的依赖对象
    getInjectedParams(target) {
        const argTypes = Reflect.getMetadata(REFLECT_PARAMS, target);
        if (argTypes === undefined)
            return [];
        return argTypes.map((argType, index) => {
            if (argType === undefined) {
                throw new Error(`Injection error. Recursive dependency detected in constructor for type
        ${target.name}
        with parameter at index ${index}`);
            }
            const overrideToken = getInjectionToken(target, index);
            const actualToken = overrideToken === undefined ? argType : overrideToken;
            let provider = this.providers.get(actualToken);
            return this.injectWithProvider(actualToken, provider);
        });
    }
}
exports.Container = Container;
const container = new Container();
const input = { x: 200 };
class BasicClass {
}
container.addProvider({
    provide: BasicClass,
    useClass: BasicClass
});
container.addProvider({
    provide: BasicClass,
    useValue: input
});
const output = container.inject(BasicClass);
