/**
 * @description bizUtil.ts 业务通用工具方法 *** 涉及到业务上的通用方法
 * @author lzj
 * @date 2023/06/05
 */

import Utils from "./util";
import { test, } from "./api";
import { BaseCode, BizCode, StaticFileMapping, IconClassMapping, } from "./codeTable";

namespace BizUtil {
    //#region 业务方法

    /**
     * @description 
     * @param code 根据编码获取文件名称
     * @returns 文件完整名
     */
    export const getFileNameByCode = function (code: string): string {
        let fileName = StaticFileMapping[code];
        // > 找不到映射直接返回
        if (Utils.isNullOrEmpty(fileName)) {
            return fileName;
        }
        return fileName;
    }

    /**
     * @description 根据业务编码获取文件绝对路径
     * @param code 业务编码属性
     * @returns 文件路径
     */
    export const getIconPathByCode = function (code: string): string {
        let fileName = getFileNameByCode(code);
        return "/static/images/" + fileName;
    }

    /**
     * @description 获取字体图标名称
     * @param code 业务编码属性
     * @returns 图标样式名
     */
    export const getIconClassByCode = function (code: string): string {
        let iconClass = IconClassMapping[code];
        // > 找不到映射直接返回
        if (Utils.isNullOrEmpty(iconClass)) {
            return IconClassMapping["default"];
        }
        return iconClass;
    }

    // > 获取ziycode 配置文件>login>accesstoken
    export const getZiyCode = function () {
        let i9UserInfo = uni.getStorageSync(BaseCode.i9UserInfo);
        let webConfig = getWebConfig();

        // >> 获取zip 优先级配置文件>接口请求
        let ziy = i9UserInfo && i9UserInfo.ziy || "";
        if (webConfig && webConfig.authorization.ziy) {
            ziy = webConfig.authorization.ziy;
        }
        return ziy;
    }

    // > 获取配置文件
    export const getWebConfig = function () {
        let webConfig = uni.getStorageSync(BaseCode.config);
        return webConfig || {};
    }

    /**
     * @description 获取模块消息省略号
     * @param count 数量
     */
    export const getCountText = function (count: number, type: number = 0): string {
        if (type == 0) {
            return (count + "").length > 2 ? "..." : count + "";
        } else {
            return (count + "").length > 2 ? "dot_center" : count + "";
        }
    }

    /**
     * @description 转换待办集合二级模块页数据
     * @param {Array} sourceData 原数据
     * @param {Boolean} firstTitle 是否显示第一级标题(首页搜索用)
     * @returns {ToDoSet[]}
     */
    export const getToDoSet = function (sourceData: any, firstTitle: boolean = false): ToDoSet[] {
        let resList = sourceData.content || [],
            classMap = new Map();  // > 分类map

        // > 处理二级大类及其子集
        resList.forEach((item: any, index: number) => {
            // >> 是否存在属性"二级分类"
            let categoryKey = firstTitle ? item.source : item.category;
            // >> 二级分类下的子模块key
            let sourceType = item.sourceType;
            let categoryMapObj = classMap.get(categoryKey);
            if (categoryMapObj) {
                // >> 子分类是否存在相同的数据
                let childClassMap = categoryMapObj.get(sourceType);
                // >> 存在更新||不存在新增
                if (childClassMap) {
                    childClassMap.todoCount++;
                } else {
                    childClassMap = new Map();
                    let childItem = {
                        id: item.id, // 待办模块id
                        code: item.sourceCode,  // 待办模块编码
                        name: item.sourceType, // 名称
                        todoCount: 1, // 数量
                        linkHref: item.url,  // 链接地址
                        icon: BizUtil.getIconClassByCode(item.sourceType), // icon类名(字体图标)
                        extendData: item,  // 扩展配置
                    }
                    categoryMapObj.set(sourceType, childItem);
                }
            } else {
                // >> 主分类没有时
                let childClassMap = new Map();
                let childItem = {
                    id: item.id, // 待办模块id
                    code: item.sourceCode,  // 待办模块编码
                    name: item.sourceType, // 名称
                    todoCount: 1, // 数量
                    linkHref: item.url,  // 链接地址
                    icon: BizUtil.getIconClassByCode(item.sourceType), // icon类名(字体图标)
                    extendData: item,  // 扩展配置
                }
                childClassMap.set(sourceType, childItem);
                classMap.set(categoryKey, childClassMap);
            }
        });

        // >>>>>> 生成列表绑定项目 <<<<<<
        // > 循环一级大类
        let toduSetTemp: ToDoSet[] = [];
        classMap.forEach((childMap, key) => {
            if (!childMap) return;

            let toduSetItem = { id: key, name: key, list: [], };
            childMap.forEach((value: never, key: any) => {
                toduSetItem.list.push(value);
            });
            toduSetTemp.push(toduSetItem);
        });
        return toduSetTemp;
    }

