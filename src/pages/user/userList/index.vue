<!--
  * @author baoyuhao
  * @date 2023/8/8 11:12:07
  * @description 用户列表
  * @version 0.8.0
-->
<template>
  <t-card class="user-list-card">
    <t-row justify="start" class="cardTop">
      <div class="cardTitle">搜索条件</div>
    </t-row>
    <t-row justify="start" class="cardTop">
      <t-input class="inputStyle" v-model="searchData.phone" placeholder="请输入手机号" clearable/>
      <t-input class="inputStyle" v-model="searchData.name" placeholder="请输入姓名" clearable/>
      <t-input class="inputStyle" v-model="searchData.wechat" placeholder="请输入微信名" clearable/>
      <t-select
          class="inputStyle"
          v-model="searchData.status"
          placeholder="-请选择用户状态-"
          :options="userStatusOptions"
          filterable
          clearable
      />
      <t-button class="inputStyle" @click="search" style="width: 100px;">
        <template #icon>
          <t-icon name="search"></t-icon>
        </template>
        查询
      </t-button>
    </t-row>
  </t-card>
  <t-card class="user-list-card">
    <t-table
        class="tableStyle"
        :data="userListTable.tableData"
        :columns="USER_LIST_TABLE_COLUMNS"
        row-key="id"
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
      <template #qrCode="slotProps">
        <div class="tdesign-demo-image-viewer__base">
          <t-image-viewer v-model:visible="qrCodeVisible" :images="[slotProps.row.qrCode]">
            <template #trigger>
              <div class="tdesign-demo-image-viewer__ui-image">
                <img alt="test" :src="slotProps.row.qrCode" class="tdesign-demo-image-viewer__ui-image--img"/>
                <div class="tdesign-demo-image-viewer__ui-image--hover" @click="qrCodeOpen">
                  <span><t-icon size="1.2em" name="browse"/> 预览</span>
                </div>
              </div>
            </template>
          </t-image-viewer>
        </div>
      </template>
      <template #phone="slotProps">
        {{ phone_number(slotProps.row.phone) }}
      </template>
      <template #status="slotProps">
        <t-tag theme="warning" variant="light-outline" shape="round">
          {{ slotProps.row.status }}
        </t-tag>
      </template>
      <template #settings="slotProps">
        <div class="settingBtns">
          <t-button theme="danger" @click="disableUser(slotProps.row)">
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

  <!--  新增、编辑对话框  -->
  <t-dialog
      v-model:visible="editVisible"
      :header="dialogTitle"
      attach="body"
      :confirm-on-enter="true"
      :on-confirm="editConfirm"
      width="500px"
  >
    <template #body>
      <t-form>
        <t-form-item label="手机号码">
          <t-input v-model="editFormData.phone" placeholder="请输入手机号" clearable/>
        </t-form-item>
        <t-form-item label="姓名">
          <t-input v-model="editFormData.name" placeholder="请输入姓名" clearable/>
        </t-form-item>
        <t-form-item label="身份证号码">
          <t-input v-model="editFormData.idCard" placeholder="请输入身份证号码" clearable/>
        </t-form-item>
        <t-form-item label="开户行">
          <t-input v-model="editFormData.bankName" placeholder="请输入开户行" clearable/>
        </t-form-item>
        <t-form-item label="银行卡号">
          <t-input v-model="editFormData.bankCard" placeholder="请输入银行卡号" clearable/>
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
        <t-form-item label="收款码">
          <t-upload
              ref="uploadQrcode"
              v-model="editFormData.qrCode"
              :abridge-name="[10,8]"
              theme="image"
              accept="image/*"
              :request-method="uploadPaymentCode"
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
          <t-input v-model="resetPasswordFormData.phone" placeholder="请输入手机号" clearable/>
        </t-form-item>
        <t-form-item label="姓名">
          <t-input v-model="resetPasswordFormData.name" placeholder="请输入姓名" clearable/>
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
import {USER_LIST_TABLE_COLUMNS} from "./constants";
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next";
import {phone_number} from "../../../utils/antianaphylaxis";

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

// 搜索条件
const searchData = reactive({
  phone: "",
  name: "",
  wechat: "",
  status: ""
})

/**
 * 表格相关
 */
const userListTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [
    {
      index: 1,
      phone: "13209209271",
      name: "张三",
      bankName: "中国建设银行",
      bankCard: "98708765457899007654",
      qrCode: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1eRF4j.img?w=1920&h=1080&q=60&m=2&f=jpg",
      status: "待审核",
      registerTime: "2023-08-02 13:23:45"
    },
    {
      index: 1,
      phone: "19009209322",
      name: "李四",
      bankName: "中国农业银行",
      bankCard: "345678908976545678369",
      qrCode: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1eRF4j.img?w=1920&h=1080&q=60&m=2&f=jpg",
      status: "待审核",
      registerTime: "2023-08-03 17:56:21"
    }
  ],// 表格数据
  // searchText_1: "",
  // searchText_2: "",
  // searchText_3: "",
  // searchText_4: "",
  // 表格分页
  pagination: {
    total: 0,
    current: 1,
    pageSize: 20
  }
});

// 用户状态选项
const userStatusOptions = reactive([
  {label: '启用', value: '1'},
  {label: '禁用', value: '0'}
])

// 上传收款码
const uploadQrcode = ref();
// 收款码预览
const qrCodeVisible = ref(false);

// 编辑对话框
const editVisible = ref(false);
// 用户编辑对话框标题
const dialogTitle = ref("用户编辑");
// 用户编辑表单
const editFormData = reactive({
  phone: "",
  name: "",
  idCard: "",
  bankName: "",
  bankCard: "",
  status: "",
  qrCode: [],
});

// 重置密码对话框
const resetPasswordVisible = ref(false);
// 重置密码对话框表单
const resetPasswordFormData = reactive({
  phone: "",
  name: "",
  password: ""
})

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
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
// 下单图预览trigger
const qrCodeOpen = () => {
  qrCodeVisible.value = true;
}

const search = () => {
  // alert("查询条目失败");
  // console.log(searchData);
  // MessagePlugin.warning("暂未开放");
  console.log(searchData);
  let obj = {}
  obj = {
    phone: searchData.phone,
    name: searchData.name,
    wechat:searchData.wechat,
    statue:searchData.status,
  }
  console.log(searchData);
  console.log("@",userListTable.tableData);
  // 排除空
  // for (let key in obj) {
  //   if (obj[key] == '' || obj[key] == null) {
  //     delete obj[key]
  //   }
  // }
  // @param condition 过滤条件
  // @param data 需要过滤的数据
  let filter = (condition, data) => {
    return data.filter(item => {
      return Object.keys(condition).every(key => {
        return String(item[key]).toLowerCase().includes(
            String(condition[key]).trim().toLowerCase())
      })
    })
  }
  let data = filter(obj, userListTable.tableData);
  console.log(data);
  if (data != '') {
    userListTable.tableData = data
  } else {
    MessagePlugin.warning(
     `没有相关信息`,
    );
    data = [];
    userListTable.tableData = data;
  }

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
      MessagePlugin.success("已禁用")
      // 请求成功后，销毁弹框
      cancelConfirmDialog.destroy();
    },
    onClose: () => {
      cancelConfirmDialog.hide();
    },
  });
}

// 编辑用户
const editUser = (row: any) => {
  dialogTitle.value = "用户编辑";
  Object.assign(editFormData, {
    phone: row.phone,
    name: row.name,
    idCard: row.idCard,
    bankName: row.bankName,
    bankCard: row.bankCard,
    status: row.status,
    qrCode: [],
  })
  editVisible.value = true;
}

// 上传收款码
const uploadPaymentCode = (file: any) => {
  console.log(file);
  return new Promise((resolve) => {
    // 上传进度控制示例
    let percent = 0;
    const percentTimer = setInterval(() => {
      if (percent + 10 < 99) {
        percent += 10;
        uploadQrcode.value.uploadFilePercent({file, percent});
      } else {
        clearInterval(percentTimer);
      }
    }, 100);

    const timer = setTimeout(() => {
      // resolve 参数为关键代码
      resolve({status: 'success', response: {url: 'https://tdesign.gtimg.com/site/avatar.jpg'}});
      clearTimeout(timer);
      clearInterval(percentTimer);
    }, 1000);
  });
}

// 编辑确认
const editConfirm = () => {
  console.log(editFormData);
  editVisible.value = false;
}

// 重置密码
const resetPassword = (row: any) => {
  console.log(row);
  Object.assign(resetPasswordFormData, {
    phone: row.phone,
    name: row.name,
    password: row.password,
  });
  resetPasswordVisible.value = true;
}

const resetPasswordConfirm = () => {
  console.log(resetPasswordFormData);
  resetPasswordVisible.value = false;
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