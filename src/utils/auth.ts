/**
 * @author baoyuhao
 * @date 2022/12/17 15:31:04
 * @description
 * @version 0.1.0
 */
import {getPermissionStore, getUserStore, usePermissionStore, useSettingStore, useUserStore} from "@/store";
import {MessagePlugin} from "tdesign-vue-next";
import {reactive, ref} from "vue";
import router from "@/router";
import STYLE_CONFIG from "@/config/style";
import {chargeTheme} from "@/utils/date";
import {isNotEmpty} from "@/utils/validate";

const userStore = useUserStore();
const permissionStore = usePermissionStore();
const userInfo = reactive({
    id: "",
    bankName: "",
    bankNum: "",
    phoneNum: "",
    userName: "",
    zfbNum: "",
    role: ""
});

const settingStore = useSettingStore();

const initStyleConfig = () => {
    const styleConfig = STYLE_CONFIG;
    for (const key in styleConfig) {
        if (Object.prototype.hasOwnProperty.call(styleConfig, key)) {
            styleConfig[key] = settingStore[key];
        }
    }

    return styleConfig;
};

const formData = ref({...initStyleConfig()});

export const checkAuth = () => {
    const userStore = getUserStore();
    const permissionStore = getPermissionStore();
    const {role} = userStore;
    console.log("已登录权限：" + role);
    if (isNotEmpty(role)) {
        permissionStore.initRoutes(role);
        return true;
    } else {
        return false;
    }
};

/**
 * 用户个人信息进入缓存
 * @param info
 */
export const userInfoToCache = async (info: {
    bankName: string;
    bankNum: string;
    id: string;
    phoneNum: string;
    userName: string;
    zfbNum: string;
    role: string;
}) => {
    console.log(info)
    userInfo.bankName = info.bankName;
    userInfo.bankNum = info.bankNum;
    userInfo.id = info.id;
    userInfo.phoneNum = info.phoneNum;
    userInfo.userName = info.userName;
    userInfo.zfbNum = info.zfbNum;
    userInfo.role = info.role;
    userStore.getUserInfo(userInfo);
    await permissionStore.initRoutes(info.role);
    /* 处理主题 */
    formData.value.mode = chargeTheme(); // 根据当前系统时间切换主题模式（light、dark）

    await MessagePlugin.success("欢迎您，" + info.userName);

    /* 分权限处理 默认跳转页 */
    formData.value.brandTheme = "default";
    settingStore.updateConfig(formData.value);
    await router.push("/dashboard/mainInfo");
};

