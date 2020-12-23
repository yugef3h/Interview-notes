## 重复渲染优化

目的就是避免因自身的渲染更新或是副作用带来的全局重新渲染。

### 受控性组件颗粒化

`可控性组件` 和 `非可控性` 的区别就是 dom 元素值是否有受到 react 数据状态state 控制。一旦由 react 的 state 控制数据状态，比如input输入框的值，就会造成这样一个场景，为了使input值实时变化，会不断setState，就会不断触发render函数，如果父组件内容简单还好，如果父组件比较复杂，会造成牵一发动全身，如果其他的子组件中 componentWillReceiveProps 这种带有副作用的钩子，那么引发的蝴蝶效应不敢想象。比如如下 demo：

```js
class index extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state={
            inputValue:''
        }
    }
    handerChange=(e)=> this.setState({ inputValue:e.target.value  })
    render(){
        const { inputValue } = this.state
        return <div>
            { /*  我们增加三个子组件 */ }
            <ComA />
            <ComB />
            <ComC />
            <div className="box" >
                <Input  value={inputValue}  onChange={ (e)=> this.handerChange(e) } />
            </div>
            {/* 我们首先来一个列表循环 */}
            {
                new Array(10).fill(0).map((item,index)=>{
                    console.log('列表循环了' )
                    return <div key={index} >{item}</div>
                })
            }
            {
              /* 这里可能是更复杂的结构 */
              /* ------------------ */
            }
        </div>
    }
}
```

其中组件 B，有一个 `componentWillReceiveProps` 钩子
```js
class Index extends React.Component{
    constructor(props){
        super(props)
    }
    componentWillReceiveProps(){
        console.log('componentWillReceiveProps执行')
        /* 可能做一些骚操作 wu lian */
    }
    render(){
        console.log('组件B渲染')
        return <div>
            我是组件B
        </div>
    }
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3df076fbac84df69fcae7094999b6db~tplv-k3u1fbpfcp-watermark.image)

当我们在 input 输入内容的时候。就会造成如上的现象，所有的不该重新更新的地方，全部重新执行了一遍，这无疑是巨大的性能损耗。这个一个 `setState` 触发带来的一股巨大的由此组件到子组件可能更深的更新流，带来的副作用是不可估量的。所以我们可以思考一下，是否将这种受控性组件颗粒化，只让它自己更新，渲染过程由自身调度。

```js
const ComponentInput = memo(function({ notifyFatherChange }:any){
    const [inputValue , setInputValue] = useState('')
    const handerChange = useMemo(() => (e) => {
        setInputValue(e.target.value)
        notifyFatherChange && notifyFatherChange(e.target.value)
    },[])
    return <Input value={inputValue} onChange={ handerChange }  />
})
```

此时的组件更新由组件单元自行控制，不需要父组件的更新，所以不需要父组件设置独立 state 保留状态。只需要绑定到 `this` 上即可。不是所有状态都应该放在组件的 state 中，例如缓存数据。如果需要组件响应它的变动, 或者需要渲染到视图中的数据才应该放到 state 中。这样可以避免不必要的数据变动导致组件重新渲染.

```js
class index extends React.Component<any,any>{   
    formData :any = {}
    render(){
        return <div>
            { /*  我们增加三个子组件 */ }
            <ComA />
            <ComB />
            <ComC />
            <div className="box" >
               <ComponentInput notifyFatherChange={ (value)=>{ this.formData.inputValue = value } }  />
               <Button onClick={()=> console.log(this.formData)} >打印数据</Button>
            </div>
            {/* 我们首先来一个列表循环 */}
            {
                new Array(10).fill(0).map((item,index)=>{
                    console.log('列表循环了' )
                    return <div key={index} >{item}</div>
                })
            }
            {
              /* 这里可能是更复杂的结构 */
              /* ------------------ */
            }
        </div>
    }
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c8c7a28b48c4fa2bb527f3a838887f6~tplv-k3u1fbpfcp-watermark.image)



### 请求服务独立渲染

如果我们把页面，分为请求数据展示部分，和基础部分(不需要请求数据，已经直接写好的)，对于一些 `逻辑交互不是很复杂` 的数据展示部分，我推荐用一种独立组件，独立请求数据，独立控制渲染的模式。

下面的代码，`didMount` 做了三次请求，触发了三次 setState，渲染三次页面，即使用 Promise.all 等方法，但是也不保证接下来交互中，会有部分展示区重新拉取数据的可能。一旦有一个区域重新拉取数据，另外两个区域受到牵连，这种效应是不可避免的，即便 react 有很好的 diff 算法去调协相同的节点，但是比如长列表等情况，循环在所难免。

