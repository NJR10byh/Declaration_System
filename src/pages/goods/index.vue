<!--
  * @author baoyuhao
  * @date 2023/8/4 13:57:51
  * @description 
  * @version 0.8.0
-->
<template>
  <t-card class="goods-card">
    <t-row justify="space-between" class="cardTop">
      <div style="display: flex;justify-content: start;">
        <t-input class="inputStyle" v-model="currRequestBody.commodity" placeholder="请输入商品名称" clearable/>
        <t-select
            class="inputStyle"
            v-model="currRequestBody.status"
            placeholder="-请选择商品状态-"
            :options="goodsStatusOptions"
            filterable
            clearable
        />
        <t-button class="inputStyle" style="width: 100px;" @click="searchData">
          <template #icon>
            <t-icon name="search"></t-icon>
          </template>
          查询
        </t-button>
      </div>
      <t-button class="inputStyle" style="width: 100px;" @click="addGoodsInfo()">
        <template #icon>
          <t-icon name="add"></t-icon>
        </template>
        新增
      </t-button>
    </t-row>
  </t-card>
  <t-card class="goods-card">
    <t-enhanced-table
        class="tableStyle"
        :data="goodsInfoTable.tableData"
        :columns="GOODS_INFO_TABLE_COLUMNS"
        :tree="treeConfig"
        row-key="commodityId"
        hover
        table-layout="auto"
        :pagination="goodsInfoTable.pagination"
        :loading="goodsInfoTable.tableLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: 64, container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: 0,container: getContainer }"
        @page-change="goodsInfoTablePageChange"
        @expanded-tree-nodes-change="goodsInfoTableExpandedTreeNodesChange"
        size="small"
        style="margin-top: 10px;"
    >
      <template #remainAmount="slotProps">
        {{ isNotEmpty(slotProps.row.remainAmount) ? slotProps.row.remainAmount + "元" : "" }}
      </template>
      <template #totalAmount="slotProps">
        {{ isNotEmpty(slotProps.row.totalAmount) ? slotProps.row.totalAmount + "元" : "" }}
      </template>
      <template #expectPayback="slotProps">
        {{ isNotEmpty(slotProps.row.expectPayback) ? slotProps.row.expectPayback + "元" : "" }}
      </template>
      <template #buildTime="slotProps">
        {{ timestampToDateTime(slotProps.row.buildTime) }}
      </template>
      <template #endTime="slotProps">
        {{ timestampToDateTime(slotProps.row.endTime) }}
      </template>
      <template #status="slotProps">
        <t-tag :theme="goodsTagTheme(slotProps.row.status)" variant="light-outline" shape="round">
          {{ goodsStatus(slotProps.row.status) }}
        </t-tag>
      </template>
      <template #settings="slotProps">
        <div class="settingBtns">
          <t-button theme="primary" @click="copyInfo(slotProps.row.shoppingUrl)">
            <template #icon>
              <t-icon name="file-copy"></t-icon>
            </template>
            复制
          </t-button>
          <t-button theme="warning" @click="editInfo(slotProps.row)">
            <template #icon>
              <t-icon name="edit"></t-icon>
            </template>
            编辑
          </t-button>
          <t-button theme="primary" @click="addScheme(slotProps.row)" v-show="slotProps.row.parentId==='-1'">
            <template #icon>
              <t-icon name="add"></t-icon>
            </template>
            新增方案
          </t-button>
        </div>
      </template>
    </t-enhanced-table>
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
          <t-input v-model="editFormData.commodity" placeholder="请输入商品名称"/>
        </t-form-item>
        <t-form-item label="商品链接">
          <t-input v-model="editFormData.shoppingUrl" placeholder="请输入商品链接"/>
        </t-form-item>
        <t-form-item label="商品状态">
          <t-select
              v-model="editFormData.status"
              placeholder="-请选择商品状态-"
              :options="goodsStatusOptions"
              filterable
              clearable
          />
        </t-form-item>
        <t-form-item label="总金额">
          <t-input type="number" v-model="editFormData.totalAmount" placeholder="请输入总金额" suffix="元"/>
        </t-form-item>
        <t-form-item label="预计返款金额">
          <t-input type="number" v-model="editFormData.expectPayback" placeholder="请输入预计返款金额" suffix="元"/>
        </t-form-item>
        <t-form-item label="截止时间">
          <t-date-picker v-model="editFormData.endTime" enable-time-picker placeholder="请选择截止时间"
                         format="YYYY-MM-DD HH:mm:ss" valueType="YYYY-MM-DD HH:mm:ss"/>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>

  <!--  新增方案对话框  -->
  <t-dialog
      v-model:visible="addSchemeVisible"
      header="新增方案"
      :confirm-on-enter="true"
      :on-confirm="addSchemeConfirm"
  >
    <template #body>
      <t-form>
        <t-form-item label="商品名称">
          <t-input v-model="addSchemeFormData.commodity" disabled readonly/>
        </t-form-item>
        <t-form-item label="商品链接">
          <t-input v-model="addSchemeFormData.shoppingUrl" placeholder="请输入商品链接"/>
        </t-form-item>
        <t-form-item label="方案名称">
          <t-input v-model="addSchemeFormData.schemeName" placeholder="请输入方案名称"/>
        </t-form-item>
        <t-form-item label="方案状态">
          <t-select
              v-model="addSchemeFormData.status"
              placeholder="-请选择方案状态-"
              :options="goodsStatusOptions"
              filterable
              clearable
          />
        </t-form-item>
        <t-form-item label="预计返款金额">
          <t-input type="number" v-model="addSchemeFormData.expectPayback" placeholder="请输入预计返款金额"
                   suffix="元"/>
        </t-form-item>
        <t-form-item label="截止时间">
          <t-date-picker v-model="addSchemeFormData.endTime" enable-time-picker placeholder="请选择截止时间"
                         format="YYYY-MM-DD HH:mm:ss" valueType="YYYY-MM-DD HH:mm:ss"
                         :disable-date="{after:addSchemeFormData.endTime}"/>
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
import {BASE_URL, GOODS_INFO_TABLE_COLUMNS} from "./constants";
import {request} from "@/utils/request";
import {dateStringToTimestamp, timestampToDateTime} from "@/utils/date";
import {goodsStatus, goodsTagTheme} from "@/utils/chargeStatus";
import {copyInfo} from "@/utils/tools";
import {MessagePlugin} from "tdesign-vue-next";
import {isNotEmpty} from "../../utils/validate";

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
  tableData: [],// 表格数据
  searchText: "",
  // 表格分页
  pagination: {
    total: 0,
    current: 1,
    pageSize: 20
  }
});
const treeConfig = reactive({
  childrenKey: 'childCommodities',
  expandTreeNodeOnClick: false,
  treeNodeColumnIndex: 1,
});

