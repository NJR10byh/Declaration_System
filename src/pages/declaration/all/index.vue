<!--
  * @author baoyuhao
  * @date 2023/8/4 13:55:41
  * @description 全部报单
  * @version 0.8.0
-->
<template>
  <t-card class="all-declaration-card">
    <t-row justify="start" class="cardTop">
      <t-input class="inputStyle" v-model="currRequestBody.orderId" placeholder="请输入订单号" clearable/>
      <t-select
          class="inputStyle"
          v-model="currRequestBody.commodityId"
          placeholder="-请选择商品-"
          :options="goodsOptions"
          filterable
          clearable
      />
      <t-select
          class="inputStyle"
          v-model="currRequestBody.status"
          placeholder="-请选择订单状态-"
          :options="statusOptions"
          filterable
          clearable
      />
      <t-input class="inputStyle" v-model="currRequestBody.reporter" placeholder="请输入报单人" clearable/>
      <t-date-range-picker class="inputStyle rangeInputStyle" v-model="reportDateRange"
                           :placeholder="['报单时间 起', '报单时间 止']" enable-time-picker clearable/>
      <t-button @click="searchData" style="margin-left: 5px;width: 100px;">
        <template #icon>
          <t-icon name="search"></t-icon>
        </template>
        查询
      </t-button>
    </t-row>
  </t-card>
  <t-card class="all-declaration-card">
    <t-row justify="start" class="cardTop">
      <t-button theme="success" @click="exportExcel">
        <template #icon>
          <t-icon name="file-excel"></t-icon>
        </template>
        导出Excel
      </t-button>
      <t-button theme="primary" @click="exportPic(0)">
        <template #icon>
          <t-icon name="file-image"></t-icon>
        </template>
        导出下单图
      </t-button>
      <t-button theme="danger" @click="exportPic(1)">
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
        row-key="index"
        hover
        table-layout="auto"
        :table-content-width="tableContentWidth"
        :pagination="allDeclarationTable.pagination"
        :loading="allDeclarationTable.tableLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: 64, container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: 0,container: getContainer }"
        @page-change="allDeclarationTablePageChange"
        size="small"
        style="margin-top: 10px;"
        v-resize="resize"
    >
      <template #trackNum="slotProps">
        <t-tag theme="default">
          {{ isNotEmpty(slotProps.row.trackNum) ? slotProps.row.trackNum : "暂无" }}
        </t-tag>
      </template>
      <template #schemeName="slotProps">
        <t-tag theme="primary" variant="light-outline">
          {{ slotProps.row.schemeName }}
        </t-tag>
      </template>
      <template #payAmount="slotProps">
        {{ isNotEmpty(slotProps.row.payAmount) ? slotProps.row.payAmount + "元" : '' }}
      </template>
      <template #expectPayback="slotProps">
        {{ isNotEmpty(slotProps.row.expectPayback) ? slotProps.row.expectPayback + "元" : '' }}
      </template>
      <template #actualPayback="slotProps">
        {{ isNotEmpty(slotProps.row.actualPayback) ? slotProps.row.actualPayback + "元" : '' }}
      </template>
      <template #orderPic="slotProps">
        <t-image
            v-if="isNotEmpty(slotProps.row.orderPic)"
            :src="slotProps.row.orderPic"
            fit="contain"
            class="imageStyle"
            @click="picOpen(slotProps.row.orderPic)"
        />
      </template>
      <template #finishPic="slotProps">
        <t-image
            v-if="isNotEmpty(slotProps.row.finishPic)"
            :src="slotProps.row.finishPic"
            fit="contain"
            class="imageStyle"
            @click="picOpen(slotProps.row.finishPic)"
        />
      </template>
      <template #status="slotProps">
        <t-tag :theme="declarationTagTheme(slotProps.row.status)" variant="light-outline" shape="round">
          {{ declarationStatus(slotProps.row.status) }}
        </t-tag>
      </template>
      <template #settings="slotProps">
        <div class="settingBtns">
          <t-button theme="warning" @click="editDeclaration(slotProps.row)">
            <template #icon>
              <t-icon name="edit"></t-icon>
            </template>
            编辑
          </t-button>
        </div>
      </template>
    </t-table>
  </t-card>

  <!--  编辑对话框  -->
  <t-dialog
      v-model:visible="editVisible"
      header="报单编辑"
      attach="body"
      :confirm-on-enter="true"
      :on-confirm="editConfirm"
  >
    <template #body>
      <t-form>
        <t-form-item label="商品">
          <t-input v-model="editFormData.commodity" readonly disabled/>
        </t-form-item>
        <t-form-item label="状态">
          <t-select
              v-model="editFormData.status"
              placeholder="-请选择状态-"
              :options="statusOptions"
          />
        </t-form-item>
        <t-form-item label="订单号">
          <t-input v-model="editFormData.orderId" placeholder="请输入订单号"/>
        </t-form-item>
        <t-form-item label="实付金额">
          <t-input type="number" v-model="editFormData.payAmount" placeholder="请输入实付金额" suffix="元"/>
        </t-form-item>
        <t-form-item label="备注">
          <t-textarea v-model="editFormData.notes" placeholder="请输入备注"/>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>

  <!-- 图片 -->
  <t-dialog v-model:visible="picDialog.visible" :footer="false">
    <t-image
        :src="picDialog.url"
        fit="contain"
    />
  </t-dialog>
