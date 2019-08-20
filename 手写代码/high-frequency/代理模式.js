// proxy
class Letter {
  constructor(name) {
    this.name = name
  }
}
let xiaoming = {
  name: 'xiaoming',
  sendLetter(target) {
    target.receiveLetter(this.name)
  }
}
let xiaohua = {
  receiveLetter(customer) {
    xiaohong.listenGoodMood(() => {
      xiaohong.receiveLetter(new Letter(customer + '的情书'))
    })
  }
}

let xiaohong = {
  name: 'xiaohong',
  receiveLetter(letter) {
    console.log(this.name + '收到：' + letter.name)
  },
  listenGoodMood(fn) {
    setTimeout(() => {
      fn()
    }, 1000)
  }
}

xiaoming.sendLetter(xiaohua)