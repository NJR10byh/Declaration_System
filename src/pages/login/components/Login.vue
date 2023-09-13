<template>
  <t-form
      ref="form"
      :class="['item-container', 'login-password']"
      :data="loginData"
      :rules="FORM_RULES"
      label-width="0"
      @submit="onSubmit"
  >
    <t-form-item name="phoneNum">
      <t-input
          v-model="loginData.phoneNum"
          size="large"
          placeholder="请输入账号"
      >
        <template #prefix-icon>
          <t-icon name="user"/>
        </template>
      </t-input>
    </t-form-item>
    <t-form-item name="password">
      <t-input
          v-model="loginData.password"
          size="large"
          type="password"
          clearable
          placeholder="请输入登录密码"
      >
        <template #prefix-icon>
          <t-icon name="lock-on"/>
        </template>
        <template #suffix-icon>
          <t-icon
              :name="showPsw ? 'browse' : 'browse-off'"
              @click="showPsw = !showPsw"
          />
        </template>
      </t-input>
    </t-form-item>
    <t-form-item style="width: 100%;">
      <t-checkbox style="width: 20%;" v-model="rememberMe">记住我</t-checkbox>
      <t-button style="width: 80%;" block size="large" type="submit" :loading="loginBtnLoading">登 录</t-button>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {Base64} from 'js-base64';
import {checkAuth, userInfoToCache} from "@/utils/auth";
import {request} from "@/utils/request";
import {MessagePlugin} from "tdesign-vue-next";
import {BASE_URL} from "./constants";

const FORM_RULES = {
  phoneNum: [{required: true, message: "账号必填", type: "error"}],
  password: [{required: true, message: "密码必填", type: "error"}]
};

const loginData = reactive({
  phoneNum: "",
  password: ""
});
const rememberMe = ref(false);
const showPsw = ref(false);

const loginBtnLoading = ref(false);
const router = useRouter();

onMounted(() => {
  const localForm = localStorage.getItem('LOCAL_KEY');
  if (localForm) {
    rememberMe.value = true;
    try {
      const {phoneNum, password} = JSON.parse(localForm)
      Object.assign(loginData, {
        phoneNum: Base64.decode(phoneNum),
        password: Base64.decode(password)
      })
    } catch (error) {
      console.error('本地数据解析失败~', error)
    }
  } else {
    rememberMe.value = false;
  }
})

const onSubmit = async ({validateResult}) => {
  if (validateResult === true) {
    loginBtnLoading.value = true;
    if (!checkAuth()) {
      localStorage.removeItem("token");
      await request.post({
        url: BASE_URL.login,
        data: loginData
      }).then(async res => {
        localStorage.setItem("token", res.token);
        if (rememberMe.value) {
          const localForm = {
            phoneNum: Base64.encode(loginData.phoneNum),
            password: Base64.encode(loginData.password)
          }
          localStorage.setItem("LOCAL_KEY", JSON.stringify(localForm));
        } else {
          localStorage.removeItem("LOCAL_KEY");
        }
        await userInfoToCache(res.userInfo);
      }).catch(err => {
        MessagePlugin.error(err.message);
      }).finally(() => {
        loginBtnLoading.value = false;
      });
    } else {
      loginBtnLoading.value = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../index.less");
</style>
