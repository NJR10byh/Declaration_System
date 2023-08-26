<!--
  * @author baoyuhao
  * @date 2023/8/8 11:12:07
  * @description 用户列表
  * @version 0.8.0
-->
<template>
  <t-card class="user-list-card">
    <t-row justify="space-between" class="cardTop">
      <div>
        <t-input-adornment prepend="邀请码">
          <t-input align="right" readonly v-model="invitedCode" placeholder="邀请码" @click="copyInvitedCode">
            <template #suffixIcon>
              <t-popconfirm theme="default" @confirm="editInvitedCode">
                <template #content>
                  <p style="margin-bottom: 10px;">修改邀请码</p>
                  <t-input v-model="newInvitedCode" placeholder="请输入邀请码" clearable
                  />
                </template>
                <t-icon name="edit" :style="{ cursor: 'pointer' }"/>
              </t-popconfirm>
            </template>
          </t-input>
        </t-input-adornment>
      </div>
      <div style="display: flex;justify-content: start;">
        <t-input class="inputStyle" v-model="currRequestBody.phoneNum" placeholder="请输入手机号" clearable/>
        <t-input class="inputStyle" v-model="currRequestBody.userName" placeholder="请输入姓名" clearable/>
        <t-select
            class="inputStyle"
            v-model="currRequestBody.status"
            placeholder="-请选择用户状态-"
            :options="userStatusOptions"
            filterable
            clearable
        />
        <t-button class="inputStyle" @click="searchData" style="width: 100px;">
          <template #icon>
            <t-icon name="search"></t-icon>
          </template>
          查询
        </t-button>
      </div>
    </t-row>
  </t-card>
  <t-card class="user-list-card">
    <t-table
        class="tableStyle"
        :data="userListTable.tableData"
        :columns="USER_LIST_TABLE_COLUMNS"
        row-key="index"
        hover
        stripe
        table-layout="auto"
        :pagination="userListTable.pagination"
        :loading="userListTable.tableLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: 64, container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: 0,container: getContainer }"
        @page-change="userListTablePageChange"
        size="small"
        style="margin-top: 10px;"
    >
      <template #zfbPic="slotProps">
        <div class="tdesign-demo-image-viewer__base">
          <t-image-viewer v-model:visible="qrCodeVisible" :images="[slotProps.row.zfbPic]">
            <template #trigger>
              <div class="tdesign-demo-image-viewer__ui-image">
                <img alt="test" :src="slotProps.row.zfbPic" class="tdesign-demo-image-viewer__ui-image--img"/>
                <div class="tdesign-demo-image-viewer__ui-image--hover" @click="qrCodeOpen">
                  <span><t-icon size="1.2em" name="browse"/> 预览</span>
                </div>
              </div>
            </template>
          </t-image-viewer>
        </div>
      </template>
      <template #wxPic="slotProps">
        <div class="tdesign-demo-image-viewer__base">
          <t-image-viewer v-model:visible="qrCodeVisible" :images="[slotProps.row.wxPic]">
            <template #trigger>
              <div class="tdesign-demo-image-viewer__ui-image">
                <img alt="test" :src="slotProps.row.wxPic" class="tdesign-demo-image-viewer__ui-image--img"/>
                <div class="tdesign-demo-image-viewer__ui-image--hover" @click="qrCodeOpen">
                  <span><t-icon size="1.2em" name="browse"/> 预览</span>
                </div>
              </div>
            </template>
          </t-image-viewer>
        </div>
      </template>
      <template #status="slotProps">
        <t-tag :theme="goodsTagTheme(slotProps.row.status)" variant="light-outline" shape="round">
          {{ goodsStatus(slotProps.row.status) }}
        </t-tag>
      </template>
      <template #settings="slotProps">
        <div class="settingBtns">
          <t-button v-show="slotProps.row.status===0" theme="success" @click="enableUser(slotProps.row)">
            <template #icon>
              <t-icon name="check-circle"></t-icon>
            </template>
            启用
          </t-button>
          <t-button v-show="slotProps.row.status===1" theme="danger" @click="disableUser(slotProps.row)">
            <template #icon>
              <t-icon name="close-circle"></t-icon>
            </template>
            禁用
          </t-button>
          <t-button theme="primary" @click="editUser(slotProps.row)">
            <template #icon>
              <t-icon name="edit"></t-icon>
            </template>
            编辑
          </t-button>
          <t-button theme="warning" @click="resetPassword(slotProps.row)">
            <template #icon>
              <t-icon name="lock-on"></t-icon>
            </template>
            重置密码
          </t-button>
        </div>
      </template>
    </t-table>
  </t-card>

  <!--  编辑对话框  -->
  <t-dialog
      v-model:visible="editVisible"
      header="用户编辑"
      attach="body"
      :confirm-on-enter="true"
      :on-confirm="editConfirm"
      width="500px"
  >
    <template #body>
      <t-form>
        <t-form-item label="手机号码">
          <t-input v-model="editFormData.phoneNum" placeholder="请输入手机号" clearable/>
        </t-form-item>
        <t-form-item label="姓名">
          <t-input v-model="editFormData.userName" placeholder="请输入姓名" clearable/>
        </t-form-item>
        <t-form-item label="开户行">
          <t-input v-model="editFormData.bankName" placeholder="请输入开户行" clearable/>
        </t-form-item>
        <t-form-item label="银行卡号">
          <t-input v-model="editFormData.bankNum" placeholder="请输入银行卡号" clearable/>
        </t-form-item>
        <t-form-item label="用户状态">
          <t-select
              class="inputStyle"
              v-model="editFormData.status"
              placeholder="-请选择用户状态-"
              :options="userStatusOptions"
              filterable
              clearable
          />
        </t-form-item>
        <t-form-item label="支付宝收款码">
          <t-upload
              ref="aLiPayCode"
              v-model="editFormData.zfbPicFile"
              :abridge-name="[10,8]"
              :auto-upload="false"
              theme="image"
              accept="image/*"
              :before-upload="beforeUpload"
              :request-method="uploadALiPayCode"
              :size-limit="{ size: 10, unit: 'MB' }"
              @validate="validateFile"
              @fail="uploadFail"
          />
        </t-form-item>
        <t-form-item label="微信收款码">
          <t-upload
              ref="weChatCode"
              v-model="editFormData.wxPicFile"
              :abridge-name="[10,8]"
              :auto-upload="false"
              theme="image"
              accept="image/*"
              :before-upload="beforeUpload"
              :request-method="uploadWeChatCode"
              :size-limit="{ size: 10, unit: 'MB' }"
              @validate="validateFile"
              @fail="uploadFail"
          />
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>

  <!--  重置密码对话框  -->
  <t-dialog
      v-model:visible="resetPasswordVisible"
      header="重置密码"
      attach="body"
      :confirm-on-enter="true"
      :on-confirm="resetPasswordConfirm"
  >
    <template #body>
      <t-form>
        <t-form-item label="手机号码">
          <t-input v-model="resetPasswordFormData.phoneNum" placeholder="请输入手机号" readonly disabled/>
        </t-form-item>
        <t-form-item label="姓名">
          <t-input v-model="resetPasswordFormData.userName" placeholder="请输入姓名" readonly disabled/>
        </t-form-item>
        <t-form-item label="密码">
          <t-input type="password" v-model="resetPasswordFormData.password" placeholder="请输入密码" clearable/>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import {useSettingStore} from "@/store";