// 商品状态选项
const goodsStatusOptions = reactive([
  {label: '启用', value: 1},
  {label: '禁用', value: 0}
])

// 对话框标题
const dialogTitle = ref("编辑商品信息");
// 编辑对话框
const editVisible = ref(false);
// 编辑表单
const editFormData = reactive({
  commodityId: null,
  commodity: "",
  status: 1,
  shoppingUrl: "",
  totalAmount: "",
  expectPayback: "",
  endTime: "",
  parentId: "-1",
});

// 新增方案对话框
const addSchemeVisible = ref(false);
const addSchemeFormData = reactive({
  commodityId: null,
  commodity: "",
  schemeName: "",
  status: 1,
  shoppingUrl: "",
  expectPayback: "",
  endTime: "",
  parentId: "",
});
const addSchemeDeadLine = ref("");

// 响应式对象 currRequestBody，包含当前页码、每条页数，以及搜索过滤参数
const currRequestBody = reactive({
  pageNo: 1,
  pageItems: 20,
  commodity: null,
  status: null
})

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
// 调用获取表格数据的方法,并设置分页参数,与定义的请求体对象有关联。
// 可以重用请求体对象,避免重复设置分页参数。
onMounted(() => {
  goodsInfoTable.pagination.current = currRequestBody.pageNo;
  goodsInfoTable.pagination.pageSize = currRequestBody.pageItems;
  getTableData()
});