    //#endregion

    //#region 登录逻辑

    /**
     * @description 挂载平台类型
     */
    export enum PlatformType {
        // 云之家
        YUNZHIJIA = 0,
        // 钉钉
        DINGDING = 1,
    }
    export const GetPlatformType = function (pageParams: PageParams["query"]): PlatformType {
        // > 获取地址栏的key
        let search: any = pageParams || {};
        search = JSON.stringify(search).toLowerCase();
        let platformType = PlatformType.YUNZHIJIA;

        // > 云之家(I9)的标识符(ticket)
        if (search.indexOf("ticket") != -1) {
            platformType = PlatformType.YUNZHIJIA;
        }
        // > 钉钉的标识符(corpId)
        else if (search.indexOf("corpid") != -1) {
            platformType = PlatformType.DINGDING;
        }

        return platformType;
    }

    /**
     * @description 登录类
     * @date 2023/06/08
     */
    class SignInClass {
        constructor(params: any) {
            this.initConfig();
        };
        // > 初始化配置信息
        private initConfig() {
            // >> 获取缓存中的配置解析成对象
            let webConfig: WebConfig = uni.getStorageSync("Config");
            this.appId = webConfig.authorization.appId;
            this.appSecret = webConfig.authorization.appSecret;
        }

        // > 登录编码 code ->云之家[ticket] 钉钉[corpId]
        public code: string | null = null;
        // > 应用Id
        public appId: string | null = null;
        // > 应用密钥
        public appSecret: string | null = null;

        // > 登录方法
        public SignIn(): void {
            // 子类继承登录 todo
        }
        // > 续期方法
        public RefreshToken(): void {
            // 子类继承续期 todo
        }
        // > 登出方法
        public SignOut(): void {
            // 子类继承登出 todo
        }
    }
    /**
     * @description 云之家登录逻辑
     */
    class YunZhiJiaSignInClass extends SignInClass {
        constructor(params: any) {
            super(params);
            this.code = params.ticket;
        };

        public SignIn(): Promise<any> {
            return new Promise(function (resolve, reject) {
                resolve(null);
            });
        }
    }
    /**
     * @description 登陆工厂方法
     */
    export class SignInBeanFactory {
        // > 业务通用方法实例
        public static SignInInstance: any;
        // > 页面参数
        public static PageQuery: PageParams["query"];
        /**
         * @description 获取业务类实例
         * @returns SignInClass实例
         */
        public static getInstance(pageParams: PageParams["query"]) {
            // > 如果已经存在
            if (this.SignInInstance != null) {
                return this.SignInInstance;
            }
            // > 获取平台
            let platformType = GetPlatformType(pageParams);

            // > 返回业务实例方法
            switch (platformType) {
                case PlatformType.YUNZHIJIA:
                    this.SignInInstance = new YunZhiJiaSignInClass(pageParams);
                    break;
                case PlatformType.DINGDING:
                    break;
                default:
                    break;
            }

            return this.SignInInstance;
        }
    }

    //#endregion

    //#region 工作任务跳转类

    // > 跳转基类
    abstract class JobTaskJumpClass {
        constructor() { }
        public title: string = "";

