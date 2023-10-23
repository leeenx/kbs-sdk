import { globalScope } from "kbs-dsl-resolver";
import type {
  UseLaunchCallback,
  UseErrorCallback,
  UsePageNotFoundCallback,
  UseUnhandledRejectionCallback,
  UseAppShowCallback,
  UseAppHideCallback,
  UseThemeChangeCallback
} from "../type";

// App 的生命周期 hooks

/**
 * 微信小程序文档：https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onLaunch-Object-object
 * 小程序初始化完成时触发，全局只触发一次
 * 理论上，页面级别的组件不可能监听到这个事件
 */
export const useLaunch = (callback?: UseLaunchCallback) => {
  globalScope.useEffect(() => {
    console.log('useLaunch 永远不会被触发：', callback);
  }, []);
};

/**
 * 等同于 App 入口的 onError 生命周期钩子
 */
export const useError = (callback?: UseErrorCallback) => {
  globalScope.useEffect(() => {
    wx.onError((err: string) => {
      callback?.(err);
    });
  }, []);
};

/**
 * 等同于 App 入口的 onPageNotFound 生命周期钩子
 */
export const usePageNotFound = (callback?: UsePageNotFoundCallback) => {
  globalScope.useEffect(() => {
    wx.onPageNotFound((res) => {
      callback?.(res);
    });
  }, []);
};

/**
 * 等同于 App 入口的 onUnhandledRejection 生命周期钩子
 */
export const useUnhandledRejection = (callback?: UseUnhandledRejectionCallback) => {
  globalScope.useEffect(() => {
    wx.onUnhandledRejection((res) => {
      callback?.(res);
    });
  }, []);
};

/**
 * 等同于 App 入口的 onShow 生命周期钩子
 */
export const useAppShow = (callback?: UseAppShowCallback) => {
  globalScope.useEffect(() => {
    wx.onAppShow((res) => {
      callback?.(res);
    });
  }, []);
};

/**
 * 等同于 App 入口的 onHide 生命周期钩子
 */
export const useAppHide = (callback?: UseAppHideCallback) => {
  globalScope.useEffect(() => {
    wx.onAppHide(() => {
      callback?.();
    });
  }, []);
};

/**
 * 等同于 App 入口的 onThemeChange 生命周期钩子
 */
export const useThemeChange = (callback?: UseThemeChangeCallback) => {
  globalScope.useEffect(() => {
    wx.onThemeChange((res) => {
      callback?.(res);
    });
  }, []);
};
