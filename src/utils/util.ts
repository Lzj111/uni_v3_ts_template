/**
 * @description utils.ts 通用工具方法
 * @author lzj
 * @date 2023/06/01
 */

namespace Utils {
    // > 定义uni数据缓存对象
    declare let uni: any;
    declare let eruda: any;

    //#region 类型验证方法
    /**
     * @description 获取数据类型——返回类型的小写形式,eg:array|function|promise
     * @param sourceObj 入参
     * @returns string
     */
    export const getDataType = function (sourceObj: any): string {
        // return Object.prototype.toString
        //     .call(sourceObj)
        //     .replace(/^\[object\s(\w+)\]$/, "$1")
        //     .toLowerCase();
        return Object.prototype.toString.call(sourceObj).toLocaleLowerCase();
    };

    /**
     * @description 入参是否为对象
     * @param sourceObj 原始值
     * @returns Boolean
     */
    export const isObject = function (sourceObj: any): boolean {
        return getDataType(sourceObj) === "[object object]";
    };

    /**
     * @description 入参是否为数组
     * @param sourceObj 
     * @returns 
     */
    export const isArray = function (sourceObj: any): boolean {
        return getDataType(sourceObj) === "[object array]";
    };

    /**
     * @description 入参是否为字符串
     * @param sourceObj 
     * @returns 
     */
    export const isString = function (sourceObj: any): boolean {
        return getDataType(sourceObj) === "[object string]";
    };

    /**
     * @description 入参是否为数值
     * @param sourceObj 
     * @returns 
     */
    export const isNumber = function (sourceObj: any): boolean {
        return getDataType(sourceObj) === "[object number]";
    };

    /**
     * @description 入参是否为null||""||undefined
     * @param sourceObj 
     * @returns 
     */
    export const isNullOrEmpty = function (sourceObj: any): boolean {
        if (null == sourceObj || undefined == sourceObj)
            return true;
        else if (isString(sourceObj)) {
            return sourceObj.toString().trim() === '';
        }
        else {
            return false;
        }
    };

    //#endregion

