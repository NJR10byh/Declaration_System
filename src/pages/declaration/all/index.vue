<template>
  <t-card class="all-declaration-card">
    <t-row justify="start" class="cardTop">
      <div class="cardTitle">搜索条件</div>
    </t-row>
    <t-row justify="start" class="cardTop">
      <t-input class="inputStyle" v-model="allDeclarationTable.searchText" placeholder="请输入订单号" clearable/>
      <t-input class="inputStyle" v-model="allDeclarationTable.searchText" placeholder="请输入商品名称" clearable/>
      <t-select class="inputStyle" placeholder="请选择订单状态">
        <t-option key="all" label="全部" value="0"/>
        <t-option key="status1" label="状态1" value="1"/>
        <t-option key="status2" label="状态2" value="2"/>
      </t-select>
      <t-input class="inputStyle" v-model="allDeclarationTable.searchText" placeholder="请输入报单人" clearable/>
      <t-input class="inputStyle" v-model="allDeclarationTable.searchText" placeholder="请输入微信名" clearable/>
      <t-date-range-picker class="inputStyle rangeInputStyle" :placeholder="['报单日期 起', '报单日期 止']" clearable/>
    </t-row>
  </t-card>
  <t-card class="all-declaration-card">
    <t-row justify="end" class="cardTop">
      <t-button>
        <template #icon>
          <t-icon name="search"></t-icon>
        </template>
        查询
      </t-button>
      <t-button theme="success">
        <template #icon>
          <t-icon name="file-excel"></t-icon>
        </template>
        导出Excel
      </t-button>
      <t-button theme="success">
        <template #icon>
          <t-icon name="file-image"></t-icon>
        </template>
        导出下单图
      </t-button>
      <t-button theme="success">
        <template #icon>
          <t-icon name="file-image"></t-icon>
        </template>
        导出完成图
      </t-button>
    </t-row>
    <t-table
        class="tableStyle"
        :data="allDeclarationTable.tableData"
        :columns="ALL_DECLARATION_TABLE_COLUMNS"
        row-key="id"
        hover
        stripe
        table-content-width="1600"
        :pagination="allDeclarationTable.pagination"
        :loading="allDeclarationTable.tableLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: 64, container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: 0,container: getContainer }"
        @page-change="allDeclarationTablePageChange"
        size="small"
        style="margin-top: 10px;"
    >
      <template #settings="slotProps">
        <div class="settingBtns">
          <t-button theme="warning">
            <template #icon>
              <t-icon name="edit"></t-icon>
            </template>
            修改
          </t-button>
          <t-button theme="danger">
            <template #icon>
              <t-icon name="delete"></t-icon>
            </template>
            删除
          </t-button>
        </div>
      </template>
    </t-table>
  </t-card>
</template>

<script setup lang="ts">
import {useSettingStore} from "@/store";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {prefix} from "@/config/global";
import {ALL_DECLARATION_TABLE_COLUMNS} from "@/pages/declaration/all/constants";

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
const allDeclarationTable = ref({
  tableLoading: false,// 表格加载
  tableData: [{
    index: 1,
    orderId: "123456789",
    goodsName: "商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称",
    orderStatus: "审核中",
    declarationPerson: "报单人",
    wechatName: "微信名",
    money: "1000",
    preBackMoney: "800",
    relBackMoney: "700",
    backMoneyTime: "2023-08-01",
    declarateTime: "2023-08-02",
    declarationDate: "报单日期",
    operation: "操作"
  }],// 表格数据
  searchText: "",
  // 表格分页
  pagination: {
    total: 0,
    current: 1,
    pageSize: 20
  }
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
const allDeclarationTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
};
</script>

<style scoped lang="less">
.all-declaration-card {
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