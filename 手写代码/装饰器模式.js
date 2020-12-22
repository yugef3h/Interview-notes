const Man = function() {
  this.run = function() {
    console.log('跑步')
  }
}

const Decorator = function(old) {
  this.oldAbility = old.run
  this.fly = function() {
    console.log('fly')
  }
  this.newAbility = function() {
    this.oldAbility()
    this.fly()
  }
}

const man = new Man()
const superMan = new Decorator(man)
superMan.fly()