```js
class Index extends React.Component{
    state :any={
        dataA:null,
        dataB:null,
        dataC:null
    }
    async componentDidMount(){
        /* 获取A区域数据 */
        const dataA = await getDataA()
        this.setState({ dataA })
        /* 获取B区域数据 */
        const dataB = await getDataB()
        this.setState({ dataB })
        /* 获取C区域数据 */
        const dataC = await getDataC()
        this.setState({ dataC })
    }
    render(){
        const { dataA , dataB , dataC } = this.state
        console.log(dataA,dataB,dataC)
        return <div>
            <div> { /* 用 dataA 数据做展示渲染 */ } </div>
            <div> { /* 用 dataB 数据做展示渲染 */ } </div>
            <div> { /* 用 dataC 数据做展示渲染 */ } </div>
        </div>
    }
}
```
接下来我们，把每一部分抽取出来，形成独立的渲染单元，每个组件都独立数据请求到独立渲染。

```js
function ComponentA(){
    const [ dataA, setDataA ] = useState(null)
    useEffect(()=>{
       getDataA().then(res=> setDataA(res.data)  )
    },[])
    return  <div> { /* 用 dataA 数据做展示渲染 */ } </div>
} 

function ComponentB(){
    const [ dataB, setDataB ] = useState(null)
    useEffect(()=>{
       getDataB().then(res=> setDataB(res.data)  )
    },[])
    return  <div> { /* 用 dataB 数据做展示渲染 */ } </div>
} 

function ComponentC(){
    const [ dataC, setDataC ] = useState(null)
    useEffect(()=>{
       getDataC().then(res=> setDataC(res.data)  )
    },[])
    return  <div> { /* 用 dataC 数据做展示渲染 */ } </div>
}  

function Index (){
    return <div>
        <ComponentA />
        <ComponentB />
        <ComponentC />
    </div>
}
```

这样一来，彼此的数据更新都不会相互影响。

### 总结

拆分需要单独调用后端接口的细小组件，建立独立的数据请求和渲染，这种依赖数据更新 -> 视图渲染的组件，能从整个体系中抽离出来 ，好处我总结有以下几个方面。

1. 可以避免父组件的冗余渲染，react的数据驱动，依赖于 state 和 props 的改变，改变state 必然会对组件 render 函数调用，如果父组件中的子组件过于复杂，一个自组件的 state 改变，就会牵一发动全身，必然影响性能，所以如果把很多依赖请求的组件抽离出来，可以直接减少渲染次数。

2. 可以优化组件自身性能，无论从 class 声明的有状态组件还是 fun 声明的无状态，都有一套自身优化机制，无论是用 shouldupdate 还是用 hooks中 useMemo useCallback，都可以根据自身情况，定制符合场景的渲染条
件，使得依赖数据请求组件形成自己一个小的，适合自身的渲染环境。

3. 能够和 redux，以及 redux 衍生出来 redux-action，dva，更加契合的工作，用 connect 包裹的组件，就能通过制定好的契约，根据所需求的数据更新，而更新自身，而把这种模式用在这种小的，需要数据驱动的组件上，就会起到物尽其用的效果。


## API 助力性能调优

### shouldComponentUpdate

使用 shouldComponentUpdate() 以让 React 知道当 state 或 props 的改变是否影响组件的重新 render，默认返回 ture，返回 false 时不会重新渲染更新，而且该方法并不会在初始化渲染或当使用 forceUpdate() 时被调用

### PureComponent

React.PureComponent 通过 props 和 state 的浅对比来实现 shouldComponentUpate()。如果对象包含复杂的数据结构(比如对象和数组)，他会浅比较，如果深层次的改变，是无法作出判断的，React.PureComponent 认为没有变化，而没有渲染试图。

### React.memo

react.memo 和 PureComponent 功能类似，react.memo 作为第一个高阶组件，第二个参数 可以对 props 进行比较，和 shouldComponentUpdate 不同的，当第二个参数返回 true 的时候，证明 props 没有改变，不渲染组件，反之渲染组件

### immetable.js

immetable.js 可以提高对象的比较性能，像之前所说的pureComponent 只能对对象进行浅比较，对于对象的数据类型却束手无策，所以我们可以用 immetable.js 配合 shouldComponentUpdate 或者 react.memo 来使用。

```js
import { is  } from 'immutable'
const GoodItems = connect(state =>
    ({ GoodItems: filter(state.getIn(['Items', 'payload', 'list']), state.getIn(['customItems', 'payload', 'list'])) || Immutable.List(), })
    /* 此处省略很多代码～～～～～～ */
)(memo(({ Items, dispatch, setSeivceId }) => {
   /*  */
}, (pre, next) => is(pre.Items, next.Items)))
```

