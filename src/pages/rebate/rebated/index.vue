<!--
  * @author baoyuhao
  * @date 2023/8/4 13:58:08
  * @description 已返款
  * @version 0.8.0
-->
<template>
  <t-card class="rebated-card">
    <t-row justify="start" class="cardTop">
      <div class="cardTitle">搜索条件</div>
    </t-row>
    <t-row justify="start" class="cardTop">
      <t-input class="inputStyle" v-model="rebatedTable.searchText" placeholder="请输入用户名称" clearable/>
      <t-button class="inputStyle" style="width: 100px;">
        <template #icon>
          <t-icon name="search"></t-icon>
        </template>
        查询
      </t-button>
    </t-row>
  </t-card>
  <t-card class="rebated-card">
    <t-table
        class="tableStyle"
        :data="rebatedTable.tableData"
        :columns="REBATED_TABLE_COLUMNS"
        row-key="id"
        hover
        stripe
        :pagination="rebatedTable.pagination"
        :loading="rebatedTable.tableLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: 64, container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: 0,container: getContainer }"
        @page-change="rebatedTablePageChange"
        size="small"
        style="margin-top: 10px;"
    >
      <template #settlementAmount="slotProps">
        <t-tag theme="primary" variant="light-outline">
          {{ slotProps.row.settlementAmount }}
        </t-tag>
      </template>
      <template #settings="slotProps">
        <div class="settingBtns">
          <t-button theme="primary" @click="rebatedDetail(slotProps.row)">
            <template #icon>
              <t-icon name="view-module"></t-icon>
            </template>
            详情
          </t-button>
        </div>
      </template>
    </t-table>
  </t-card>

  <!-- 返款详情Dialog -->
  <t-dialog
      v-model:visible="rebatedDetailVisible"
      width="1000px"
      header="返款详情"
      attach="body"
      :footer="false"
  >
    <template #body>
      <t-table
          class="tableStyle"
          :data="rebatedDetailTable.tableData"
          :columns="REBATED_DETAIL_TABLE_COLUMNS"
          row-key="id"
          hover
          stripe
          bordered
          :loading="rebatedDetailTable.tableLoading"
          :foot-data="rebatedDetailTable.footData"
          size="small"
      >
        <template #orderId="slotProps">
          <t-tag theme="primary" variant="light-outline">
            {{ slotProps.row.orderId }}
          </t-tag>
        </template>
      </t-table>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {useSettingStore} from "@/store";
import {useRouter} from "vue-router";
import {prefix} from "@/config/global";
import {REBATED_DETAIL_TABLE_COLUMNS, REBATED_TABLE_COLUMNS} from "./constants";

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
// 待返款表格
const rebatedTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [
    {
      index: 1,
      userName: "用户名称",
      settlementAmount: 1000,
      settlementPerson: "张三",
      settlementTime: "2023-08-04 13:58:08",
    },
    {
      index: 1,
      userName: "用户名称",
      settlementAmount: 3200,
      settlementPerson: "石磊",
      settlementTime: "2023-08-04 12:21:43",
    },
  ],
  searchText: "",
  // 表格分页
  pagination: {
    total: 0,
    current: 1,
    pageSize: 20
  }
});

const rebatedDetailTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [],
  footData: [
    {
      index: '合计',
      expectPayback: '100',
    },
  ]
})

// 结算对话框
const rebatedDetailVisible = ref(false);

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
const rebatedTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
};

/**
 * 业务相关
 */
// 结算
const rebatedDetail = (row: any) => {
  rebatedDetailTable.tableData = [];
  rebatedDetailTable.tableLoading = true;
  console.log("详情", row);
  let obj = {
    index: 1,
    orderId: "0000001",
    commodity: "商品1",
    payAmount: 13,
    expectPayback: 1,
    remark: "备注",
    approvalRemark: "审批备注"
  };
  rebatedDetailTable.tableData.push(obj);
  rebatedDetailVisible.value = true;
  rebatedDetailTable.tableLoading = false;
}
</script>

<style lang="less" scoped>
.rebated-card {
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