/**
 * @description Core
 * @author lzj
 * @date 2023/06/01
 */

import Utils from "./util";
import { BaseCode } from "./codeTable";
// > 读取配置文件
import Config from "../static/config.json";
// > 设置配置文件至缓存
uni.setStorageSync("Config", Config);

//#region >> 请求遮罩
let loadingCount = 0;
function showLoading(isLoading: boolean = false, msg: string = "加载中") {
    if (isLoading) {
        uni.showLoading({ title: msg, });
        loadingCount += 1;
    }
}
function hideLoading() {
    loadingCount -= 1;
    if (loadingCount <= 0) {
        uni.hideLoading();
    }
}
//#endregion

//#region >> 同意Http请求Core  
function rejectFun(reject: any, err: { errno: number; errmsg: string }) {
    const { errmsg = '获取数据异常!', errno = -1 } = err;
    switch (errno) {
        case 10000:
            // 特殊异常处理
            break;
        default:
            uni.showToast({
                title: errmsg,
                icon: 'none',
            });
            break;
    }
    reject(err);
}
/**
 * @description 基础请求方法
 * @param {String} method  请求类型  'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | undefined,
 * @param {String} url 请求地址 
 * @param {Object} data 请求数据
 * @param {Object} config 请求扩展配置
 * @param {Map<String,String>} config.contentType 请求头类型 默认"application/x-www-form-urlencoded" 支持传入"application/json; charset=utf-8"
 * @param {Map<String,String>} config.hasAuthorization 请求头是否带上Authorization 默认带传fakse取消
 * @param {Map<String,Number>} config.timeout 请求超时时间 默认30000
 * @param {Map<String,String>} config.baseURL 自定义域名
 * @param {Map<String,Boolean>} config.isLoading true时显示接口请求加载框 false不显示
 * @param {Map<String,String} config.loadingMsg 加载框提示语
 * @param {Map<String,Boolean} config.originResponse 是否返回原始响应数据 false默认
 * @returns 
 */
function baseRequest(
    method: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | undefined,
    url: string,
    data: {},
    config: Http.ResquestExtendConfig = {}) {
    return new Promise((resolve, reject) => {
        showLoading(config.isLoading, config.loadingMsg);

        // > 处理扩展配置
        let contentType: string | undefined = "application/json; charset=utf-8";
        let hasAuthorization: boolean = true;
        let timeout: number = 30000;
        let baseURL: string = Config.webApi;

        if (config) {
            // >> 是否需要鉴权
            if (!Utils.isNullOrEmpty(config.hasAuthorization)) {
                hasAuthorization = Boolean(config.hasAuthorization);
            }
            // >> 是否修改contentType
            if (!Utils.isNullOrEmpty(config.contentType)) {
                contentType = config.contentType;
            }
            // >> 超时时间
            if (Utils.isNumber(config.timeout)) {
                timeout = config.timeout || timeout;
            }
            // >> 扩展基础配置
            if (!Utils.isNullOrEmpty(config.baseURL)) {
                baseURL = config.baseURL || Config.webApi;
            }
        }

        // > 兼容api地址
        if (url.indexOf("/") != 0) url = "/" + url;
        baseURL = baseURL.charAt(baseURL.length - 1) == "/" ? baseURL.substring(0, baseURL.lastIndexOf("/")) : baseURL;

        // > 调用uniapi请求的配置
        let requestConfig: Http.RequestConfig | any = {
            url: baseURL + url,
            method,
            timeout: timeout,
            header: {
                'content-type': contentType,
            },
            data,
            success: (res: any) => {
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    let responseDate: unknown = config.originResponse ? res : res.data && (res.data.data || res.data);
                    resolve(responseDate);
                } else {
                    let errmsg = res.data && res.data.msg || "获取数据异常";
                    rejectFun(reject, { errno: -1, errmsg: errmsg });
                }
            },
            fail: () => {
                resolve
                rejectFun(reject, { errno: -1, errmsg: '网络不给力,请检查你的网络设置!' },);
            },
            complete: (data: any) => {
                hideLoading();
            }
        }
        // > 是否需要鉴权
        if (hasAuthorization) {
            let authorizationStr: string = uni.getStorageSync(BaseCode.accessToken);
            requestConfig.header.Authorization = authorizationStr;
        }

        uni.request(requestConfig);
    });
}
/**
 * @description 通用Http请求
 * @author lzj
 * @date 2023/06/01
 */
export const http = {
    /**
     * @description get请求
     * @param api 请求地址,地址前需要带"/"
     * @param params 请求参数
     * @returns 
     */
    get: <T>(api: string, params?: any, config?: Http.ResquestExtendConfig) =>
        baseRequest('GET', api, {
            ...params
        }, config) as Http.Response<T>,
    /**
     * @description post请求
     * @param api 请求地址,地址前需要带"/"
     * @param params 请求参数
     * @returns 
     */
    post: <T>(api: string, params?: any, config?: Http.ResquestExtendConfig) =>
        baseRequest('POST', api, {
            ...params
        }, config) as Http.Response<T>
};
//#endregion

//#region >> 通用日志
/**
 * @description 通用日志
 * @author lzj
 * @date 2023/06/06
 */
class Log {
    constructor() { }

    // > 获取日志级别
    private getLevel(): string {
        return Config && Config.logLevel || "error";
    }

    // > 通用调用底层日志
    private showLog(title?: string, msg?: any): void {
        if (title == undefined || title == null) {
            console && console.log(msg);
        }
        else {
            console && console.log(title, msg);
        }
    }

    // > info日志**暂时不用
    public info(title?: string, msg?: any): void {
        if (this.getLevel() == "info") {
            this.showLog(title, msg);
        }
    }
    // > debug级别
    public debug(title?: string, msg?: any): void {
        if (this.getLevel() == "debug") {
            this.showLog(title, msg);
        }
    }
    // > error级别
    public error(title?: string, msg?: any): void {
        if (this.getLevel() == "error") {
            this.showLog(title, msg);
        }
    }
}
export const log = new Log();
//#endregion
