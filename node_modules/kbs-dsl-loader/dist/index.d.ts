interface DslLoadParams {
  url: string;
  fromHtml?: boolean;
  watch?: boolean;
  watchOptions?: WatchOptions;
}
interface WatchOptions {
  protocol?: 'ws';
  host?: string;
  port?: number;
  entry?: string;
  update?: (json: any) => void;
}

declare module 'kbs-dsl-loader' {
  export default function(params: DslLoadParams): Promise<any> | undefined;
}
