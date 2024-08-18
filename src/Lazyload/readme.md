### React lazyload
1. npm i react-lazyload prop-types @types/react-lazyload
2. 用React.lazy包裹的会异步加载 `const LazyGuang = React.lazy(() => import('./Guang'));`
3. import() 包裹的模块会单独打包，然后 React.lazy 是用到这个组件的时候才去加载。
4. 浏览器的 **IntersectionObserver** 观察器基本使用
5. 手写**lazyload**