import {useRouter} from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";
import {prefix} from "@/config/global";
import {BASE_URL, USER_LIST_TABLE_COLUMNS} from "./constants";
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next";
import {request} from "@/utils/request";
import {timestampToDateTime} from "@/utils/date";
import {goodsStatus, goodsTagTheme} from "../../../utils/chargeStatus";
import {setObjToUrlParams} from "@/utils/request/utils";
import {copyInfo} from "@/utils/tools";
import {uploadFile, validateFile, validateFileType} from "@/utils/files";
import {isNotEmpty} from "@/utils/validate";

const store = useSettingStore();
const router = useRouter();

/**
 * data
 */
// 根据是否使用多Tab页判断offsetTop
const offsetTop = computed(() => {
  return store.isUseTabsRouter ? 48 : 0;
});
// 获取当前容器
const getContainer = () => {
  return document.querySelector(`.${prefix}-layout`);
};

// 邀请码
const invitedCode = ref("")
// 编辑邀请码
const newInvitedCode = ref("")

const aLiPayCode = ref();
const weChatCode = ref();

/**
 * 表格相关
 */
const userListTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [],
  // 表格分页
  pagination: {
    total: 0,
    current: 1,
    pageSize: 20
  },
});

// 用户状态选项
const userStatusOptions = reactive([
  {label: '启用', value: 1},
  {label: '禁用', value: 0}
])

// 上传收款码
const uploadQrcode = ref();
// 收款码预览
const qrCodeVisible = ref(false);

// 编辑对话框
const editVisible = ref(false);
// 用户编辑表单
const editFormData = reactive({
  phoneNum: "",
  userId: "",
  userName: "",
  bankName: "",
  bankNum: "",
  status: 0,
  zfbNum: "",
  zfbPicFile: [],
  wxPicFile: [],
  zfbPic: "",
  wxPic: "",
});

// 重置密码对话框
const resetPasswordVisible = ref(false);
// 重置密码对话框表单
const resetPasswordFormData = reactive({
  userId: "",
  phoneNum: "",
  userName: "",
  password: "000000"
})

