type EventHandler = (...args: any[]) => any;

class EventEmitter {
  private c = new Map<string, EventHandler[]>();
  // 订阅指定的主题
  subscribe(topic: string, ...handlers: EventHandler[]) { // handlers 订阅的对象。
    let topics = this.c.get(topic);
    if (!topics) {
      this.c.set(topic, topics = []);
    }
    topics.push(...handlers);
  }
  // 取消订阅指定的主题
  unsubscribe(topic: string, handler?: EventHandler): boolean {
    if (!handler) {
      return this.c.delete(topic);
    }
    const topics = this.c.get(topic);
    if (!topics) {
      return false;
    }
    const index = topics.indexOf(handler);
    if (index < 0) {
      return false;
    }
    topics.splice(index, 1);
    if (topics.length === 0) {
      this.c.delete(topic);
    }
    return true;
  }
  // 为指定的主题发布消息
  publish(topic: string, ...args: any[]): any[] | null {
    const topics = this.c.get(topic);
    if (!topics) {
      return null;
    }
    return topics.map(handler => {
      try {
        return handler(...args);
      } catch(e) {
        console.error(e);
        return null;
      }
    });
  }
}

const eventEmitter = new EventEmitter();
eventEmitter.subscribe('ts', msg => console.log(`收到订阅的消息：${msg}`));
eventEmitter.publish('ts', 'publish')
eventEmitter.unsubscribe('ts')
eventEmitter.publish('ts', 'publish')