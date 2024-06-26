interface WatchOptions {
  protocol?: 'ws';
  host?: string;
  port?: number;
  entry?: string;
}

interface KbsPageOptions extends WechatMiniprogram.Page.DataOption {
  defaultKbsRoute?: string;
  dslBase?: string;
  watch?: boolean;
  watchOptions?: WatchOptions;
  defaultContainer?: string;
  headlessContainer?: string;
}

interface NavigateConfig {
  replace?: boolean;
  headless?: boolean;
}

interface ImportModuleParams {
  path: string;
  saveToStorage?: boolean;
}

declare module 'kbs-sdk' {
  export function KbsPage(options: KbsPageOptions): void;
  export function getCurrentPage(): WechatMiniprogram.Page.Instance<WechatMiniprogram.IAnyObject, WechatMiniprogram.IAnyObject>;
  export function getParams(): Record<string, string | undefined>;
  export function getParam(key: string): string | undefined;
  export function getDslUrl(route: string): string;
  export function fromHtml(url: string): Promise<string>;
  export function createRoute(route: string, params: any, headless: boolean): string;
  export function navigate(route: string, params: any, config?: NavigateConfig): Promise<void>;
  export function importModule(params: ImportModuleParams): Promise<any>;
}