const currRequestBody = reactive({
  pageNo: 1,
  pageItems: 20,
  phoneNum: null,
  userName: null,
  status: null
})

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  getInvitedCode();
  getTableData();
});

/**
 * 操作钩子
 */
// 分页钩子
const userListTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
};

// 上传文件失败钩子
const uploadFail = ({file}) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
};

/**
 * 业务相关
 */
// 获取邀请码
const getInvitedCode = () => {
  invitedCode.value = "";
  request.get({
    url: BASE_URL.getInvitedCode
  }).then(res => {
    invitedCode.value = res;
  }).catch(err => {
    console.error(err);
  }).finally(() => {
  })
}

// 复制邀请码
const copyInvitedCode = () => {
  copyInfo(invitedCode.value)
}
const getTableData = async () => {
  userListTable.tableData = [];
  userListTable.tableLoading = true;
  request.post({
    url: BASE_URL.userList,
    data: currRequestBody
  }).then(res => {
    userListTable.pagination.total = res.totalRows;
    userListTable.tableData = res.list;
    userListTable.tableData.map((item, index) => {
      item.index = (userListTable.pagination.current - 1) * userListTable.pagination.pageSize + index + 1;
      item.registerTime = timestampToDateTime(item.registerTime);
    })
    console.log("@", userListTable.tableData)
  }).catch(err => {
    console.error(err);
  }).finally(() => {
    userListTable.tableLoading = false;
  })
}

// 编辑邀请码
const editInvitedCode = () => {
  console.log(newInvitedCode.value);
  request.post({
    url: setObjToUrlParams(BASE_URL.updateInvitedCode, {invitedCode: newInvitedCode.value})
  }).then(res => {
    MessagePlugin.success("修改成功");
  }).catch(err => {
    console.error(err);
  }).finally(() => {
    getInvitedCode();
  })
}

// 下单图预览trigger
const qrCodeOpen = () => {
  qrCodeVisible.value = true;
}

const searchData = async () => {
  userListTable.pagination.current = 1;
  userListTable.pagination.pageSize = 20;
  Object.assign(currRequestBody, {
    pageNo: userListTable.pagination.current,
    pageItems: userListTable.pagination.pageSize,
  })
  await getTableData();
}
// 启用
const enableUser = (row: any) => {
  console.log(row);
  const cancelConfirmDialog = DialogPlugin.confirm({
    header: '提示',
    theme: "warning",
    body: '确定要启用该用户吗？',
    confirmBtn: {
      content: '确认',
      variant: 'base',
      theme: 'success',
    },
    cancelBtn: '取消',
    onConfirm: () => {
      let params = {
        phoneNum: row.phoneNum,
        userId: row.userId,
        userName: row.userName,
        bankName: row.bankName,
        bankNum: row.bankNum,
        status: 1,
        zfbNum: row.zfbNum,
        zfbPic: row.zfbPic,
        wxPic: row.wxPic,
      }
      request.post({
        url: BASE_URL.userEdit,
        data: params
      }).then(res => {
        MessagePlugin.success("已启用");
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        // 销毁弹框
        cancelConfirmDialog.destroy();
        getTableData();
      })
    },
    onClose: () => {
      cancelConfirmDialog.hide();
    },
  });
}
// 禁用
const disableUser = (row: any) => {
  console.log(row);
  const cancelConfirmDialog = DialogPlugin.confirm({
    header: '提示',
    theme: "warning",
    body: '确定要禁用该用户吗？',
    confirmBtn: {
      content: '确认',
      variant: 'base',
      theme: 'danger',
    },
    cancelBtn: '取消',
    onConfirm: () => {
      let params = {
        phoneNum: row.phoneNum,
        userId: row.userId,
        userName: row.userName,
        bankName: row.bankName,
        bankNum: row.bankNum,
        status: 0,
        zfbNum: row.zfbNum,
        zfbPic: row.zfbPic,
        wxPic: row.wxPic,
      }
      request.post({
        url: BASE_URL.userEdit,
        data: params
      }).then(res => {
        MessagePlugin.success("已禁用");
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        // 销毁弹框
        cancelConfirmDialog.destroy();
        getTableData();
      })
    },
    onClose: () => {
      cancelConfirmDialog.hide();
    },
  });
}

// 编辑用户
const editUser = (row: any) => {
  // MessagePlugin.warning("编辑功能暂未开放");
  Object.assign(editFormData, {
    phoneNum: row.phoneNum,
    userId: row.userId,
    userName: row.userName,
    bankName: row.bankName,
    bankNum: row.bankNum,
    status: row.status,
    zfbNum: row.zfbNum,
    zfbPicFile: isNotEmpty(row.zfbPic) ? [{url: row.zfbPic}] : [],
    wxPicFile: isNotEmpty(row.wxPic) ? [{url: row.wxPic}] : [],
    zfbPic: row.zfbPic,
    wxPic: row.wxPic
  });
  editVisible.value = true;
}

