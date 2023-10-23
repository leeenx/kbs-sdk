export interface NavigateConfig {
  replace: boolean;
  headless: boolean;
}

export interface WatchOptions {
  protocol?: 'ws';
  host?: string;
  port?: number;
  entry?: string;
};

export interface KbsPageOptions extends WechatMiniprogram.Page.DataOption {
  defaultKbsRoute?: string;
  dslBase?: string;
  watch?: boolean;
  watchOptions?: WatchOptions;
  defaultContainer?: string;
  headlessContainer?: string;
};

/**
 * 以下是 APP 勾子
 */
export type UseLaunchCallback = () => void;
export type UseErrorCallback = (err: string) => void;
export type UsePageNotFoundCallback = (res: {
  path: string;
  query: Object;
  isEntryPage: boolean;
}) => void;
export type UseUnhandledRejectionCallback = (res: {
  reason: string;
  promise: Promise<any>
}) => void;
export type UseAppShowCallback = (res: {
  path: string;
  scene: number;
  query: Object;
  shareTicket?: string;
  referrerInfo: {
    appId: string;
    extraData: Object;
  };
  forwardMaterials: {
    type: string;
    name: string;
    path: string;
    size: number;
  }[];
  chatType?: number; // 1 | 2 | 3 | 4;
  apiCategory?: string; // 'default' | 'nativeFunctionalized' | 'browseOnly' | 'embedded'
}) => void;
export type UseAppHideCallback = () => void;
export type UseThemeChangeCallback = (res: { theme: string }) => void;

/**
 * 以下是页面勾子
 */
export type UseLoadCallback = (query: Object) => void;
export type UseShowCallback = () => void;
export type UseReadyCallback = () => void;
export type UseHideCallback = () => void;
export type UseUnloadCallback = () => void;
export type UseRouteDoneCallback = () => void;
export type UsePullDownRefreshCallback = () => void;
export type UseReachBottomCallback = () => void;
export type UsePageScrollCallback = (res: { scrollTop: number }) => void;
export type UseAddToFavoritesCallback = (res: { webViewUrl: string }) => {
  title: string;
  imageUrl: string;
  query: string;
};
export type UseShareAppMessageCallback = (res: {
  from: string;
  target: string;
  webViewUrl: string;
}) => {
  title: string;
  path: string;
  imageUrl: string;
  promise: Promise<{
    title: string;
    path: string;
    imageUrl: string;
  }>
};
export type UseShareTimelineCallback = () => {
  title: string;
  query: string;
  imageUrl: string;
};
export type UseResizeCallback = (res: {
  size: {
    windowWidth: number;
    windowHeight: number;
  }
}) => void;
export type UseTabItemTapCallback = (res: {
  index: string;
  pagePath: string;
  text: string;
}) => void;
export type UseSaveExitStateCallback = () => void;

export interface PageHooks {
  // 生命周期
  onLoad?: UseLoadCallback;
  onShow?: UseShowCallback;
  onReady?: UseReadyCallback;
  onHide?: UseHideCallback;
  onUnload?: UseUnloadCallback;
  onRouteDone?: UseRouteDoneCallback;
  // 事件回调
  onPullDownRefresh?: UsePullDownRefreshCallback;
  onReachBottom?: UseReachBottomCallback;
  onPageScroll?: UsePageScrollCallback;
  onAddToFavorites?: UseAddToFavoritesCallback;
  onShareAppMessage?: UseShareAppMessageCallback;
  onShareTimeline?: UseShareTimelineCallback;
  onResize?: UseResizeCallback;
  onTabItemTap?: UseTabItemTapCallback;
  onSaveExitState?: UseSaveExitStateCallback;
}
