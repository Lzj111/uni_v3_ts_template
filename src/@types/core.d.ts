declare namespace Http {
    type Response<T> = Promise<{
        data?: T
    }>

    type ResquestExtendConfig = {
        // > Content-Type（内容类型）
        contentType?: string,
        // > 是否需要token
        hasAuthorization?: boolean,
        // > 超时设置
        timeout?: number,
        // > 域名
        baseURL?: string
        // > 是否出加载提示框(默认false)
        isLoading?: boolean = false,
        // > 加载提示
        loadingMsg?: string,
        // & 是否返回原始响应数据 false默认
        originResponse?: boolean = false,
    }

    type RequestConfig = {
        // > 请求地址
        url: string,
        // > 请求类型
        method: any,
        // > 超时时间
        timeout: timeout = 2000,
        // > 请求头
        header: {
            'content-type': string,
            "Authorization"?: string
        },
        // > 请求数据
        data: any | null,
        // > 回调函数
        success: Function,
        fail: Function,
        complete: Function
    }
}

declare namespace GetTest {
    interface params {
        a: number
    }
    interface data {
        name: string
        age: number
    }
}

declare namespace PostTest {
    interface params {
        a: number
    }
    interface data {
        val: string
    }
}