/**
 * 上传
 */
const beforeUpload = (file: { type: string; }) => {
  return validateFileType("image/*", file.type);
};

// 上传收款码-支付宝
const uploadALiPayCode = (file: any) => {
  if (isNotEmpty(file.raw)) {
    return new Promise((resolve, reject) => {
      let params = {
        phoneNum: editFormData.phoneNum,
        userName: editFormData.userName,
        fileFlag: 2
      }
      let fileFormData = new FormData();
      fileFormData.append("file", file.raw);
      let requestUrl = setObjToUrlParams(BASE_URL.uploadUserPic, params);
      uploadFile(requestUrl, fileFormData, percentCompleted => {
      }).then(res => {
        Object.assign(editFormData, {
          zfbPic: String(res)
        });
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      }).finally(() => {
      })
    })
  }
}
// 上传收款码-微信
const uploadWeChatCode = (file: any) => {
  if (isNotEmpty(file.raw)) {
    return new Promise((resolve, reject) => {
      let params = {
        phoneNum: editFormData.phoneNum,
        userName: editFormData.userName,
        fileFlag: 3
      }
      let fileFormData = new FormData();
      fileFormData.append("file", file.raw);
      let requestUrl = setObjToUrlParams(BASE_URL.uploadUserPic, params);
      uploadFile(requestUrl, fileFormData, percentCompleted => {
      }).then(res => {
        Object.assign(editFormData, {
          wxPic: String(res)
        });
        resolve(res);
      }).catch(err => {
        console.error(err);
        reject(err);
      }).finally(() => {
      })
    })
  }
}

// 编辑确认
const editConfirm = async () => {
  await Promise.all([aLiPayCode.value.uploadFiles(), weChatCode.value.uploadFiles()]);
  setTimeout(() => {
    request.post({
      url: BASE_URL.userEdit,
      data: editFormData
    }).then(res => {
      MessagePlugin.success("编辑成功");
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      editVisible.value = false;
      getTableData();
    })
  }, 500);
}

// 重置密码
const resetPassword = (row: any) => {
  console.log(row);
  Object.assign(resetPasswordFormData, {
    userId: row.userId,
    phoneNum: row.phoneNum,
    userName: row.userName,
    password: "000000",
  });
  resetPasswordVisible.value = true;
}

const resetPasswordConfirm = () => {
  let params = {
    userId: resetPasswordFormData.userId,
    password: resetPasswordFormData.password,
  }
  request.post({
    url: setObjToUrlParams(BASE_URL.updatePassword, params)
  }).then(res => {
    MessagePlugin.success("重置成功");
  }).catch(err => {
    console.error(err);
  }).finally(() => {
    resetPasswordVisible.value = false;
    getTableData();
  })
}
</script>

<style scoped lang="less">
.user-list-card {
  margin-top: 10px;

  &:first-child {
    margin-top: 0;
  }

  .cardTop {
    //border: 1px solid red;
    align-items: center;
    flex-wrap: wrap;

    .cardTitle {
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 10px;
    }

    .inputStyle {
      width: 200px;
      margin: 5px;
    }

    .rangeInputStyle {
      width: 410px;
    }
  }

  .tableStyle {
    width: 100%;
    margin-top: 10px;

    .tdesign-demo-image-viewer__base {
      width: 100%;
      height: 100px;
      max-height: 200px;
      margin: 10px;
      border: 4px solid var(--td-bg-color-secondarycontainer);
      border-radius: var(--td-radius-medium);

      .tdesign-demo-image-viewer__ui-image {
        width: 100%;
        height: 100%;
        display: inline-flex;
        position: relative;
        justify-content: center;
        align-items: center;
        border-radius: var(--td-radius-small);
        overflow: hidden;

        &--hover {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          background-color: rgba(0, 0, 0, 0.6);
          color: var(--td-text-color-anti);
          line-height: 22px;
          transition: 0.2s;

          &:hover {
            opacity: 1;
            cursor: pointer;
          }
        }

        &--img {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          cursor: pointer;
          position: absolute;
        }

        &--footer {
          padding: 0 16px;
          height: 56px;
          width: 100%;
          line-height: 56px;
          font-size: 16px;
          position: absolute;
          bottom: 0;
          color: var(--td-text-color-anti);
          background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
          display: flex;
          box-sizing: border-box;

          &--title {
            flex: 1;
          }
        }

        &--icons {
          .tdesign-demo-icon {
            cursor: pointer;
          }
        }

        &__base {
          width: 160px;
          height: 160px;
          margin: 10px;
          border: 4px solid var(--td-bg-color-secondarycontainer);
          border-radius: var(--td-radius-medium);
        }
      }
    }

    .settingBtns {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: auto;
    }
  }

}
</style>