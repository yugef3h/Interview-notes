"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Car_1 = require("./Car");
class Car {
    constructor(engine, chassis, body) {
        this.engine = engine;
        this.chassis = chassis;
        this.body = body;
    }
    run() {
        this.engine.start();
    }
}
exports.default = Car;
const engine = new Car_1.Engine();
const body = new Car_1.Body();
const chassis = new Car_1.Chassis();
const car = new Car(engine, chassis, body);
car.run();
