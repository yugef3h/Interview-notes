/**
 * JS实现一个带并发控制的异步调度器，保证同时运动的任务最多有两个，完善下面代码
 */
class Scheduler {
  constructor(maxCount=2) {
    this.queue = [];
    this.maxCount = maxCount;
    this.runCounts = 0;
  }
  add(promiseCreator) {
    this.queue.push(promiseCreator);
  }
  taskStart() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }
  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return;
    }
    this.runCounts++;
    // promise 直接执行
    this.queue.shift()().then(() => {
      this.runCounts--;
      this.request();
    });
  }
}
   
const timeout = time => new Promise(resolve => {
  setTimeout(resolve, time);
})
  
const scheduler = new Scheduler();

const addTask = (time,order) => {
  scheduler.add(() => timeout(time).then(()=>console.log(order)))
}
  
  
addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
scheduler.taskStart()
// 每次两个任务：500ms 先结束，第3个任务进来，300ms 先结束，第4个任务进来，1000ms 先结束
// 2
// 3
// 1
// 4


// 实现2
class Scheduler {  
  constructor (limit = 2) {    
    this.limit = limit    
    this.concurrent = 0    
    this.stack = []  
  }
  add (promiseCreator) {
    if (this.concurrent < this.limit) {      
      this.concurrent++      
      return promiseCreator().then(() => {        
        this.concurrent--        
        this.next()      
      })    
    } else {      
      let resolve      
      let p = new Promise(r => {        
        resolve = r      
      })      
      this.stack.push(() => {        
        promiseCreator().then(() => {          
          resolve()        
          this.concurrent--          
          this.next()        
        })
      })      
      return p
    }  
  }  
  next () {    
    if (this.stack.length > 0 && this.concurrent < this.limit) {      
      let p = this.stack.shift()      
      this.concurrent++      
      p()    
    }  
  }
}
