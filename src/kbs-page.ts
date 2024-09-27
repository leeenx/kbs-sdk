import {
  fromHtml,
  getDslUrl,
  getParams,
  getParam,
  navigate,
  createRoute,
  getCurrentPage,
} from "./utils";
import { createPageHooks } from "./hooks/page";
import * as useAppHooks from './hooks/app';
//@ts-ignore
import { registerToGlobleScope, registerToScope } from 'kbs-dsl-resolver';
import type { KbsPageOptions, PageHooks } from "./type";

// 跳转
registerToGlobleScope({
  createRoute, // 创建微信的页面路径 ---- 分享时可能会用到这个方法来生成 URL
  navigate,
  getParams,
  getParam,
});

// 页面是否已经挂载 hooks
const setOfHasMountedHooks: Record<string, boolean> = {};

// 按 pageId 存在的 pageHooks 集合
const collectionOfPageHooks: Record<string, PageHooks> = {};

let pageIndex: number = 0;

const getPageId = () => {
  // 默认从 url 上获取
  const { pId } = getParams();
  return pId || `${pageIndex++}`;
};

// 定制 Page 方法
export const KbsPage = (options: KbsPageOptions) => {
  const {
    watchOptions = null,
    defaultKbsRoute = '',
    // defaultContainer,
    // headlessContainer,
    // dslBase,
    onLoad
  } = options;
  // if (dslBase) {
  //   registerToGlobleScope({
  //     defaultContainer,
  //     headlessContainer,
  //     dslBase
  //   });
  // }

  const originLoadHook = onLoad;

  // 在 options 挂载勾子
  [
    'onLoad',
    'onShow',
    'onReady',
    'onHide',
    'onUnload',
    'onRouteDone',
    'onPullDownRefresh',
    'onReachBottom',
    'onPageScroll',
    'onAddToFavorites',
    'onShareAppMessage',
    'onShareTimeline',
    'onResize',
    'onTabItemTap',
    'onSaveExitState'
  ].forEach(key => {
    const hook = options[key];
    Object.assign(options, {
      [key](...args) {
        const { pageId = '' } = this;
        // 首先，保证原始 options 上的勾子正常执行
        hook?.bind(this)(...args);
        // 其次，通过 pId 找到对应的页面 hooks
        const result = collectionOfPageHooks[pageId]?.[key]?.(...args);
        if (key === 'onUnload') {
          // 卸载
          delete collectionOfPageHooks[pageId];
          delete setOfHasMountedHooks[pageId];
        }
        return result;
      }
    });
  });
  /**
   * onLoad 作为页面第一个初触发的事件，充当初始化的角色
   */
  Object.assign(options, {
    async onLoad(query: Object) {
      const { route, pageTitle } = getParams();
      if (pageTitle) {
        wx.setNavigationBarTitle({ title: pageTitle });
      }
      // route 是分包路径，作为 nameSpace
      const nameSpace = getParam('route');
      // 生成页面的唯一标记
      this.pageId = getPageId();
      // 当前页面
      this.currentPage = getCurrentPage();
      const { pageId = '', currentPage = null } = this;
      if (!setOfHasMountedHooks[pageId]) {
        // 创建页面 hooks
        const { pageHooks, usePageHooks } = createPageHooks();
        // pageHooks 推入集合
        collectionOfPageHooks[pageId] = pageHooks;
        // 向页面作用域挂载 hooks
        registerToScope(nameSpace, {
          pageId,
          nameSpace,
          pagePointer: this,
          kbsHooks: {
            ...useAppHooks,
            ...usePageHooks,
          },
          // 返回自定义方法，可以直接获取当前页面的对象与参数
          currentPage,
          getCurrentPage: () => currentPage,
          getCurrentParams: () => currentPage?.options,
          getCurrentParam: (key: string) => currentPage?.options?.[key]
        });
        setOfHasMountedHooks[pageId] = true;
      }
      // onLoad 需要手动触发
      originLoadHook?.();
      collectionOfPageHooks[pageId].onLoad?.(query);
      const url = await fromHtml(getDslUrl(route ? decodeURIComponent(route) : defaultKbsRoute));
      let pageName = getParam('page');
      if (pageName) {
        pageName = pageName.replace(/[-_]+|^(.)?/g, (match, letter) => letter.toUpperCase());
        pageName = pageName.replace(/^\w/, pageName[0].toUpperCase());
      }
      const cacheCount = getParam('cacheCount') || 2; // 默认开启两个缓存
      // 以上为动态挂载
      const props = this.data?.props || {};
      this.setData({
        props: { watchOptions, url, nameSpace, pageId, pageName, cacheCount, ...props }
      });
    }
  });
  return Page(options);
};

export default KbsPage;
