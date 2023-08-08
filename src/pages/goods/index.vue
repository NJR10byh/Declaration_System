<!--
  * @author baoyuhao
  * @date 2023/8/4 13:57:51
  * @description 
  * @version 0.8.0
-->
<template>
  <t-card class="goods-card">
    <t-row justify="start" class="cardTop">
      <div class="cardTitle">搜索条件</div>
    </t-row>
    <t-row justify="start" class="cardTop">
      <t-input class="inputStyle" v-model="goodsInfoTable.searchText" placeholder="请输入商品名称" clearable/>
      <t-select
          class="inputStyle"
          v-model="goodsInfoTable.searchText"
          placeholder="-请选择商品状态-"
          :options="goodsStatusOptions"
          filterable
          clearable
      />
      <t-button class="inputStyle" style="width: 100px;">
        <template #icon>
          <t-icon name="search"></t-icon>
        </template>
        查询
      </t-button>
      <t-button class="inputStyle" style="width: 100px;" @click="addGoodsInfo()">
        <template #icon>
          <t-icon name="add"></t-icon>
        </template>
        新增
      </t-button>
    </t-row>
  </t-card>
  <t-card class="goods-card">
    <t-table
        class="tableStyle"
        :data="goodsInfoTable.tableData"
        :columns="GOODS_INFO_TABLE_COLUMNS"
        row-key="id"
        hover
        stripe
        table-layout="auto"
        :pagination="goodsInfoTable.pagination"
        :loading="goodsInfoTable.tableLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: 64, container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: 0,container: getContainer }"
        @page-change="goodsInfoTablePageChange"
        size="small"
        style="margin-top: 10px;"
    >
      <template #status="slotProps">
        <t-tag theme="warning" variant="light-outline" shape="round">
          {{ slotProps.row.status }}
        </t-tag>
      </template>
      <template #settings="slotProps">
        <div class="settingBtns">
          <t-button theme="primary" @click="copyInfo(slotProps.row)">
            <template #icon>
              <t-icon name="file-copy"></t-icon>
            </template>
            复制
          </t-button>
          <t-button theme="success" @click="enable(slotProps.row)">
            <template #icon>
              <t-icon name="check-circle"></t-icon>
            </template>
            启用
          </t-button>
          <t-button theme="danger" @click="disable(slotProps.row)">
            <template #icon>
              <t-icon name="close-circle"></t-icon>
            </template>
            禁用
          </t-button>
          <t-button theme="warning" @click="editInfo(slotProps.row)">
            <template #icon>
              <t-icon name="edit"></t-icon>
            </template>
            编辑
          </t-button>
          <t-button theme="primary" @click="getLog(slotProps.row)">
            <template #icon>
              <t-icon name="view-module"></t-icon>
            </template>
            日志
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
  >
    <template #body>
      <t-form>
        <t-form-item label="商品">
          <t-input v-model="editFormData.goodsName" placeholder="请输入商品名称"/>
        </t-form-item>
        <t-form-item label="商品链接">
          <t-input v-model="editFormData.goodsLink" placeholder="请输入商品链接"/>
        </t-form-item>
        <t-form-item label="总金额">
          <t-input v-model="editFormData.totalMoney" placeholder="请输入总金额" suffix="元"/>
        </t-form-item>
        <t-form-item label="预计返款金额">
          <t-input v-model="editFormData.preBackMoney" placeholder="请输入预计返款金额" suffix="元"/>
        </t-form-item>
        <t-form-item label="截止时间">
          <t-date-picker v-model="editFormData.endTime" enable-time-picker placeholder="请选择截止时间"
                         format="YYYY-MM-DD HH:mm:ss" valueType="YYYY-MM-DD HH:mm:ss"/>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {useSettingStore} from "@/store";
import {useRouter} from "vue-router";
import {prefix} from "@/config/global";
import {GOODS_INFO_TABLE_COLUMNS} from "./constants";

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
const goodsInfoTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [
    {
      index: 1,
      goodsName: "商品名称",
      remainQuota: 10000,
      totalMoney: 5200,
      preBackMoney: 800,
      createTime: "2023-08-01 17:26:43",
      endTime: "2023-08-08 13:21:26",
      status: "待审核",
    },
    {
      index: 2,
      goodsName: "商品名称",
      remainQuota: 9800,
      totalMoney: 1400,
      preBackMoney: 1500,
      createTime: "2023-08-01 17:26:43",
      endTime: "2023-08-08 13:21:26",
      status: "审核中",
    }
  ],// 表格数据
  searchText: "",
  // 表格分页
  pagination: {
    total: 0,
    current: 1,
    pageSize: 20
  }
});

// 商品状态选项
const goodsStatusOptions = reactive([
  {label: '待审核', value: '1'},
  {label: '审核中', value: '2'},
  {label: '已审核', value: '3'}
])

// 对话框标题
const dialogTitle = ref("编辑商品信息");
// 编辑对话框
const editVisible = ref(false);

// 编辑表单
const editFormData = reactive({
  goodsName: "",
  goodsLink: "",
  totalMoney: "",
  preBackMoney: "",
  endTime: ""
});

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
const goodsInfoTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
};

/**
 * 业务相关
 */

// 新增
const addGoodsInfo = () => {
  dialogTitle.value = "新增商品信息";
  Object.assign(editFormData, {
    goodsName: "",
    goodsLink: "",
    totalMoney: "",
    preBackMoney: "",
    endTime: ""
  })
  editVisible.value = true;
}
// 复制
const copyInfo = (row: any) => {
  console.log("复制");
  console.log(row);
}

// 启用
const enable = (row: any) => {
  console.log("启用");
  console.log(row);
}

// 禁用
const disable = (row: any) => {
  console.log("禁用");
  console.log(row);
}

// 编辑
const editInfo = (row: any) => {
  dialogTitle.value = "编辑商品信息";
  Object.assign(editFormData, {
    goodsName: row.goodsName,
    totalMoney: row.totalMoney,
    preBackMoney: row.preBackMoney,
    endTime: row.endTime
  })
  editVisible.value = true;
}

// 日志
const getLog = (row: any) => {
  console.log("日志");
  console.log(row);
}

const editConfirm = () => {
  console.log("编辑确认");
  editVisible.value = false;
}
</script>

<style lang="less" scoped>
.goods-card {
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