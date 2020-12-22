import { Body, Chassis, Engine } from './Car';
export default class Car {
    engine: Engine;
    chassis: Chassis;
    body: Body;
    constructor(engine: Engine, chassis: Chassis, body: Body);
    run(): void;
}
