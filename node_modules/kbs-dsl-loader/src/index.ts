interface WatchOptions {
  protocol?: 'ws';
  host?: string;
  port?: number;
  entry?: string;
  update?: (json: any) => void;
};

interface DslLoadParams {
  url: string;
  fromHtml?: boolean;
  watch?: boolean;
  watchOptions?: WatchOptions;
};

// 内存级缓存
const memoCache: Record<string, Promise<any> | undefined> = {};

// 默认监听参数
const defaultWatchOptions: WatchOptions = {
  protocol: 'ws',
  host: 'localhost',
  port: 9900
};

// websocket 链接
const connectSocketTaskMap: Record<string, any | undefined> = {};

// 清除 websocket 任务
const removeSocketTask = (url) => {
  delete connectSocketTaskMap[url];
};

// 创建 websocket 任务
const createWebsocketTask = (url: string) => {
  if (!connectSocketTaskMap[url]) {
    const task = wx.connectSocket({
      url,
      fail: (err) => {
        console.log('失败：', err);
      }
    });
    if (task) {
      task.onOpen(() => {
        console.log('文件监听开启!');
      });
      task.onClose(() => removeSocketTask(url));
      task.onError(() => removeSocketTask(url));
      connectSocketTaskMap[url] = task;
    }
  }
  return connectSocketTaskMap[url];
};

// 从 html 中提取 dsl 地址
const extractDslUrl= (htmlUrl: string): Promise<string>  => new Promise((resolve, reject) => {
  wx.request({
    url: htmlUrl,
    method: 'GET',
    dataType: '其他',
    success({ data }) {
      const result = (data as string)?.match(/\<script src="([^"]+)"\>\<\/script\>\<\/body\>/mg);
      if (result?.length) {
        const dslName = result[0].replace(/^.+src="([^"]+)".+$/, '$1').replace(/\.js$/, '.dsl.json');
        if (/^http(s?):\/\/|^\/\//.test(dslName)) {
          resolve(dslName);
        } else {
          const separation = /\/$/.test(htmlUrl) ? '' : '/';
          resolve(`${htmlUrl}${separation}${dslName}`);
        }
      } else {
        reject(new Error('获取 dsl 地址失败！'));
      }
    },
    fail(err) {
      reject(err);
    }
  });
});

const dslLoad = (params: DslLoadParams) => {
  const {
    url,
    watch = false,
    watchOptions,
    fromHtml = false
  } = params;

  if(!memoCache[url]) {
    memoCache[url] = new Promise(async (resolve, reject) => {
      try {
        const dslUrl = fromHtml ? await extractDslUrl(url) : url;
        wx.request({
          url: dslUrl,
          method: 'GET',
          dataType: 'json',
          success({ data }) {
            resolve(data);
          },
          fail(err) {
            reject(err);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  if (watch) {
    // 需要监听文件变化
    const wsOptions: WatchOptions = Object.assign({}, defaultWatchOptions, watchOptions || {});
    const {
      protocol,
      host,
      port,
      update
    } = wsOptions;
    let { entry } = wsOptions
    if (!entry) {
      entry = url.replace(/.+\/([^\/]+)/, '$1');
    }
    const task = createWebsocketTask(`${protocol}://${host}:${port}`);
    if (task) {
      task.onMessage(({ data }) => {
        const result = JSON.parse(data as string);
        if (result.entry === entry) {
          update?.(JSON.parse(result.dslStr));
        }
      });
    }
  }
  return memoCache[url];
};
export default dslLoad;
