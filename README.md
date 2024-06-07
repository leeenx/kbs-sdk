# kbs-sdk

提供给 [kb-smart-component](https://github.com/leeenx/kb-smart-component) 的配套工具包。使用包提供的「KbsPage」可以创建一个运行「kbs-dsl」的页面环境，具体参考：

```javascript
import { KbsPage } from "kbs-sdk";
KbsPage({
  watch: true, // 是否监听，本地开发环境建议开启
  defaultKbsRoute: 'page-b', // 缺省路由（DSL 的路由）
  dslBase: 'http://127.0.0.1:9000/', // dsl 路由的 base
  defaultContainer: '/pages/kb/index', // 缺省页面容器 ---- 带头部的容器，必填
  headlessContainer: '/pages/kb-headless/index', // 不带头部的页面容器，如果需要提供无头部的页面窗口，此项必填
  onShow() {
    wx.hideHomeButton();
    console.log('------带头部的页面窗口');
  }
});
```

## hooks

「kb-smart-component」底层的 kbone 只提供了 React-Hooks，这明显是不足以支撑一个页面功能的。「kbs-sdk」提供了小程序相关的 hooks 如下：

### app-hooks

- useLaunch, 等同于 App 入口的 onLaunch 生命周期钩子
- useError, 等同于 App 入口的 onError 生命周期钩子
- usePageNotFound, 等同于 App 入口的 onPageNotFound 生命周期钩子
- useUnhandledRejection, 等同于 App 入口的 onUnhandledRejection 生命周期钩子
- useAppShow, 等同于 App 入口的 onAppShow 生命周期钩子
- useAppHide, 等同于 App 入口的 onAppHide 生命周期钩子
- useThemeChange, 等同于 App 入口的 onThemeChange 生命周期钩子

### page-hooks

- useLoad, 等同于 Page 入口的 onLoad 勾子
- useShow, 等同于 Page 入口的 onShow 勾子
- useReady, 等同于 Page 入口的 onReady 勾子
- useHide, 等同于 Page 入口的 onHide 勾子
- useUnload, 等同于 Page 入口的 onUnload 勾子
- useRouteDone, 等同于 Page 入口的 onRouteDone 勾子
- usePullDownRefresh, 等同于 Page 入口的 onPullDownRefresh 勾子
- useReachBottom, 等同于 Page 入口的 onReachBottom 勾子
- usePageScroll, 等同于 Page 入口的 onPageScroll 勾子
- useAddToFavorites, 等同于 Page 入口的 onAddToFavorites 勾子
- useShareAppMessage, 等同于 Page 入口的 onShareAppMessage 勾子
- useShareTimeline, 等同于 Page 入口的 onShareTimeline 勾子
- useResize, 等同于 Page 入口的 onResize 勾子
- useTabItemTap, 等同于 Page 入口的 onTabItemTap 勾子
- useSaveExitState, 等同于 Page 入口的 onSaveExitState 勾子

理论上，DSL 是在页面「onLoad」之后再运行的。所以「useLoad」实际上是不会起任何作用，建议使用`useEffect(() => {}, [])` 代替；「useShow」监听不到第一次 onShow，原因与「useLoad」相同。

## 页面路由与页面跳转

 这里有两种路由：
 - 小程序路由
 - 「kbs-dsl-maker」的路由（web 路由）

 「小程序路由」是最终要作用于小程序的路由，而「kbs-dsl-maker」的路由是一种逻辑上的短路由，通过转换规则可以生成「小程序路由」。在这里「小程序路由」是不友好 的，所以在「kbs-dsl-maker」中直接使用 web路由做为逻辑路由。「kbs-sdk」提供了两个方法，如下：

 - navigate
 - createRoute

```typescript
function createRoute(route: string, params: any, headless: boolean): string;
function navigate(route: string, params: any, config?: NavigateConfig): Promise<void>;
```

在「kbs-dsl-maker」中，使用「navigate」作页面跳转；使用「createRoute」可以返回「小程序路由」，在分享或是生成页面二维码等场景可使用。