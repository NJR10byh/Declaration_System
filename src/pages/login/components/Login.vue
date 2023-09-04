<template>
  <t-form
      ref="form"
      :class="['item-container', `login-${type}`]"
      :data="loginData"
      :rules="FORM_RULES"
      label-width="0"
      @submit="onSubmit"
  >
    <template v-if="type == 'password'">
      <t-form-item name="phoneNum">
        <t-input
            v-model="loginData.phoneNum"
            size="large"
            placeholder="请输入账号：cxy"
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
            :type="showPsw ? 'text' : 'password'"
            clearable
            placeholder="请输入登录密码：abc123123"
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
    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit" :loading="loginBtnLoading">登 录</t-button>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {checkAuth, userInfoToCache} from "@/utils/auth";
import {MessagePlugin} from "tdesign-vue-next";
import {request} from "@/utils/request";
import {BASE_URL} from "./constants";

const FORM_RULES = {
  phoneNum: [{required: true, message: "账号必填", type: "error"}],
  password: [{required: true, message: "密码必填", type: "error"}]
};

const type = ref("password");

const loginData = reactive({
  phoneNum: "",
  password: ""
});
const showPsw = ref(false);

const loginBtnLoading = ref(false);
const router = useRouter();

const onSubmit = async ({validateResult}) => {
  if (validateResult === true) {
    loginBtnLoading.value = true;
    if (!checkAuth()) {
      localStorage.removeItem("token");
      await request.post({
        url: BASE_URL.login,
        data: loginData
      }).then(async res => {
        console.log(res);
        localStorage.setItem("token", res.token);
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