        // > 将url格式化
        urlFormat(url: string, paramsObj: Object) {
            for (const [key, value] of Object.entries(paramsObj)) {
                url = url.replace(new RegExp("\\{" + key + "\\}", "g"), Utils.isNullOrEmpty(value) ? "" : value);
            }
            return url;
        }

        abstract getUrl(jobType: JobTaskTypeEnum, extendsParams: any): string | null;

        // 直接执行方法(有业务特殊需求的重写该方法)
        execute(jobType: JobTaskTypeEnum, extendsParams: any): void {
            let url = this.getUrl(jobType, extendsParams) + "";
            Utils.openNewUrl(url, 1, this.title);
        }
    }
    // > 移动商务跳转类
    class JobTaskMCJumpClass extends JobTaskJumpClass {
        constructor() {
            super();
        }

        /**
         * @description 获取跳转的url
         * @param jobType 任务类型
         * @param extendsParams 扩展参数
         * @returns 
         */
        getUrl(jobType: JobTaskTypeEnum, extendsParams: any): string | null {
            let config = getWebConfig();
            let url = config.jzterpApi + "/#/pages/login/login_db?",
                strJobType = jobType + "";

            let sourceType = extendsParams.sourceType || extendsParams.name || (extendsParams.extendData && extendsParams.extendData.sourceType);
            let dataConfig = extendsParams.extendData || extendsParams || {};
            let propertyParams = {
                // (0：待办事项。1：我的已办。 2：我的发起。 3： 消息通知)
                form: strJobType,
                // 流程id
                startid: dataConfig.startId,
                startname: sourceType,
                hrstaffId: dataConfig.staffId,
                // 是否是沃土
                isWotu: dataConfig.isWotu,
                // 是否是集中还是分公司
                isCenter: dataConfig.isCenter,
                // 工作流id
                workflowid: dataConfig.instId,
                // 
                bizStaffId: dataConfig.bizStaffId,
            }
            url += "form={form}&startid={startid}&startname={startname}&hrstaffId={hrstaffId}&isWotu={isWotu}&isCenter={isCenter}&staffId={bizStaffId}";
            // > 消息的情况需要拼接workflowid
            if (strJobType == "3") {
                url += "&workflowid={workflowid}";
            }
            url = this.urlFormat(url, propertyParams);
            console.log("JobTaskMCJumpClass.getUrl=>", { propertyParams, url });
            return url;
        }
    }
    // > 合作事业部管理平台跳转类
    class JobTaskPartnerJumpClass extends JobTaskJumpClass {
        public codeMap: any = new Map();
        public codeMapName: any = new Map();

        constructor() {
            super();
            // > 初始化编码对象
            this.initCodeMap();
        }

