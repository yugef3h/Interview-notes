// 简单工厂模式
class User {
  constructor(option) {
      this.name = options.name
      this.viewPage = options.viewPage
  }
  // 静态方法，可以在外部直接调用，不用实例化
  static getInstance(role) {
      let params;
      switch(role) {
          case 'superAdmin':
              // 在静态方法中返回实例
              params = { name: '超级管理员', viewPage: ['首页', '用户管理', '权限管理']}
              break;
          case 'admin':
              params = { name: '管理员', viewPage: ['首页', '用户管理']}
              break;
          case 'user':
              params = { name: '普通用户', viewPage: ['首页']}
              break;
          default:
              throw new Error('参数错误，可选参数：superAdmin、admin、user')
      }
      return new User(params)
  }
}

let superAdmin = User.getInstance('superAdmin')
let admin = User.getInstance('admin')
let normalUser = User.getInstance('user')


// 工厂方法模式
class User {
  constructor(name = '', viewPage = []) {
      if (new.target === User) throw new Error('抽象类不能实例化！') // 注意这里
      this.name = name
      this.viewPage = viewPage
  }
}
// 工厂方法只做一件事，就是实例化对象
class UserFactory extends User {
  constructor(name, viewPage) {
      super(name, viewPage)
  }
  create(role) {
      let params;
      switch(role) {
          case 'superAdmin':
              params = { name: '超级管理员', viewPage: ['首页', '用户管理', '权限管理']}
              break;
          case 'admin':
              params = { name: '管理员', viewPage: ['首页', '用户管理']}
              break;
          case 'user':
              params = { name: '普通用户', viewPage: ['首页']}
              break;
          default:
              throw new Error('参数错误，可选参数：superAdmin、admin、user')
      }
      return new UserFactory(params)
  }
}

let userFactory = new UserFactory()
let superAdmin = userFactory.create('superAdmin')
let admin = userFactory.create('admin')
let normalUser = userFactory.create('user')


// 抽象工厂模式
// 抽象用户工厂类
class UserFactory {
  constructor() {
      if (new.target === UserFactory) throw new Error('抽象类不能实例化！')
  }
  create() {
      throw new Error('抽象工厂类不允许直接调用方法，请重写实现！')
  }
}
// 具体用户类
class User extends UserFactory {
  create(role) {
      let params;
      switch(role) {
          case 'superAdmin':
              return new SuperAuthority()
              break;
          case 'admin':
              return new AdminAuthority()
              break;
          case 'user':
              return new UserAuthority()
              break;
          default:
              throw new Error('暂时没有这个用户权限！')
      }
  }
}
// 抽象类
class Authority {
  readWrite() {
      throw new Error('Authority 类不允许直接调用方法，请重新实现！')
  }
}
// 产品类簇
class SuperAuthority extends Authority {
  readWrite() {
      console.log('您可以随意浏览并修改网站内容。')
  }
}
class AdminAuthority extends Authority {
  readWrite() {
      console.log('您可以随意浏览并修改部分网站内容。')
  }
}
class UserAuthority extends Authority {
  readWrite() {
      console.log('您只能浏览部分网站内容。')
  }
}

const userAuthority = new User()
const myAuthority = userAuthority.create('superAdmin')
myAuthority.readWrite()

// 您可以随意浏览并修改网站内容。