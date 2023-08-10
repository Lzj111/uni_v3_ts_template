/**
 * @description 全局声明类型定义
 * @author lzj
 * @date 2023/06/05
 */

//#region 全局通用类型声明
/**
 * @description 对象字段扩展声明<String:any
 * @param key 对象键
 * @param any 属性值
 */
interface OBJECT_INDEX_DECLARE {
    [key: string]: any,
};
// > 页面参数声明
interface PageParams {
    // > 页面路径
    path: string,
    // > 页面参数
    query: OBJECT_INDEX_DECLARE,
    // > ...
    referrerInfo?: any,
    // > ... 
    scene?: any,
}
// > 登录参数
interface SignInParams {
    // 页面参数
    query: PageParams.query
}
// > WebConfig类型声明
interface Authorization {
    appId: string,
    appSecret: string,
}
interface WebConfig {
    webApi: string,
    logLevel: string,
    authorization: Authorization
}

//#endregion

//#region Index页面类型声明
// > 定义复合类型的轮播配置数据类型
interface SwiperConfig {
    indicatorDots: boolean,  // >> 指示点
    autoplay: boolean,  // >> 自动播放
    interval: number,  // >> 自动播放间隔时长(ms)
    duration: number,  // >> 幻灯片切换时长(ms)
    circular: boolean, // >> 循环滚动
    indicatorColor: string,  // 指示点颜色
    indicatorActiveColor: string,  // 当前选中的指示点颜色
}
// > 模块链接类型枚举
enum ModuleLinkEnum {
    DEFAULT = 0, // > 默认(内置系统,跳转到二级页面)
    OUTER = 1, // > 模块页面类型(是否第三方系统,1=是，0=否)
    INNER = 2,  // > 小程序内其他页面(pages里包含的页面)
}
// 链接打开类型
enum ThirdLinkType {
    NEWPAGE = 0,  // > 跳转
    IFRAME = 1,  // > iframe嵌入
}
// > 待办事项数据
interface ToDoItem {
    id: string, // 待办模块id
    code: string,  // 待办模块编码
    name: string, // 名称
    thirdProject?: ModuleLinkEnum = 0,  // 模块页面类型(是否第三方系统,1=是，0=否)
    linkHref?: string,  // 链接地址
    todoCount: any, // 数量
    icon?: string, // icon类名(字体图标)
    className?: string,  // 模块外侧样式名(扩展样式用)
    thirdLinkType?: ThirdLinkType = 0,  // 链接打开类型
    extendData?: any,  // 完整的数据
}
// > 轮播配置
interface SwiperList {
    index: string | number,
    toDoItem: ToDoItem[],
}

// > 搜索事项数据集&待办一级||二级菜单
interface ToDoSet {
    id: string,
    name: string,
    list: ToDoItem[]
}

// > 首页>消息通知>任务项类型
interface TaskItem {
    id: string, // id
    action: string,  // 动作类型
    source: string,  // 事件源,项目
    sourceType: string,  // 源类型
    title: string,  // 标题
    content: string,  // 内容
    state: boolean,  // 是否已读
    staffId: string,  // 接受通知用户id
    taskId: string,  // 任务id
    instId: string,  // 流程id
    bizKey: string,  // 业务id
    createTime: string,  // 创建时间
    createBy: string,  // 创建人
    lastModifyTime: string,  // 修改时间
    lastModifyBy: string,  // 修改时间
    status: number,  // 修改人
    delFlag: number,  // 是否删除
}
// > 首页>消息通知>任务项配置类型
interface TaskConfig {
    taskTitle: string, // > 任务块名称
    content: TaskItem[], // > 任务列表
    totalElements: Number = 0,  // 总数量
}
//#endregion

//#region 消息通知页面
// > 通知卡片对象类型
interface NoticeItem extends TaskItem {
    billNo: string, // 单据号
    createByName: string, // 创建人
}
//#endregion

// > 办理类型
enum JobTaskTypeEnum {
    // > 其他方式
    DEFAULT = -1,
    // >> 待办事项
    TO_DO_LIST = 0,
    // >> 我的已办
    MY_DONE = 1,
    // >> 我的发起
    MY_INITIATION = 2,
    // >> 消息通知
    MSG_NOTIFY = 3,
}