### Suspense

1. 基本用法，结合 React.lazy 异步模块,后台管理系统
``` tsx
    // aaa.tsx
   export default function Aaa(){
    return <div> yuyu</div>
}
    // index.tsx
    const LazyAaa = React.lazy(()=>import('./Aaa'))
    function App(){
        return (
            <Suspense fallback={'loading...'}>
                <LazyAaa />
            </Suspense>
        )
    }

```
import 是 webpack 异步加载模块的，用到了promise，这里先展示loading 再展示Aaa组件的内容


2. 单独使用：
`Suspense`的底层原理是**捕获**（catch捕获）的 promise，然后 React 会捕获这个promise ，交给最近的`Suspense`组件来处理。只要 throw 一个 promise，就会被最近的 Suspense 捕获。promise 初始状态展示 fallback，promise 改变状态后展示子组件。
