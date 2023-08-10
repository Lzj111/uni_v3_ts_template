/**
 * @description 全局API请求统一在此定义,便于后期维护
 * @author lzj
 * @date 2023/06/01-18:18
 */

import { http } from "./core";
/**
 * @description 云之家登陆接口
 * @param params 
 * @returns 
 */
let test = function (params: any): Promise<any> {
    let url = "/api/login";
    return http.post(url, params, { hasAuthorization: false });
}

// >>> 将API方法暴露出去 <<<
export {
    test,
}