## 规范写法

1. 绑定事件尽量不要使用箭头函数，避免重复渲染
2. 循环正确使用 key，`禁止`使用 index，或 index 拼接其他的字段。
3. 避免在一个组件函数中重复声明，可以使用 `useMemo`
4. 懒加载 Suspense 和 lazy

重点说下第 3 点：对于无状态组件，数据更新就等于函数上下文的重复执行。那么函数里面的变量，方法就会重新声明，比如：

```js
function Index(){
    const [ number , setNumber  ] = useState(0)
    const handerClick1 = ()=>{
        /* 一些操作 */
    }
    const handerClick2 = ()=>{
        /* 一些操作 */
    }
    const handerClick3 = ()=>{
        /* 一些操作 */
    }
    return <div>
        <a onClick={ handerClick1 } >点我有惊喜1</a>
        <a onClick={ handerClick2 } >点我有惊喜2</a>
        <a onClick={ handerClick3 } >点我有惊喜3</a>
        <button onClick={ ()=> setNumber(number+1) } > 点击 { number } </button>
    </div>
}
```

每次点击 button 的时候,都会执行 Index 函数。handerClick1、handerClick2、handerClick3 都会重新声明。为了避免这个情况的发生，我们可以用 useMemo 做缓存，我们可以改成如下：

```js
function Index(){
    const [ number , setNumber  ] = useState(0)
    const [ handerClick1 , handerClick2  ,handerClick3] = useMemo(()=>{
        const fn1 = ()=>{
            /* 一些操作 */
        }
        const fn2 = ()=>{
            /* 一些操作 */
        }
        const  fn3= ()=>{
            /* 一些操作 */
        }
        return [fn1 , fn2 ,fn3]
    },[]) /* 只有当数据里面的依赖项，发生改变的时候，才会重新声明函数。 */
    return <div>
        <a onClick={ handerClick1 } >点我有惊喜1</a>
        <a onClick={ handerClick2 } >点我有惊喜2</a>
        <a onClick={ handerClick3 } >点我有惊喜3</a>
        <button onClick={ ()=> setNumber(number+1) } > 点击 { number } </button>
    </div>
}
```

改变之后，handerClick1、handerClick2、handerClick3 会被缓存下来。

## 如何避免重复渲染
- 学会使用的批量更新：react-dom 中提供了 unstable_batchedUpdates 方法进行手动批量更新。
- 合并state
- useMemo React.memo 隔离单元
- useCallback 回调
- 学会使用缓存

state 可以用来管理数据，但依旧不能滥用。react 并不像 vue 那样响应式数据流。 在 vue 中 有专门的 dep 做依赖收集，可以自动收集字符串模版的依赖项，只要没有引用的 data 数据，在vue中是不会更新渲染的。因为不存在的属性 dep 没有收集渲染watcher依赖项。在 react 中，我们触发 this.setState 或者 useState，只会关心两次 state 值是否相同，来触发渲染，根本不会在乎 jsx 语法中是否真正的引入了正确的值。

## 状态管理

总结：综合考虑业务，不要滥用。对于不变的数据，多个页面可能需要的数据，放在状态管理中，对于时常变化的数据，我们可以直接请求接口

## 时间分片

使用 `setTimeout` 或 `reduce` 分割任务

```js
while(length) {
	length.splice
  let res = await api...
  res.data.reduce(fn, init)
}

setTimeout(() => {
  const newList = list.slice( times , (times + 1) * 100 ) /* 每次截取 100 个 */
  this.setState({
      list: this.state.list.concat(newList)
  })
  this.sliceTime( list ,times + 1 )
}, 0)
```

## 虚拟列表

[react-tiny-virtual-list](https://www.npmjs.com/package/react-tiny-virtual-list)

具体思路：
1. 初始化计算容器的高度。截取初始化列表长度。这里我们需要 div 占位,撑起滚动条。
2. 通过监听滚动容器的 onScroll 事件,根据 scrollTop 来计算渲染区域向上偏移量, 我们要注意的是，当我们向下滑动的时候，为了渲染区域，能在可视区域内，可视区域要向上的滚动；我们向上滑动的时候，可视区域要向下的滚动。
3. 通过重新计算的 end 和 start 来重新渲染列表。


性能优化点：
1. 对于移动视图区域，我们可以用 transform 来代替改变 top 值。
2. 虚拟列表实际情况，是有 start 或者 end 改变的时候，在重新渲染列表，所以我们可以用之前 shouldComponentUpdate 来调优，避免重复渲染。

