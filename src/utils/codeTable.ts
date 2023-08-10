/**
 * @description 代码表 全局常量定义
 * @author lzj
 * @date 2023/07/13
 */

// > 基础代码表 系统使用的
export const BaseCode = {
    // > 配置文件属性
    config: "Config",
    // > token信息
    accessToken: "accessToken",
    // > i9用户信息
    i9UserInfo: "i9UserInfo",
    // > 入口文件参数
    appOptions: "appOptions",
}

// > 业务编码
export const BizCode = {
    // > 合作事业部管理平台
    "partner": "PARTNER",
    // > 移动商务
    "mobileCommerce": "jzterp-server",
    // > 金蝶集团
    "easJt": "EAS_JT",
    // > 金蝶器械
    "easQx": "EAS_QX",
    // >九彩云
    "jcyCode": "jztncc-server"
}

// > 页面消息码
export const PageEmitCode = {
    // > pop弹窗消息码
    "popupBtnClick": "popupBtnClick",
    // > 备忘录审批成功状态
    "BwlProcess": "BwlProcess",
}

// > uni平台编码
export const UniPlatformCode = {
    "VUE3": "VUE3", // HBuilderX 3.2.0+ 详情
    "APP-PLUS": "APP-PLUS", // App
    "APP-PLUS-NVUE": "APP-PLUS-NVUE", // App nvue 页面
    "APP-NVUE": "APP-NVUE", // App nvue 页面
    "APP-ANDROID": "APP-ANDROID", // App Android 平台 仅限 uts文件
    "APP-IOS": "APP-IOS", // App iOS 平台 仅限 uts文件
    "H5": "H5", // H5
    "MP-WEIXIN": "MP-WEIXIN", // 微信小程序
    "MP-ALIPAY": "MP-ALIPAY", // 支付宝小程序
    "MP-BAIDU": "MP-BAIDU", // 百度小程序
    "MP-TOUTIAO": "MP-TOUTIAO", // 抖音小程序
    "MP-LARK": "MP-LARK", // 飞书小程序
    "MP-QQ": "MP-QQ", // QQ小程序
    "MP-KUAISHOU": "MP-KUAISHOU", // 快手小程序
    "MP-JD": "MP-JD", // 京东小程序
    "MP-360": "MP-360", // 360小程序
    "MP": "MP", // 微信小程序/支付宝小程序/百度小程序/抖音小程序/飞书小程序/QQ小程序/360小程序
    "QUICKAPP-WEBVIEW": "QUICKAPP-WEBVIEW", // 快应用通用(包含联盟、华为)
    "QUICKAPP-WEBVIEW-UNION": "QUICKAPP-WEBVIEW-UNION", // 快应用联盟
    "QUICKAPP-WEBVIEW-HUAWEI": "QUICKAPP-WEBVIEW-HUAWEI", // 快应用华为
}

// > 静态文件映射关系
export const StaticFileMapping: OBJECT_INDEX_DECLARE = {
    document: "icon_document.png",
    finance: "icon_finance.png",
    histogram: "icon_histogram.png",
    left: "icon_left.png",
    monitor: "icon_monitor.png",
    org: "icon_org.png",
    person: "icon_person.png",
    add: "icon_add.png",
    remove: "icon_remove.png",
    empty: "empty.png",
    locked: "locked.png",
    server_error: "server_error.png",
    no_result: "no_result.png",
    unsigned: "wait.png",
    signed: "success.png",
    rejected: "rejected.png"
}

// > 字体图标映射表
export const IconClassMapping: OBJECT_INDEX_DECLARE = {
    default: "icon-Currency1",
    "合作事业部管理平台": "icon-a-ManagementPlatform",
    "FDG合作事业部协议会签审批": "icon-a-Countersignapproval",
    "FDG房产抵押登记单": "icon-a-Propertymortgage",
    "移动OA": "icon-OA",
    "移动商务": "icon-OA",
    "金蝶集团": "icon-kingde",
    "金蝶器械": "icon-kingde",
    "合伙人": "icon-OA",
}