</template>

<script setup lang="ts">
import {useSettingStore} from "@/store";
import {useRouter} from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";
import {prefix} from "@/config/global";
import {ALL_DECLARATION_TABLE_COLUMNS, BASE_URL} from "./constants";
import {request} from "@/utils/request";
import {dateStringToTimestamp, timestampToDateTime} from "@/utils/date";
import {declarationStatus, declarationTagTheme} from "@/utils/chargeStatus";
import {MessagePlugin} from "tdesign-vue-next";
import {isNotEmpty} from "../../../utils/validate";
import {setObjToUrlParams} from "@/utils/request/utils";
import {downloadFile} from "@/utils/files";

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
const tableContentWidth = ref("1500px");

// 报单日期范围
const reportDateRange = ref([])

/**
 * 表格相关
 */
const allDeclarationTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [],// 表格数据
  // 表格分页
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10
  }
});

// 商品选项
const goodsOptions = ref([])
// 状态选项
const statusOptions = reactive([
  {label: '已报单', value: 0},
  {label: '待审核', value: 1},
  {label: '待返款', value: 2},
  {label: '已返款', value: 3},
  {label: '已作废', value: 4}
])

// 编辑对话框
const editVisible = ref(false);

// 编辑表单
const editFormData = reactive({
  id: "",
  commodity: "",
  commodityId: "",
  status: "",
  orderId: "",
  payAmount: "",
  notes: ""
});

const currRequestBody = reactive({
  pageNo: 1, // 页
  pageItems: 10, // 条数
  orderId: "", // 订单号
  commodityId: "",// 商品id
  commodity: "",// 商品
  reporter: "",// 报单人
  startTime: "",
  endTime: "",
  status: "" // 全部-不传 已报单-0 待审核-1
})

// 图片预览
const picDialog = reactive({
  visible: false,
  url: ""
})

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(async () => {
  allDeclarationTable.pagination.current = currRequestBody.pageNo;
  allDeclarationTable.pagination.pageSize = currRequestBody.pageItems;
  await getTableData()
  await getAllCommodity()
});

/**
 * 操作钩子
 */
// 监听容器宽高变化
const resize = (resizeValue: any) => {
  console.log(resizeValue[0].contentRect);
  if (resizeValue[0].contentRect.width > 1500) {
    tableContentWidth.value = resizeValue[0].contentRect.width + "px";
  } else {
    tableContentWidth.value = "1500px";
  }
};
// 分页钩子
const allDeclarationTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
  currRequestBody.pageNo = curr.current;
  currRequestBody.pageItems = curr.pageSize;
  allDeclarationTable.pagination.current = currRequestBody.pageNo;
  allDeclarationTable.pagination.pageSize = currRequestBody.pageItems;
  getTableData();
};

/**
 * 业务相关
 */
