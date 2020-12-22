let a = {
  value: 0,
  valueOf() {
    this.value++
    return this.value
  }
}
// console.log(a.valueOf())
console.log(a==1&&a==2&&a==3)