        private initCodeMap() {
            this.codeMap.set('ExitLiquidation_Audit', 'Mobile_ExitLiquidation_Audit'); // 退出清算协议报告申请单
            this.codeMap.set('PartnerExit_Audit', 'Mobile_Exitapplicationformreview'); // 退出申请单
            this.codeMap.set('PartnerReleaseGuaranteeWorkFlow', 'Mobile_PartnerReleaseGuaranteeWorkFlow'); // 解除担保申请单
            this.codeMap.set('AgreementRenewal_Audit', 'Mobile_AgreementRenewal_Audit'); // 合作事业部协议续签申请单
            this.codeMap.set('BizInitialApply', 'Mobile_BizInitialApply_Audit'); // 初始营运资本金偿还申请单
            this.codeMap.set('CounterSignature_Audit', 'Mobile_AgreementCounterSignature_Audit'); // 协议会签申请单
            this.codeMap.set('PartnerClauseCoreChangeWorkFlow', 'Mobile_ClauseCoreChange_Audit'); // 核心条款变更申请单
            this.codeMap.set('PropMortRegForm', 'Mobile_HouseMortgageBill_Audit'); // 房产抵押登记单
            this.codeMap.set('PartnerLossrecoveryWorkFlow', 'Mobile_LossRecoveryBill_Audit'); // 合作事业部亏损弥补申请单审核
            this.codeMap.set('InsideLoanBill', 'Mobile_InternalBorrowingShenh'); // 合作事业部（内部）借款申请单审核
            this.codeMap.set('RiskWhiteList', 'Mobile_Whitelistapplicationformapproval'); // 风险合作事业部白名单申请单审核
            this.codeMap.set('RiskRelease', 'Mobile_SpecialReleaseapplicationform'); // 风险合作事业部放行申请单审核
            this.codeMap.set('RePayment', 'Mobile_Approvalrepaymentregistration'); // 还款登记单审核
            this.codeMap.set('Loan', 'Mobile_Approvalloanregistrationform'); // 借款登记单审核
            this.codeMap.set('LoanLossExtApply', 'Mobile_BorrowinglossesBill_audit'); // 借款补亏展期申请单审核
            this.codeMap.set('LoanLossRepay', 'Mobile_LoanLossRepay_Audit'); // 借款补亏偿还登记审核
            // ==========================================================================
            this.codeMapName.set('ExitLiquidation_Audit', '退出清算协议报告申请单');
            this.codeMapName.set('PartnerExit_Audit', '退出申请单');
            this.codeMapName.set('PartnerReleaseGuaranteeWorkFlow', '解除担保申请单');
            this.codeMapName.set('AgreementRenewal_Audit', '合作事业部协议续签申请单');
            this.codeMapName.set('BizInitialApply', '初始营运资本金偿还申请单');
            this.codeMapName.set('CounterSignature_Audit', '协议会签申请单');
            this.codeMapName.set('PartnerClauseCoreChangeWorkFlow', '核心条款变更申请单');
            this.codeMapName.set('PropMortRegForm', '房产抵押登记单');
            this.codeMapName.set('PartnerLossrecoveryWorkFlow', '合作事业部亏损弥补申请单审核');
            this.codeMapName.set('InsideLoanBill', '合作事业部（内部）借款申请单审核');
            this.codeMapName.set('RiskWhiteList', '风险合作事业部白名单申请单审核');
            this.codeMapName.set('RiskRelease', '风险合作事业部放行申请单审核');
            this.codeMapName.set('RePayment', '还款登记单审核');
            this.codeMapName.set('Loan', '借款登记单审核');
            this.codeMapName.set('LoanLossExtApply', '借款补亏展期申请单审核');
            this.codeMapName.set('LoanLossRepay', '借款补亏偿还登记审核');
        }

        /**
         * @description 获取跳转的url
         * @param jobType 任务类型
         * @param extendsParams 扩展参数
         * @returns 
         */
        getUrl(jobType: JobTaskTypeEnum, extendsParams: any): string | null {
            let urlParamsObj = Utils.getUrlParams(extendsParams.url || extendsParams.linkHref) || {};
            let url = "http://zeus.jztweb.com/zsCloud/views/login/index.html?",
                strJobType = jobType + "";

            let propertyParams = {
                "sysId": urlParamsObj.sysId,
                "title": this.codeMapName.get(urlParamsObj.key) || extendsParams.title || extendsParams.name,
                "key": urlParamsObj.key,
                "mobAction": this.codeMap.get(urlParamsObj.key),
                "taskId": extendsParams.taskId,
                "pk": extendsParams.bizKey,
                "instId": extendsParams.instId,
                "ziyCode": getZiyCode(),
            };
            let pageParams = uni.getStorageSync(BaseCode.appOptions);
            Object.assign(propertyParams, pageParams);
            this.title = propertyParams.title;

            // > 获取不同类型的地址(0：待办事项。1：我的已办。 2：我的发起。 3： 消息通知)
            switch (strJobType) {
                // > 待办事项
                case "0":
                    url = url + "mode=i9&sysId={sysId}&action=parter_workflowWorkbench&mobAction=new_mobile_toDoList&title={title}&key={key}" +
                        "&taskId={taskId}&instId={instId}&ziyCode={ziyCode}&client_id={client_id}&expire_time={expire_time}&msgShowStyle={msgShowStyle}&embed=true";
                    break;
                // > 我的已办
                case "1":
                    url = url + "mode=i9&sysId={sysId}&action=parter_workflowWorkbench&mobAction=new_mobile_completeList&title={title}&key={key}" +
                        "&taskId={taskId}&instId={instId}&ziyCode={ziyCode}&client_id={client_id}&expire_time={expire_time}&msgShowStyle={msgShowStyle}&embed=true";
                    break;
                // > 我的发起
                case "2":
                    url = url + "mode=i9&sysId={sysId}&action=parter_workflowWorkbench&mobAction=new_mobile_applyList&title={title}&key={key}" +
                        "&taskId={taskId}&instId={instId}&ziyCode={ziyCode}&client_id={client_id}&expire_time={expire_time}&msgShowStyle={msgShowStyle}&embed=true";
                    break;
                // > 消息通知
                case "3":
                    url = url + "mode=i9&sysId={sysId}&action=parter_workflowWorkbench&mobAction={mobAction}&title={title}" +
                        "&key={key}&taskId={taskId}&pk={pk}&instId={instId}&ziyCode={ziyCode}&client_id={client_id}&expire_time={expire_time}&msgShowStyle={msgShowStyle}&embed=true";
                    break;
                default:
                    break;
            }

            url = this.urlFormat(url, propertyParams);
            console.log("JobTaskPartnerJumpClass.getUrl=>", { propertyParams, url });
            return url;
        }
    }
    // > 九彩云跳转类
    class JobTaskJCYCJumpClass extends JobTaskJumpClass {
        constructor() {
            super();
        }

