let myTask = `onmessage = function(e) {
  var num = e.data;
  var result = 0;
  for (var i = 0; i <= num; i++) {
    result += i;
  }
  // 把结果发送给主线程
  postMessage(result);
}`
let blob = new Blob([myTask])
let worker = new Worker(window.URL.createObjectURL(blob))
worker.postMessage(9)
worker.onmessage = function(event) {
  let { data } = event
  console.log(data)
}
worker.onerror = function(event) {
  console.log(`Error: ${event.filename}(${event.lineno}) ${event.message}`)
}
// worker.terminate()