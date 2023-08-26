<!--
  * @author baoyuhao
  * @date 2023/4/24 14:15:50
  * @description
  * @version 0.1.0
-->
<template>
  <t-card class="user-manage-card">
    <t-row justify="space-between" class="cardTop">
      <div style="display: flex;justify-content: start;">
        <t-input class="inputStyle" v-model="currRequestBody.phoneNum" placeholder="请输入手机号" clearable/>
        <t-input class="inputStyle" v-model="currRequestBody.name" placeholder="请输入姓名" clearable/>
        <t-button class="inputStyle" style="width: 100px;" @click="searchData">
          <template #icon>
            <t-icon name="search"></t-icon>
          </template>
          查询
        </t-button>
      </div>
      <t-button class="inputStyle" style="width: 100px;" @click="addUser">
        <template #icon>
          <t-icon name="add"></t-icon>
        </template>
        新增
      </t-button>
    </t-row>
  </t-card>
  <t-card class="user-manage-card">
    <t-table
        class="tableStyle"
        :data="userManageTable.tableData"
        :columns="USER_MANAGE_TABLE_COLUMNS"
        row-key="index"
        hover
        stripe
        table-layout="auto"
        :pagination="userManageTable.pagination"
        :loading="userManageTable.tableLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: 64, container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: 0,container: getContainer }"
        @page-change="userManageTablePageChange"
        size="small"
        style="margin-top: 10px;"
    >
      <template #phoneNum="slotProps">
        {{ slotProps.row.phoneNum }}
      </template>
      <template #status="slotProps">
        <t-tag :theme="userTagTheme(slotProps.row.status)" variant="light-outline" shape="round">
          {{ userStatus(slotProps.row.status) }}
        </t-tag>
      </template>
      <template #settings="slotProps">
        <div class="settingBtns">
          <t-button theme="primary" @click="editUser(slotProps.row)">
            <template #icon>
              <t-icon name="edit"></t-icon>
            </template>
            编辑
          </t-button>
        </div>
      </template>
    </t-table>
  </t-card>

  <!--  新增、编辑管理员对话框  -->
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
          <t-input v-model="editFormData.phoneNum" placeholder="请输入手机号" clearable/>
        </t-form-item>
        <t-form-item label="姓名">
          <t-input v-model="editFormData.name" placeholder="请输入姓名" clearable/>
        </t-form-item>
        <t-form-item label="密码">
          <t-input type="password" v-model="editFormData.password" placeholder="请输入密码" clearable/>
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
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import {useSettingStore} from "@/store";
import {useRouter} from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";
import {prefix} from "@/config/global";
import {BASE_URL, USER_MANAGE_TABLE_COLUMNS} from "./constants";
import {MessagePlugin} from "tdesign-vue-next";
import {request} from "@/utils/request";
import {timestampToDateTime} from "@/utils/date";
import {userStatus, userTagTheme} from "@/utils/chargeStatus";

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

/**
 * 表格相关
 */
const userManageTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [],
  // 表格分页
  pagination: {
    total: 0,
    current: 1,
    pageSize: 20
  }
});

// 用户状态选项
const userStatusOptions = reactive([
  {label: '启用', value: 1},
  {label: '禁用', value: 0}
])

// 对话框标题
const dialogTitle = ref("编辑管理员");
// 编辑对话框
const editVisible = ref(false);
// 用户编辑表单
const editFormData = reactive({
  adminId: null,
  phoneNum: "",
  password: "000000",
  name: "",
  status: 1
});

const currRequestBody = reactive({
  pageNo: 1, // 页
  pageItems: 20, // 条数
  name: null, // 姓名
  phoneNum: null,// 手机号
})

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  userManageTable.pagination.current = currRequestBody.pageNo;
  userManageTable.pagination.pageSize = currRequestBody.pageItems;
  getTableData()
});

/**
 * 操作钩子
 */
// 分页钩子
const userManageTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
  currRequestBody.pageNo = curr.current;
  currRequestBody.pageItems = curr.pageSize;
  userManageTable.pagination.current = currRequestBody.pageNo;
  userManageTable.pagination.pageSize = currRequestBody.pageItems;
  getTableData();
};

/**
 * 业务相关
 */
const getTableData = () => {
  userManageTable.tableData = [];
  userManageTable.tableLoading = true;
  request.post({
    url: BASE_URL.adminList,
    data: currRequestBody
  }).then(res => {
    userManageTable.pagination.total = res.totalRows;
    userManageTable.tableData = res.list;
    userManageTable.tableData.map((item, index) => {
      item.index = (userManageTable.pagination.current - 1) * userManageTable.pagination.pageSize + index + 1;
      item.buildTime = timestampToDateTime(item.buildTime);
    })
  }).catch(err => {
  }).finally(() => {
    userManageTable.tableLoading = false;
  })
}
// 搜索数据
const searchData = () => {
  getTableData();
}
// 新增用户
const addUser = () => {
  dialogTitle.value = "新增管理员";
  Object.assign(editFormData, {
    adminId: null,
    phoneNum: "",
    password: "000000",
    name: "",
    status: 1
  })
  editVisible.value = true;
}
// 编辑管理员
const editUser = (row: any) => {
  dialogTitle.value = "编辑管理员";
  Object.assign(editFormData, {
    adminId: row.adminId,
    phoneNum: row.phoneNum,
    password: "000000",
    name: row.name,
    status: row.status
  })
  editVisible.value = true;
}

// 编辑确认
const editConfirm = () => {
  request.post({
    url: BASE_URL.adminEdit,
    data: editFormData
  }).then(res => {
    console.log(res)
    MessagePlugin.success(dialogTitle.value + "成功");
  }).catch(err => {
    MessagePlugin.error("操作失败：" + err);
  }).finally(() => {
    getTableData();
    editVisible.value = false;
  })
}
</script>

<style scoped lang="less">
.user-manage-card {
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

    .settingBtns {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: auto;
    }
  }

}
</style>