import 'reflect-metadata'
import { REGISTER_INSTANCE } from 'ts-node';
interface Type<T> extends Function {
  new (...args: any[]): T; // 定义一个类
}

class InjectionToken { // 兜底类
  constructor(public injectionIdentifier: string) {}
}

type Token<T> = Type<T> | InjectionToken

export type Factory<T> = () => T;

export interface BaseProvider<T> {
  provide: Token<T>;
}

export interface ClassProvider<T> extends BaseProvider<T> {
  provide: Token<T>;
  useClass: Type<T>;
}

export interface ValueProvider<T> extends BaseProvider<T> {
  provide: Token<T>;
  useValue: T; 
}
  
export interface FactoryProvider<T> extends BaseProvider<T> {
  provide: Token<T>;
  useFactory: Factory<T>; 
}

export type Provider<T> = 
ClassProvider<T> |
ValueProvider<T> |
FactoryProvider<T>;

// 类型守卫函数
export function isClassProvider<T>(
  provider: BaseProvider<T>
): provider is ClassProvider<T> {
  return (provider as any).useClass !== undefined
}

export function isValueProvider<T>(
  provider: BaseProvider<T>
): provider is ValueProvider<T> {
  return (provider as any).useValue !== undefined
}

export function isFactoryProvider<T>(
  provider: BaseProvider<T>
): provider is FactoryProvider<T> {
  return (provider as any).useFactory !== undefined; 
}

const INJECTABLE_METADATA_KEY = Symbol('INJECTABLE_KEY');

export function Injectable() {
  return function(target: any) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
    return target;
  }
}

const INJECT_METADATA_KEY = Symbol('INJECT_KEY');

export function Inject(token: Token<any>) {
  return function(target: any, _: string|symbol, index: number) {
    Reflect.defineMetadata(INJECT_METADATA_KEY, token, target, `index-${index}`);
    return target;
  }
}

const API_URL = new InjectionToken('apiUrl');

@Injectable()
export class HttpService {
  constructor(
    private httpClient: HttpService,
    @Inject(API_URL) private apiUrl: string
  ) {}
}

export * from './TypeScript'
namespace Utility {
  export function log(msg: string) {
    console.log(msg);
  }
  export function error(msg: string) {
    console.log(msg);
  }
  // 命名空间嵌套命名空间 ？
}
Utility.log('log');

/**
 * 
 * @param target
 * @param propertyName 属性的名称/方法名，在这里是 sayHello
 * @param index 
 */
function logParameter(target: any, propertyName: string, index: number) {
  const metadatakey = `log_${propertyName}_parameters`
  console.log(metadatakey);
  if (Array.isArray(target[metadatakey])) {
    target[metadatakey].push(index);
  } else {
    target[metadatakey] = [index]
  }
}

class HelloWorldClass {
  constructor() {
    console.log('我是构造函数')
  }
  private nameVal: string | undefined;
  sayHello(@logParameter name: string) {
    console.log(name + ' sayHello');
  }
}
let pHello = new HelloWorldClass();
pHello.sayHello('zzb');

export function isInjectable<T>(target: Type<T>) {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true; 
}

type InjectableParam = Type<any>;
const REFLECT_PARAMS = "design:paramtypes";
export function getInjectionToken(target: any, index: number) {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target, `index-${index}`) as Token<any> | undefined;
}
export class Container {
  private providers = new Map<Token<any>, Provider<any>>();
  addProvider<T>(provider: Provider<T>) {
    this.assertInjectableIfClassProvider(provider);
    this.providers.set(provider.provide, provider);
  }
  private assertInjectableIfClassProvider<T>(provider: Provider<T>) {
    if(isClassProvider(provider) && isInjectable(provider.useClass)) throw new Error(
      `Cannot provide ${this.getTokenName(provider.provide)}...`
    )
  }


  /**
   * 获取 token 对应的名称
   * @param token 
   */
  private getTokenName<T>(token: Token<T>) {
    return token instanceof InjectionToken ? token.injectionIdentifier : token.name; // Function.name
  }
  inject<T>(type: Token<T>): T {
    let provider = this.providers.get(type);
    // 处理使⽤Injectable装饰器修饰的类
    if (provider === undefined && !(type instanceof InjectionToken)) {
      provider = {
        provide: type,
        useClass: type
      }
      this.assertInjectableIfClassProvider(provider);
    }
    return this.injectWithProvider(type, provider);
  }

  private injectWithProvider<T>(type: Token<T>, provider?: Provider<T>): T {
    if (provider === undefined) {
      throw new Error(`No provider for type ${this.getTokenName(type)}`);
    }
    if (isClassProvider(provider)) {
      return this.injectClass(provider as ClassProvider<T>);
    } else if (isValueProvider(provider)) {
      return this.injectValue(provider as ValueProvider<T>);
    } else {
      return this.injectFactory(provider as FactoryProvider<T>);
    }
  }
  private injectValue<T>(valueProvider: ValueProvider<T>): T {
    return valueProvider.useValue;
  }
  // const input = { x: 200 };
  // container.addProvider({ provide: BasicClass, useFactory: () => input });
  private injectFactory<T>(valueProvider: FactoryProvider<T>): T {
    return valueProvider.useFactory();
  }
  private injectClass<T>(classProvider: ClassProvider<T>): T {
    const target = classProvider.useClass;
    const params = this.getInjectedParams(target);
    return Reflect.construct(target, params);
  }
  // ⽤于获取类构造函数中声明的依赖对象
  private getInjectedParams<T>(target: Type<T>) {
    const argTypes = Reflect.getMetadata(REFLECT_PARAMS, target) as (
      | InjectableParam
      | undefined
    )[];
    if (argTypes === undefined) return [];
    return argTypes.map((argType, index) => {
      if (argType === undefined) {
        throw new Error(`Injection error. Recursive dependency detected in constructor for type
        ${target.name}
        with parameter at index ${index}`)
      }
      const overrideToken = getInjectionToken(target, index);
      const actualToken = overrideToken === undefined ? argType : overrideToken;
      let provider = this.providers.get(actualToken);
      return this.injectWithProvider(actualToken, provider);
    })
  }
}




const container = new Container();
const input = { x: 200 };
class BasicClass {}
container.addProvider({
  provide: BasicClass,
  useClass: BasicClass
});
container.addProvider({
  provide: BasicClass,
  useValue: input
})
const output = container.inject(BasicClass);