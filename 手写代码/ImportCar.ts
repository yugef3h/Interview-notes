import  { Body, Chassis, Engine } from './Car'

export default class Car {
  engine: Engine;
  chassis: Chassis;
  body: Body;
  constructor(engine: Engine, chassis: Chassis, body: Body) {
    this.engine = engine;
    this.chassis = chassis;
    this.body = body;
  }
  run() {
    this.engine.start();
  }
}
const engine = new Engine();
const body = new Body();
const chassis = new Chassis();
const car = new Car(engine, chassis, body);
car.run()