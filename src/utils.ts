//@ts-ignore
import { globalScope } from 'kbs-dsl-resolver';
// @ts-ignore
import { fromHtml, importModule } from 'kbs-dsl-loader';
import type { NavigateConfig } from './type';

// 获取当前页面
export const getCurrentPage = () => {
  const pages = getCurrentPages();
  const lastIndex = pages.length - 1;
  return pages[lastIndex];
};

// 获取当前的 options
export const getParams = () => {
  const page = getCurrentPage();
  return page.options;
};

// 返回指定 key 的 param
export const getParam = (key: string) => {
  const params = getParams();
  return params[key];
};

// 返回 dsl 地址
export const getDslUrl = (route: string) => {
  const { dslBase } = globalScope;
  let page = route;
  if (dslBase && !/^http(s?):/.test(route)) {
    page = `${dslBase}${route}`
  }
  return page;
};

// 返回微信小程的路由
export const createRoute = (route: string, params: any, headless: boolean) => {
  const {
    defaultContainer,
    headlessContainer
  } = globalScope;
  const url = headless ? headlessContainer : defaultContainer;
  if (!url) {
    // 表示「headlessContainer」&「defaultContainer」没有默认值
    throw new Error('「headlessContainer」或「defaultContainer」未指定路由');
  }
  const page = getDslUrl(route);
  let wxRoute: string = `${url}?route=${page}`;
  if (params && typeof params === 'object') {
    let paramsStr = '';
    paramsStr = Object.entries(params)
      .map(([key, value]) => {
        const type = typeof value;
        if (['number', 'string', 'boolean'].includes(type)) {
          return `${key}=${value}`;
        }
        if (type === 'object') {
          return `${key}=${encodeURIComponent(JSON.stringify(value))}`
        }
        return `${key}=`;
      })
      .join('&');
    if (paramsStr) {
      wxRoute = `${url}?route=${page}&${paramsStr}`;
    }
  }
  /**
   * 必传参数：pageNameSpace
   * pId 是用来区分页面栈里的路由的。因为多路由使用同一页面，不会产生新的页面对象；
   * 即 Page 方法只会在启动APP 的时候被调用，创建页面路由的时候不会被再次调用，需要一个额外的
   * 唯一值来做页面路由标记。每个页面路由需要一个独立的作用域，默认使用 pId
   */
  // return `${wxRoute}&pId=${Date.now()}`;
  return wxRoute;
}

export const navigate = (
  route: string,
  params: any,
  config?: NavigateConfig
): Promise<void> => new Promise((resolve, reject) => {
  const { replace = false, headless = false } = config || {};
  const options = {
    url: createRoute(route, params, headless),
    success: () => resolve(void 0),
    fail() {
      reject(new Error(`navigate 失败: ${JSON.stringify({ route, params, replace })}`));
    }
  };
  if (replace) {
    wx.redirectTo(options);
  } else {
    wx.navigateTo(options);
  }
});

export { fromHtml, importModule };
