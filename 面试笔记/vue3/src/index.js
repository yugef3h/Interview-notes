// import {reactive, effect} from '@vue/reactivity'
// 手写reactive核心
// import {reactive,effect} from './vue3/index.js'

// const state=reactive({
//   students:[
//     {
//       id:'1',
//       name:'jack'
//     },
//     {
//       id:'2',
//       name:'tom'
//     }
//   ],
//   user:[1,2,3],
//   count:0
// })

// console.log(state.count)

// state.count=1;
// state.students.push({
//   id:'3',
//   name:'jarry'
// })

// console.log(state.students)

// effect(()=>{
//   console.log('执行')
//   app.innerHTML=`hello world,count is ${state.count}`
//   // app.innerHTML=state.students.length;
//   // app.innerHTML=state.students[2];
//   // app.innerHTML=state.user;
// })

// setTimeout(()=>{
//   state.count++
// },2000)

// 数组处理
// setTimeout(()=>{
//   // state.students.length=100
//   state.students.length=1
// },3000)


// setTimeout(()=>{
//   state.user[10]=2;
// },3000)
import { createApp, reactive,h } from './vue3/index'

// 基础示例
// const App = {
//   setup() {
//     const state = reactive({
//       color:'red',
//       user: {
//         name: 'rocky',
//         age: 18
//       }
//     })
//     setTimeout(()=>{
//       state.color='blue'
//       state.user.age++
//     },2000)
//     return ()=>{
//       return h('div',{style:{color:state.color}},state.user.name+' 今年 '+state.user.age+'岁')
//     }
//   }
// }

// 核心diff示例
const App = {
  setup() {
    const state = reactive({
      flag:true
    })
    setTimeout(()=>{
      state.flag=!state.flag;
    },2000)
    return ()=>{
      return state.flag ?
      h('div',{style:{color:'red'}},[
        h('li',{key:'C',style:{background:'yellow'}},'C'),
        h('li',{key:'A',style:{background:'red'}},'A'),
        h('li',{key:'B',style:{background:'blue'}},'B'),
        
      ]):
      h('div',{style:{color:'blue'}},[
        h('li',{key:'A',style:{background:'red'}},'A'),
        h('li',{key:'B',style:{background:'blue'}},'B'),
        h('li',{key:'C',style:{background:'yellow'}},'C'),
        h('li',{key:'D',style:{background:'purple'}},'D')
      ])
    }
  }
}

createApp(App).mount('#app')