    /**
     * @description: 获得字符串实际长度，中文2，英文1
     * @param {string} str 要获得长度的字符串
     * @return {number} str的长度
     */
    export const getRealLength = function (str: any): number {
        var realLength = 0,
            len = str.length,
            charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
            } else {
                realLength += 2;
            }
        }
        return realLength;
    };

    /**
     * @description: 验证中文
     * @param {String} verificationValue 待验证的值
     * @return {Boolean} true:中文 false:不是有效中文
     */
    export const isValidChinese = function (verificationValue: any): boolean {
        var reg = /^[\u4e00-\u9fa5]+$/;
        return reg.test(verificationValue);
    };

    /**
     * @description: 验证是否包含中文
     * @param {String} verificationValue 待验证的值
     * @return {Boolean} true:包含 false:不包含
     */
    export const isValidHaveChinese = function (verificationValue: any): boolean {
        var reg = /[\u4e00-\u9fa5]+/g;
        return reg.test(verificationValue);
    };

    /**
     * @description: 判断是否为英文
     * @param {String} verificationValue 待验证的值
     * @return {Boolean} true:是英文 false:不是英文
     */
    export const isEn = function (verificationValue: string): boolean {
        var reg = /^[a-zA-Z]*$/;
        return reg.test(verificationValue);
    };

    /**
     * @description: 生成Guid
     */
    export const createGuid = function (): string {
        var d = new Date().getTime();
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return guid;
    };

    /**
     * @description 时间戳转为格式化日期
     * @param time number
     * @returns 
     */
    export const formatDate = (time: number): string => {
        let datetime = new Date();
        datetime.setTime(time);
        let year: number = datetime.getFullYear();
        let month: number = datetime.getMonth() + 1;
        let date: number = datetime.getDate();
        let hour: number = datetime.getHours();
        let minute = datetime.getMinutes();
        let second = datetime.getSeconds();
        // > returns
        let monthStr: string = year.toString();
        let dateStr: string = date.toString();
        let hourStr: string = hour.toString();
        let minuteStr: string = minute.toString();
        let secondStr = second.toString();

        if (month <= 9) {
            monthStr = "0" + month;
        }
        if (date <= 9) {
            dateStr = "0" + date;
        }
        if (hour <= 9) {
            hourStr = "0" + hour;
        }
        if (minute <= 9) {
            minuteStr = "0" + minute;
        }
        if (second <= 9) {
            secondStr = "0" + second;
        }
        return year + "-" + monthStr + "-" + dateStr + " " + hourStr + ":" + minuteStr + ":" + secondStr;
    }

    /**
     * @description base64加密解密
     */
    export const base64Only = {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode: function (input: string): string {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = this.utf8Encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },
        utf8Encode: function (input: string): string {
            input = input.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < input.length; n++) {

                var c = input.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },
        // public method for decoding
        decode: function (input: string): string {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = this.utf8Decode(output);

            return output;

        },
        // private method for UTF-8 decoding
        utf8Decode: function (utftext: string): string {
            var string = "";
            var i = 0;
            var c = 0;
            var c2 = 0;
            var c3 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }
    }

    /**
     * @description: 判断是否以空格开头或者结尾
     * @param {String} verificationValue 待验证的值
     * @return {Boolean} true:是 false:不是
     */
    export const isStartOrLastHaveSpace = function (verificationValue: string): boolean {
        var reg = /(^\s)|(\s$)/;
        return reg.test(verificationValue);
    };

    /**
     * @description: 深拷贝对象
     * @param {*} obj 需要深拷贝的数据
     * @return {*} 返回深拷贝结果
     */
    export const deepCopy = function (obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    };

    /**
     * @description 首字母转小写
     * @param originalStr 
     * @returns 
     */
    export const firstLetterToLower = function (originalStr: string): string {
        return originalStr.replace(originalStr[0], originalStr[0].toLocaleLowerCase());
    }

    /**
     * @description 根据属性和值获取数组中对应对象的索引
     * @param array 数组对象
     * @param propertyKey 查询的属性key
     * @param propertyValue 查询的属性值
     * @returns index 索引
     */
    export const getArrayIndex = function (array: any[], propertyKey: any, propertyValue: any): number {
        if (!isArray(array)) return -1;
        let index: number = -1;
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (element[propertyKey] == propertyValue) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * @description 根据属性和值获取数组中对应对象的索引
     * @param array 数组对象
     * @param propertyKey 查询的属性key
     * @param propertyValue 查询的属性值
     * @returns index 索引
     */
    export const getArrayItem = function (array: any[], propertyKey: any, propertyValue: any): any {
        let index = getArrayIndex(array, propertyKey, propertyValue);
        if (index == -1) return null;
        return array[index];
    }

    /**
     * @description rpx转px
     * @param rpx 
     * @returns px
     */
    export const rpxToPx = function (rpx: number) {
        const screenWidth = uni.getSystemInfoSync().screenWidth;
        return (screenWidth * rpx) / 750
    }

    /**
     * @description px转rpx
     * @param px 
     * @returns rpx
     */
    export const pxToRpx = function (px: number) {
        const screenWidth = uni.getSystemInfoSync().screenWidth;
        return (750 * px) / screenWidth;
    }

    /**
     * @description h5跳转的方式
     * @param url 
     */
    export const h5Jump = function (url: string) {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        window.location.href = url;
        return;
        // > open可能影响路由
        // if (isAndroid) {  // android终端
        //     window.open(url);
        // } else if (isiOS) {   // ios终端
        //     let oWindow = window.open('', '_blank');
        //     if (oWindow) {
        //         // >先打开一个空白页，再更新它的地址
        //         oWindow.location = url;
        //     } else {
        //         window.location.href = url;
        //     }
        // }
    }

    /**
     * @description 打开新页面
     * @param url 页面链接
     * @param linkType 链接类型
     */
    export const openNewUrl = function (url: string, thirdLinkType: ThirdLinkType = 0, title?: string) {
        if (!url) {
            uni.showToast({ title: "无权限", icon: 'none' });
            return;
        }

        // >> 新页面打开(*需要兼容各种平台)
        let newpageFun = function (url: string, thirdLinkType: ThirdLinkType = 0, title?: string) {
            // #ifdef APP-PLUS
            plus.runtime.openURL(url);
            // #endif

            // #ifdef H5
            h5Jump(url);
            // #endif

            // ...
        }
        // >> iframe内嵌打开
        let iframeFun = function (url: string, thirdLinkType: ThirdLinkType = 0, title?: string) {
            uni.navigateTo({
                url: "/pages/transfer/transfer?url=" + encodeURIComponent(url) + "&name=" + title
            });
        }

        try {
            switch (thirdLinkType) {
                // >> NEWPAGE跳转
                case 0:
                    newpageFun(url, thirdLinkType, title);
                    break;
                // >> IFRAME内嵌
                case 1:
                    iframeFun(url, thirdLinkType, title);
                    break;
                default:
                    break;
            }
        } catch (error: any) {
            let errorMsg = error && error.errmsg;
            if (errorMsg) {
                uni.showToast({ title: errorMsg, icon: 'none' });
            }
        }
    };

    /**
     * @description 防抖
     * @param fn 回调函数
     * @param delay 时间延迟
     * @returns 
     */
    export const debounce = (fun: Function, time: number = 500) => {
        let timer: any = null;
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                fun();
                timer = null;
            }, time);
        }
    }
    
    /**
     * @description 获取url参数
     * @param url url地址
     * @param property 查询属性
     */
    export const getUrlParam = function (url: string, property: string) {
        var reg = new RegExp("(^|\\?|&)" + property + "=([^&]*)(\\s|&|$)", "i");
        if (reg.test(url))
            return unescape(RegExp.$2.replace(/\+/g, " "));
        return null;
    }

    /**
     * @description 对uni.navigateTo进行封装
     * @param url 
     * @param params 
     */
    export const navigateTo = function (url: string, params: object) { }

    /**
     * @description 计算时间:js计算时间为刚刚、几分钟前、几小时前、几天前
     * @param {string} timeStr 时间字符串
     * @returns 
     */
    export const timeAgo = function (timeStr: string): string {
        if (isNullOrEmpty(timeStr)) return timeStr;
        // > 兼容IOS转换
        timeStr = timeStr.replace(/-/g, '/');

        var datetime = new Date(timeStr);
        // 注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
        var dateTimeStamp = datetime.getTime();
        // 把分，时，天，周，半个月，一个月用毫秒表示
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var week = day * 7;
        var month = day * 30;
        var nowDate = new Date();
        var now = nowDate.getTime();
        // 时间差
        var diffValue = now - dateTimeStamp;

        if (diffValue < 0) {
            return "";
        }
        // 计算时间差的分，时，天，周，月
        var minC = diffValue / minute;
        var hourC = diffValue / hour;
        var dayC = diffValue / day;
        var weekC = diffValue / week;
        var monthC = diffValue / month;
        var result = "";

        // > 大于一个月
        if (monthC >= 1) {
            var Nyear = datetime.getFullYear();
            var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
            var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();

            // > 相同年份显示月-日
            if (Nyear == nowDate.getFullYear()) {
                return "" + Nmonth + "-" + Ndate;
            }

            // > 其余的显示年月日
            result = Nyear + "-" + Nmonth + "-" + Ndate;
            return result;
        }
        // > 大于一天的时候
        else if (dayC >= 1) {
            var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
            var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
            var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
            var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
            // var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
            result = Nmonth + "-" + Ndate + " " + Nhour + ":" + Nminute;
        } else if (hourC >= 1 && hourC < 24) {
            result = "" + parseInt(hourC + "") + "小时前";
        } else if (minC >= 1 && minC < 60) {
            result = "" + parseInt(minC + "") + "分钟前";
        } else if (diffValue >= 0 && diffValue <= minute) {
            result = "刚刚";
        } else {
            return timeStr;
        }
        return result;
    }

    /**
     * @description 获取URL对象
     * @param url url地址
     */
    export const getURLIns = function (url: string): any {
        let urlIns = new URL(url);
        return urlIns;
    }

    /**
     * @description 获取url地址参数对象
     * @param url 
     */
    export const getUrlParams = function (url: string): any {
        let urlIns = getURLIns(url);
        let obj: any = {};
        for (const [key, value] of urlIns.searchParams.entries()) {
            obj[key] = value;
        }
        return obj;
    }

    /**
     * @description 第三方调试
     */
    export const initErudaDebug = function () {
        try {
            if (typeof eruda === 'object') {
                eruda && eruda.init();
            }
        } catch (error) { }
    }

    /**
    * @description uni获取平台类型
    * @returns 
    */
    export const getPlatform = function () {
        let platform = null;
        // #ifdef VUE3
        platform = "VUE3"; // HBuilderX 3.2.0+
        // #endif
        // #ifdef APP-PLUS
        platform = "APP-PLUS"; // App
        // #endif
        // #ifdef APP-PLUS-NVUE
        platform = "APP-PLUS-NVUE"; // App nvue 页面
        // #endif
        // #ifdef APP-NVUE
        platform = "APP-NVUE"; // App nvue 页面
        // #endif
        // #ifdef APP-ANDROID
        platform = "APP-ANDROID"; // App Android 平台 仅限 uts文件
        // #endif
        // #ifdef APP-IOS
        platform = "APP-IOS"; // App iOS 平台 仅限 uts文件
        // #endif
        // #ifdef H5
        platform = "H5"; // H5
        // #endif
        // #ifdef MP-WEIXIN
        platform = "MP-WEIXIN"; // 微信小程序
        // #endif
        // #ifdef MP-ALIPAY
        platform = "MP-ALIPAY"; // 支付宝小程序
        // #endif
        // #ifdef MP-BAIDU
        platform = "MP-BAIDU"; // 百度小程序
        // #endif
        // #ifdef MP-TOUTIAO
        platform = "MP-TOUTIAO"; // 抖音小程序
        // #endif
        // #ifdef MP-LARK
        platform = "MP-LARK"; // 飞书小程序
        // #endif
        // #ifdef MP-QQ
        platform = "MP-QQ"; // QQ小程序
        // #endif
        // #ifdef MP-KUAISHOU
        platform = "MP-KUAISHOU"; // 快手小程序
        // #endif
        // #ifdef MP-JD
        platform = "MP-JD"; // 京东小程序
        // #endif
        // #ifdef MP-360
        platform = "MP-360"; // 360小程序
        // #endif
        // #ifdef QUICKAPP-WEBVIEW
        platform = "QUICKAPP-WEBVIEW"; // 快应用通用(包含联盟、华为)
        // #endif
        // #ifdef QUICKAPP-WEBVIEW-UNION
        platform = "QUICKAPP-WEBVIEW-UNION"; // 快应用联盟
        // #endif
        // #ifdef QUICKAPP-WEBVIEW-HUAWEI
        platform = "QUICKAPP-WEBVIEW-HUAWEI"; // 快应用华为
        // #endif
        return platform;
    }

}

export default Utils;