const getTableData = async () => {
  allDeclarationTable.tableData = [];
  allDeclarationTable.tableLoading = true;
  request.post({
    url: BASE_URL.queryList,
    data: currRequestBody
  }).then(res => {
    allDeclarationTable.pagination.total = res.totalRows;
    allDeclarationTable.tableData = res.list;
    allDeclarationTable.tableData.map((item, index) => {
      item.index = (allDeclarationTable.pagination.current - 1) * allDeclarationTable.pagination.pageSize + index + 1;
      item.reportTime = timestampToDateTime(item.reportTime);
      item.applyPaybackTime = timestampToDateTime(item.applyPaybackTime);
    })
  }).catch(err => {
    MessagePlugin.error(err);
  }).finally(() => {
    allDeclarationTable.tableLoading = false;
  })
}

// 获取全部商品
const getAllCommodity = async () => {
  request.get({
    url: BASE_URL.listCommodity
  }).then(res => {
    res.map((item: { commodityName: any; commodityId: any; }) => {
      goodsOptions.value.push({
        label: item.commodityName,
        value: item.commodityId
      })
    })
  }).catch(err => {
    MessagePlugin.error(err);
  }).finally(() => {
  })
}

// 搜索
const searchData = async () => {
  allDeclarationTable.pagination.current = 1;
  allDeclarationTable.pagination.pageSize = 10;
  Object.assign(currRequestBody, {
    pageNo: allDeclarationTable.pagination.current,
    pageItems: allDeclarationTable.pagination.pageSize,
    startTime: isNotEmpty(reportDateRange.value[0]) ? dateStringToTimestamp(reportDateRange.value[0]) : null,
    endTime: isNotEmpty(reportDateRange.value[1]) ? dateStringToTimestamp(reportDateRange.value[1]) : null
  })
  await getTableData();
}

// 导出Excel
const exportExcel = () => {
  console.log(currRequestBody)
  let reportParams = {
    orderId: currRequestBody.orderId,
    commodity: currRequestBody.commodity,
    reporter: currRequestBody.reporter,
    startTime: isNotEmpty(currRequestBody.startTime) ? currRequestBody.startTime : "",
    endTime: isNotEmpty(currRequestBody.endTime) ? currRequestBody.endTime : "",
    status: isNotEmpty(currRequestBody.status) ? currRequestBody.status : ""
  }
  downloadFile(setObjToUrlParams(BASE_URL.downloadExcel, reportParams))
}

// 导出图片 0-下单图 1-完成图
const exportPic = (picFlag: number) => {
  console.log(currRequestBody)
  let reportParams = {
    orderId: currRequestBody.orderId,
    commodityId: currRequestBody.commodityId,
    reporter: currRequestBody.reporter,
    startTime: isNotEmpty(currRequestBody.startTime) ? currRequestBody.startTime : "",
    endTime: isNotEmpty(currRequestBody.endTime) ? currRequestBody.endTime : "",
    status: isNotEmpty(currRequestBody.status) ? currRequestBody.status : "",
    picFlag: picFlag
  }
  window.open("http://120.24.253.160:6700/smartReport" + setObjToUrlParams(BASE_URL.downloadPic, reportParams));
}

// 图片预览
const picOpen = (imageUrl: any) => {
  picDialog.url = imageUrl;
  picDialog.visible = true;
}

// 编辑报单
const editDeclaration = (row: any) => {
  Object.assign(editFormData, {
    id: row.id,
    commodity: row.commodity,
    commodityId: row.commodityId,
    status: row.status,
    orderId: row.orderId,
    payAmount: row.payAmount,
    notes: row.notes,
  });
  editVisible.value = true;
}

// 编辑对话框确认
const editConfirm = () => {
  console.log(editFormData);
  request.post({
    url: BASE_URL.edit,
    data: editFormData
  }).then(res => {
    console.log(res);
    MessagePlugin.success("编辑成功");
  }).catch(err => {
    MessagePlugin.error(err);
  }).finally(() => {
    editVisible.value = false;
    getTableData();
  })
}
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
      width: 190px;
      margin: 5px;
    }

    .rangeInputStyle {
      width: 390px;
    }
  }

  .tableStyle {
    width: 100%;
    margin-top: 10px;

    .imageStyle {
      width: 100%;
      height: 100px;
      max-height: 200px;
      margin: 10px;

      :hover {
        cursor: pointer;
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