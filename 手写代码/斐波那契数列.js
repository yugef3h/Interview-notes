// 低效 timeout
function fibonacci(n) {
  if(n === 1 || n === 2) {
      return 1;
  } else {
      return fibonacci(n-1) + fibonacci(n-2)
  }
}

// 取模 1e9 + 7 更新
const fib = function(n) {
  let fibonacci = [0, 1]
  for (let i = 2; i <= n; i++) {
    fibonacci[i] = (fibonacci[i - 1] + fibonacci[i - 2]) % (1e9 + 7)
  }
  return fibonacci[n]
}