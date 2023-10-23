import type {
  PageHooks,
  UseLoadCallback,
  UseShowCallback,
  UseReadyCallback,
  UseHideCallback,
  UseUnloadCallback,
  UseRouteDoneCallback,
  UsePullDownRefreshCallback,
  UseReachBottomCallback,
  UsePageScrollCallback,
  UseAddToFavoritesCallback,
  UseShareAppMessageCallback,
  UseShareTimelineCallback,
  UseResizeCallback,
  UseTabItemTapCallback,
  UseSaveExitStateCallback
} from "../type";

const EMPTY_CALL: (res?: any) => any = () => {};

/**
 * 页面的生命周期勾子
 * 与 App 生命周期不同，页面的生命周期不是全局的，需要按页面创建
 */
export const createPageHooks = () => {
  const pageHooks: PageHooks = {
    onLoad: EMPTY_CALL,
    onShow: EMPTY_CALL,
    onReady: EMPTY_CALL,
    onHide: EMPTY_CALL,
    onUnload: EMPTY_CALL,
    onRouteDone: EMPTY_CALL,
    onPullDownRefresh: EMPTY_CALL,
    onReachBottom: EMPTY_CALL,
    onPageScroll: EMPTY_CALL,
    onAddToFavorites: EMPTY_CALL,
    onShareAppMessage: EMPTY_CALL,
    onShareTimeline: EMPTY_CALL,
    onResize: EMPTY_CALL,
    onTabItemTap: EMPTY_CALL,
    onSaveExitState: EMPTY_CALL
  };
  const usePageHooks = {
    useLoad(callback?: UseLoadCallback) {
      callback && (pageHooks.onLoad = callback);
    },
    useShow(callback?: UseShowCallback) {
      callback && (pageHooks.onShow = callback);
    },
    useReady(callback?: UseReadyCallback) {
      callback && (pageHooks.onReady = callback);
    },
    useHide(callback?: UseHideCallback) {
      callback && (pageHooks.onHide = callback);
    },
    useUnload(callback?: UseUnloadCallback) {
      callback && (pageHooks.onUnload = callback);
    },
    useRouteDone(callback?: UseRouteDoneCallback) {
      callback && (pageHooks.onRouteDone = callback);
    },
    usePullDownRefresh(callback?: UsePullDownRefreshCallback) {
      callback && (pageHooks.onPullDownRefresh = callback);
    },
    useReachBottom(callback?: UseReachBottomCallback) {
      callback && (pageHooks.onReachBottom = callback);
    },
    usePageScroll(callback?: UsePageScrollCallback) {
      callback && (pageHooks.onPageScroll = callback);
    },
    useAddToFavorites(callback?: UseAddToFavoritesCallback) {
      callback && (pageHooks.onAddToFavorites = callback);
    },
    useShareAppMessage(callback?: UseShareAppMessageCallback) {
      callback && (pageHooks.onShareAppMessage = callback);
    },
    useShareTimeline(callback?: UseShareTimelineCallback) {
      callback && (pageHooks.onShareTimeline = callback);
    },
    useResize(callback?: UseResizeCallback) {
      callback && (pageHooks.onResize = callback);
    },
    useTabItemTap(callback?: UseTabItemTapCallback) {
      callback && (pageHooks.onTabItemTap = callback);
    },
    useSaveExitState(callback?: UseSaveExitStateCallback) {
      callback && (pageHooks.onSaveExitState = callback);
    }
  };
  return { pageHooks, usePageHooks };
};

