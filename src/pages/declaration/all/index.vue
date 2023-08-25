<!--
  * @author baoyuhao
  * @date 2023/8/4 13:55:41
  * @description 全部报单
  * @version 0.8.0
-->
<template>
  <t-card class="all-declaration-card">
    <t-row justify="start" class="cardTop">
      <div class="cardTitle">搜索条件</div>
    </t-row>
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
    </t-row>
  </t-card>
  <t-card class="all-declaration-card">
    <t-row justify="space-between" class="cardTop">
      <div>
        <t-button @click="searchData">
          <template #icon>
            <t-icon name="search"></t-icon>
          </template>
          查询
        </t-button>
      </div>
      <div>
        <t-button theme="success" @click="exportExcel">
          <template #icon>
            <t-icon name="file-excel"></t-icon>
          </template>
          导出Excel
        </t-button>
        <t-button theme="success" @click="exportPic(0)">
          <template #icon>
            <t-icon name="file-image"></t-icon>
          </template>
          导出下单图
        </t-button>
        <t-button theme="success" @click="exportPic(1)">
          <template #icon>
            <t-icon name="file-image"></t-icon>
          </template>
          导出完成图
        </t-button>
      </div>
    </t-row>
    <t-table
        class="tableStyle"
        :data="allDeclarationTable.tableData"
        :columns="ALL_DECLARATION_TABLE_COLUMNS"
        row-key="index"
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
      <template #orderId="slotProps">
        <t-tag theme="primary" variant="light-outline">
          {{ slotProps.row.orderId }}
        </t-tag>
      </template>
      <template #trackNum="slotProps">
        <t-tag theme="default">
          {{ isNotEmpty(slotProps.row.trackNum) ? slotProps.row.trackNum : "暂无" }}
        </t-tag>
      </template>
      <template #payAmount="slotProps">
        {{ slotProps.row.payAmount + "元" }}
      </template>
      <template #expectPayback="slotProps">
        {{ slotProps.row.expectPayback + "元" }}
      </template>
      <template #actualPayback="slotProps">
        {{ slotProps.row.actualPayback + "元" }}
      </template>
      <template #orderPic="slotProps">
        <div class="tdesign-demo-image-viewer__base">
          <t-image-viewer v-model:visible="orderPicVisible" :images="[slotProps.row.orderPic]">
            <template #trigger>
              <div class="tdesign-demo-image-viewer__ui-image">
                <img alt="test" :src="slotProps.row.orderPic" class="tdesign-demo-image-viewer__ui-image--img"/>
                <div class="tdesign-demo-image-viewer__ui-image--hover" @click="orderPicOpen">
                  <span><t-icon size="1.2em" name="browse"/> 预览</span>
                </div>
              </div>
            </template>
          </t-image-viewer>
        </div>
      </template>
      <template #finishPic="slotProps">
        <div class="tdesign-demo-image-viewer__base">
          <t-image-viewer v-model:visible="finishPicVisible" :images="[slotProps.row.finishPic]">
            <template #trigger>
              <div class="tdesign-demo-image-viewer__ui-image">
                <img alt="test" :src="slotProps.row.finishPic" class="tdesign-demo-image-viewer__ui-image--img"/>
                <div class="tdesign-demo-image-viewer__ui-image--hover" @click="finishPicOpen">
                  <span><t-icon size="1.2em" name="browse"/> 预览</span>
                </div>
              </div>
            </template>
          </t-image-viewer>
        </div>
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
          <t-input v-model="editFormData.status" readonly disabled/>
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
    pageSize: 20
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

// 下单图预览
const orderPicVisible = ref(false);
// 完成图预览
const finishPicVisible = ref(false);
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
  pageItems: 20, // 条数
  orderId: "", // 订单号
  commodityId: "",// 商品id
  commodity: "",// 商品
  reporter: "",// 报单人
  startTime: "",
  endTime: "",
  status: "" // 全部-不传 已报单-0 待审核-1
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
  allDeclarationTable.pagination.pageSize = 20;
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
    startTime: currRequestBody.startTime,
    endTime: currRequestBody.endTime,
    status: currRequestBody.status
  }
  downloadFile(setObjToUrlParams(BASE_URL.downloadExcel, reportParams))
}

// 导出图片 0-下单图 1-完成图
const exportPic = (picFlag: number) => {
  console.log(currRequestBody)
  let reportParams = {
    orderId: currRequestBody.orderId,
    commodity: currRequestBody.commodity,
    reporter: currRequestBody.reporter,
    startTime: currRequestBody.startTime,
    endTime: currRequestBody.endTime,
    status: currRequestBody.status,
    picFlag: picFlag
  }
  downloadFile(setObjToUrlParams(BASE_URL.downloadPic, reportParams))
}

// 下单图预览trigger
const orderPicOpen = () => {
  orderPicVisible.value = true;
}

// 完成图预览trigger
const finishPicOpen = () => {
  finishPicVisible.value = true;
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
  // editVisible.value = false;
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