// 懒汉式
let ShopCar = (function() {
  let instance
  function init() {
    return {
      buy(good) {
        this.goods.push(good)
      },
      goods: []
    }
  }
  return {
    getInstance: function() {
      if (!instance) {
        instance = init()
      }
      return instance
    }
  }
})()
let car1 = ShopCar.getInstance()
let car2 = ShopCar.getInstance()
car1.buy('橘子')
car2.buy('苹果')
console.log(car1.goods)
console.log(car1 === car2)

// 饿汉式
var ShopCar = (function() {
  var instance = init()
  function init() {
    return {
      buy(good) {
        this.goods.push(good)
      },
      goods: []
    }
  }
  return {
    getInstance: function() {
      return instance
    }
  }
})()
let car1 = ShopCar.getInstance();
let car2 = ShopCar.getInstance();
car1.buy('橘子');
car2.buy('苹果'); //[ '橘子', '苹果' ]
console.log(car1.goods);
console.log(car1 === car2); // true
