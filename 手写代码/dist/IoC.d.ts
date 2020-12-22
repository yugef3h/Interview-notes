import 'reflect-metadata';
interface Type<T> extends Function {
    new (...args: any[]): T;
}
declare class InjectionToken {
    injectionIdentifier: string;
    constructor(injectionIdentifier: string);
}
declare type Token<T> = Type<T> | InjectionToken;
export declare type Factory<T> = () => T;
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
export declare type Provider<T> = ClassProvider<T> | ValueProvider<T> | FactoryProvider<T>;
export declare function isClassProvider<T>(provider: BaseProvider<T>): provider is ClassProvider<T>;
export declare function isValueProvider<T>(provider: BaseProvider<T>): provider is ValueProvider<T>;
export declare function isFactoryProvider<T>(provider: BaseProvider<T>): provider is FactoryProvider<T>;
export declare class Container {
    addProvider<T>(provider: Provider<T>): void;
    inject<T>(type: Token<T>): void;
}
export declare function Injectable(): (target: any) => any;
export declare function Inject(token: Token<any>): (target: any, _: string | symbol, index: number) => any;
export declare class HttpService {
    private httpClient;
    private apiUrl;
    constructor(httpClient: HttpService, apiUrl: string);
}
export * from './TypeScript';