        /**
         * @description 获取跳转的url
         * @param jobType 任务类型
         * @param extendsParams 扩展参数
         * @returns 
         */
        getUrl(jobType: JobTaskTypeEnum, extendsParams: any): string | null {
            return ""
        }

        // 直接执行方法
        execute(jobType: JobTaskTypeEnum, extendsParams: any): void {
            // > 九彩云跳转到指定页面
            if (jobType == 1 || jobType == 2) {
                // uni.navigateTo({ url: "/pages/jcy_list/jcy_list?startId=" + extendsParams.startId });
                uni.navigateTo({ url: "/pages/jcy_list/jcy_list?startId=BWL" + "&jobType=" + jobType });
            } else if (jobType == 3) {
                uni.navigateTo({ url: "/pages/jcy_process/jcy_process?pk=" + JSON.parse(extendsParams.content).pk });
            }

        }
    }

    // > 获取任务跳转实例
    let _JobTaskJumpMap: OBJECT_INDEX_DECLARE = {};
    export const getJobTaskJumpClassInstance = function (jobModuleType: string) {
        let instace = _JobTaskJumpMap[jobModuleType];
        if (instace != null) {
            return instace;
        }
        // >> 获取实例
        switch (jobModuleType) {
            // >> 合作事业部管理平台
            case BizCode.partner:
                instace = new JobTaskPartnerJumpClass();
                _JobTaskJumpMap[jobModuleType] = instace;
                break;
            // >> 移动商务
            case BizCode.mobileCommerce:
                instace = new JobTaskMCJumpClass();
                _JobTaskJumpMap[jobModuleType] = instace;
                break;
            // >> 九彩云
            case BizCode.jcyCode:
                instace = new JobTaskJCYCJumpClass();
                _JobTaskJumpMap[jobModuleType] = instace;
                break;
            default:
                break;
        }
        return instace;
    }
    /**
     * @description 办理类型跳转
     * @param {String} jobModuleType 任务模块类型
     * @param {JobTaskTypeEnum} jobType 任务办理类型
     * @param {any} extendsParams 扩展配置
     * @returns {void}
     */
    export const jobTaskJump = function (jobModuleType: string, jobType: JobTaskTypeEnum, extendsParams: any): void {
        let instace = getJobTaskJumpClassInstance(jobModuleType);
        console.log("jobTaskJump.instance=>", { instace: instace, jobModuleType, jobType, extendsParams });
        if (!instace) {
            uni.showToast({ title: `模块编码${jobModuleType}不存在`, icon: "none" });
            return;
        }
        instace.execute(jobType, extendsParams);
    }

    //#endregion
}
export default BizUtil;