/**
 * 操作钩子
 */
// 分页钩子
const goodsInfoTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
  currRequestBody.pageNo = curr.current;
  currRequestBody.pageItems = curr.pageSize;
  goodsInfoTable.pagination.current = currRequestBody.pageNo;
  goodsInfoTable.pagination.pageSize = currRequestBody.pageItems;
  getTableData();
};
// 节点展开钩子
const goodsInfoTableExpandedTreeNodesChange = (expandedTreeNodes, context) => {
  console.log(expandedTreeNodes, context);
};

/**
 * 业务相关
 */
// 获取表格数据并处理显示
const getTableData = () => {
  goodsInfoTable.tableData = [];
  goodsInfoTable.tableLoading = true;
  request.post({
    url: BASE_URL.commodityList,
    data: currRequestBody
  }).then(res => {
    goodsInfoTable.pagination.total = res.totalRows;
    goodsInfoTable.tableData = res.list;
    goodsInfoTable.tableData.map((item, index) => {
      item.index = (goodsInfoTable.pagination.current - 1) * goodsInfoTable.pagination.pageSize + index + 1;
    })
    console.log(goodsInfoTable.tableData)
  }).catch(err => {
  }).finally(() => {
    goodsInfoTable.tableLoading = false;
  })
}
// 搜索数据
const searchData = () => {
  getTableData();
}
// 新增
const addGoodsInfo = () => {
  dialogTitle.value = "新增商品信息";
  Object.assign(editFormData, {
    commodityId: null,
    commodity: "",
    status: 1,
    shoppingUrl: "",
    totalAmount: "",
    expectPayback: "",
    endTime: "",
    parentId: "-1",
  })
  editVisible.value = true;
}

// 编辑
const editInfo = (row: any) => {
  dialogTitle.value = "编辑商品信息";
  console.log(row)
  Object.assign(editFormData, {
    commodityId: row.commodityId,
    commodity: row.commodity,
    status: row.status,
    totalAmount: row.totalAmount,
    shoppingUrl: row.shoppingUrl,
    expectPayback: row.expectPayback,
    endTime: timestampToDateTime(row.endTime)
  })
  editVisible.value = true;
}

const editConfirm = () => {
  Object.assign(editFormData, {
    endTime: dateStringToTimestamp(editFormData.endTime)
  })
  console.log(editFormData);
  request.post({
    url: BASE_URL.editDetail,
    data: editFormData
  }).then(res => {
    console.log(res);
    MessagePlugin.success(dialogTitle.value + "成功");
  }).catch(err => {
    MessagePlugin.error("操作失败：" + err);
  }).finally(() => {
    getTableData();
    editVisible.value = false;
  })
}

// 新增方案
const addScheme = (row: any) => {
  Object.assign(addSchemeFormData, {
    commodityId: row.commodityId,
    commodity: row.commodity,
    shoppingUrl: row.shoppingUrl,
    parentId: row.commodityId,
    endTime: timestampToDateTime(row.endTime),
    schemeName: "",
    status: 1,
    expectPayback: "",
  })
  addSchemeDeadLine.value = row.endTime;
  addSchemeVisible.value = true;
}

const addSchemeConfirm = () => {
  if (dateStringToTimestamp(addSchemeFormData.endTime) > parseInt(addSchemeDeadLine.value)) {
    MessagePlugin.error("截止时间不能大于商品截止时间");
    addSchemeFormData.endTime = timestampToDateTime(parseInt(addSchemeDeadLine.value));
    return;
  }
  Object.assign(addSchemeFormData, {
    endTime: dateStringToTimestamp(addSchemeFormData.endTime)
  })
  request.post({
    url: BASE_URL.editDetail,
    data: addSchemeFormData
  }).then(res => {
    console.log(res);
    MessagePlugin.success("新增方案成功");
  }).catch(err => {
    MessagePlugin.error("操作失败：" + err);
  }).finally(() => {
    getTableData();
    addSchemeVisible.value = false;
  })
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