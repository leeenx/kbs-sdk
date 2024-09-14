import {
  fromHtml,
  getDslUrl,
  getParams,
  getParam,
  navigate,
  createRoute,
  getCurrentPage
} from "./utils";
import { createPageHooks } from "./hooks/page";
import * as useAppHooks from './hooks/app';
import {
  registerToGlobleScope,
  registerToScope
} from 'kbs-dsl-resolver';
import type { KbsPageOptions, PageHooks } from "./type";

// 跳转
registerToGlobleScope({
  createRoute, // 创建微信的页面路径 ---- 分享时可能会用到这个方法来生成 URL
  navigate,
  getParams,
  getParam,
  getCurrentPage
});

// 页面是否已经挂载 hooks
const setOfHasMountedHooks: Record<string, boolean> = {};

// 按 pageNameSpace 存在的 pageHooks 集合
const collectionOfPageHooks: Record<string, PageHooks> = {};

const getPageNameSpace = () => {
  const { pageNameSpace } = getParams();
  return pageNameSpace || `default-page-name-space`;
};

// 定制 Page 方法
export const KbsPage = (options: KbsPageOptions) => {
  const {
    watchOptions = null,
    defaultKbsRoute = '',
    // defaultContainer,
    // headlessContainer,
    // dslBase,
    onShow
  } = options;
  // if (dslBase) {
  //   registerToGlobleScope({
  //     defaultContainer,
  //     headlessContainer,
  //     dslBase
  //   });
  // }

  const originShowHook = onShow;

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
        // 首先，保证原始 options 上的勾子正常执行
        hook?.bind(this)(...args);
        // 其次，通过 nameSpace 找到对应的页面 hooks
        const nameSpace = getPageNameSpace();
        const result = collectionOfPageHooks[nameSpace]?.[key]?.(...args);
        if (key === 'onUnload') {
          // 卸载
          delete collectionOfPageHooks[nameSpace];
          delete setOfHasMountedHooks[nameSpace];
        }
        return result;
      }
    });
  });
  /**
   * onShow 作为页面第一个初触发的事件，充当初始化的角色
   */
  Object.assign(options, {
    async onShow() {
      const { route, pageTitle } = getParams();
      if (pageTitle) {
        wx.setNavigationBarTitle({ title: pageTitle });
      }
      // 生成页面的唯一标记
      const nameSpace = getPageNameSpace();
      if (!setOfHasMountedHooks[nameSpace]) {
        // 创建页面 hooks
        const { pageHooks, usePageHooks } = createPageHooks();
        // pageHooks 推入集合
        collectionOfPageHooks[nameSpace] = pageHooks;
        // 向页面作用域挂载 hooks
        registerToScope(nameSpace, {
          nameSpace,
          pagePointer: this,
          kbsHooks: {
            ...useAppHooks,
            ...usePageHooks,
          }
        });
        setOfHasMountedHooks[nameSpace] = true;
      }
      // onShow 需要手动触发
      originShowHook?.();
      collectionOfPageHooks[nameSpace].onShow?.();
      const url = await fromHtml(getDslUrl(route ? decodeURIComponent(route) : defaultKbsRoute));
      let pageName = getParam('page');
      if (pageName) {
        pageName = pageName.replace(/[-_]+|^(.)?/g, (match, letter) => letter.toUpperCase());
        pageName = pageName.replace(/^\w/, pageName[0].toUpperCase());
      }
      // 以上为动态挂载
      const props = this.data?.props || {};
      console.log('+++++++ props', props);
      this.setData({
        props: { watchOptions, url, nameSpace, pageName, ...props }
      });
    }
  });
  return Page(options);
};

export default KbsPage;
