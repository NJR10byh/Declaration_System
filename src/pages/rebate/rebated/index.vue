<!--
  * @author baoyuhao
  * @date 2023/8/4 13:58:08
  * @description 已返款
  * @version 0.8.0
-->
<template>
  <t-card class="rebated-card">
    <t-row justify="start" class="cardTop">
      <t-input class="inputStyle" v-model="currRequestBody.reporter" placeholder="请输入用户名称" clearable/>
      <t-button class="inputStyle" style="width: 100px;" @click="searchData">
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
        row-key="index"
        hover
        :pagination="rebatedTable.pagination"
        :loading="rebatedTable.tableLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: 64, container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: 0,container: getContainer }"
        @page-change="rebatedTablePageChange"
        size="small"
        style="margin-top: 10px;"
    >
      <template #payAmount="slotProps">
        <t-tag theme="primary" variant="light-outline">
          {{ slotProps.row.payAmount }}
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
          row-key="index"
          hover
          stripe
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
import {BASE_URL, REBATED_DETAIL_TABLE_COLUMNS, REBATED_TABLE_COLUMNS} from "./constants";
import {request} from "@/utils/request";
import {timestampToDateTime} from "@/utils/date";
import {setObjToUrlParams} from "@/utils/request/utils";

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
  tableData: [],
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
      shouldPayback: "0",
    },
  ]
})

// 结算对话框
const rebatedDetailVisible = ref(false);

const currRequestBody = reactive({
  pageNo: 1,
  pageItems: 20,
  commodity: null,
  status: null,
  startTime: null,
  endTime: null,
  reporter: null,
  orderId: null
})

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  rebatedTable.pagination.current = currRequestBody.pageNo;
  rebatedTable.pagination.pageSize = currRequestBody.pageItems;
  getTableData()
});

/**
 * 操作钩子
 */
// 分页钩子
const rebatedTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
  currRequestBody.pageNo = curr.current;
  currRequestBody.pageItems = curr.pageSize;
  rebatedTable.pagination.current = currRequestBody.pageNo;
  rebatedTable.pagination.pageSize = currRequestBody.pageItems;
  getTableData();
};

/**
 * 业务相关
 */
const getTableData = () => {
  rebatedTable.tableData = [];
  rebatedTable.tableLoading = true;
  request.post({
    url: BASE_URL.listSettle,
    data: currRequestBody
  }).then(res => {
    rebatedTable.pagination.total = res.totalRows;
    rebatedTable.tableData = res.list;
    rebatedTable.tableData.map((item, index) => {
      item.index = (rebatedTable.pagination.current - 1) * rebatedTable.pagination.pageSize + index + 1;
      item.payAmount += " 元";
      item.payTime = timestampToDateTime(item.payTime);
    })
  }).catch(err => {
  }).finally(() => {
    rebatedTable.tableLoading = false;
  })
}
const searchData = () => {
  currRequestBody.pageNo = 1;
  rebatedTable.pagination.current = currRequestBody.pageNo;
  getTableData();
}
// 结算
const rebatedDetail = (row: any) => {
  rebatedDetailTable.tableData = [];
  rebatedDetailTable.tableLoading = true;
  rebatedDetailVisible.value = true;
  console.log("详情", row);
  let params = {
    statId: row.statId
  }
  request.post({
    url: setObjToUrlParams(BASE_URL.getSettleDetail, params)
  }).then(res => {
    rebatedDetailTable.footData[0].shouldPayback = res.total + " 元";
    rebatedDetailTable.tableData = res.list;
    rebatedDetailTable.tableData.map((item, index) => {
      item.index = index + 1;
      item.payAmount += " 元";
      item.shouldPayback += " 元";
    })
  }).catch(err => {
  }).finally(() => {
    rebatedDetailTable.tableLoading = false;
  })
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