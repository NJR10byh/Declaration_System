<!--
  * @author baoyuhao
  * @date 2023/8/4 13:57:19
  * @description 待审核
  * @version 0.8.0
-->
<template>
  <t-card class="wait-approval-card">
    <t-row justify="start" class="cardTop">
      <div class="cardTitle">搜索条件</div>
    </t-row>
    <t-row justify="start" class="cardTop">
      <t-input class="inputStyle" v-model="currRequestBody.orderId" placeholder="请输入订单号" clearable/>
      <t-select
          class="inputStyle"
          v-model="currRequestBody.commodity"
          placeholder="-请选择商品-"
          :options="goodsOptions"
          filterable
          clearable
      />
      <t-input class="inputStyle" v-model="currRequestBody.reporter" placeholder="请输入报单人" clearable/>
      <t-date-range-picker v-model="reportDateRange" class="inputStyle rangeInputStyle"
                           :placeholder="['报单时间 起', '报单时间 止']" enable-time-picker clearable/>
      <t-button class="inputStyle" style="width: 100px;" @click="searchData">
        <template #icon>
          <t-icon name="search"></t-icon>
        </template>
        查询
      </t-button>
    </t-row>
  </t-card>
  <t-card class="wait-approval-card">
    <t-table
        class="tableStyle"
        :data="waitApprovalTable.tableData"
        :columns="WAIT_APPROVAL_TABLE_COLUMNS"
        row-key="index"
        hover
        stripe
        table-content-width="1600"
        :pagination="waitApprovalTable.pagination"
        :loading="waitApprovalTable.tableLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: 64, container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: 0,container: getContainer }"
        @page-change="waitApprovalTablePageChange"
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
        <t-tag theme="warning" variant="light-outline" shape="round">
          {{ declarationStatus(slotProps.row.status) }}
        </t-tag>
      </template>
      <template #settings="slotProps">
        <div class="settingBtns">
          <t-button theme="success" @click="approved(slotProps.row)">
            <template #icon>
              <t-icon name="check-circle"></t-icon>
            </template>
            审批通过
          </t-button>
          <t-button theme="danger" @click="cancel(slotProps.row)">
            <template #icon>
              <t-icon name="delete"></t-icon>
            </template>
            作废
          </t-button>
        </div>
      </template>
    </t-table>
  </t-card>

  <!-- 审批通过Dialog -->
  <t-dialog
      v-model:visible="approvedVisible"
      header="审批通过"
      theme="warning"
      attach="body"
      :confirm-on-enter="true"
      :on-confirm="approvedConfirm"
  >
    <template #body>
      <div>确定要审批通过吗？</div>
      <t-input style="margin-top: 10px;" v-model="approvedData.examineNotes" placeholder="审批通过请填写备注"/>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import {useSettingStore} from "@/store";
import {useRouter} from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";
import {prefix} from "@/config/global";
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next";
import {request} from "@/utils/request";
import {BASE_URL} from "./constants";
import {dateStringToTimestamp, timestampToDateTime} from "@/utils/date";
import {declarationStatus} from "@/utils/chargeStatus";
import {WAIT_APPROVAL_TABLE_COLUMNS} from "@/pages/declaration/waitApproval/constants";
import {isNotEmpty} from "../../../utils/validate";

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

// 报单时间范围
const reportDateRange = ref([])

/**
 * 表格相关
 */
const waitApprovalTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [],
  // 表格分页
  pagination: {
    total: 0,
    current: 1,
    pageSize: 20
  }
});

// 商品选项
const goodsOptions = ref([])

// 下单图预览
const orderPicVisible = ref(false);
// 完成图预览
const finishPicVisible = ref(false);

// 审批通过Dialog
const approvedVisible = ref(false);
const approvedData = reactive({
  id: "",
  status: 2,
  examineNotes: ""
});

const currRequestBody = reactive({
  pageNo: 1, // 页
  pageItems: 20, // 条数
  orderId: "", // 订单号
  commodity: "",// 商品名称
  reporter: "",// 报单人
  startTime: null,
  endTime: null,
  status: 1 // 全部-不传 已报单-0 待审核-1
})

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(async () => {
  waitApprovalTable.pagination.current = currRequestBody.pageNo;
  waitApprovalTable.pagination.pageSize = currRequestBody.pageItems;
  await getTableData()
  await getAllCommodity()
});

/**
 * 操作钩子
 */
// 分页钩子
const waitApprovalTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
  currRequestBody.pageNo = curr.current;
  currRequestBody.pageItems = curr.pageSize;
  waitApprovalTable.pagination.current = currRequestBody.pageNo;
  waitApprovalTable.pagination.pageSize = currRequestBody.pageItems;
  getTableData();
};

/**
 * 业务相关
 */
const getTableData = async () => {
  waitApprovalTable.tableData = [];
  waitApprovalTable.tableLoading = true;
  request.post({
    url: BASE_URL.queryList,
    data: currRequestBody
  }).then(res => {
    waitApprovalTable.pagination.total = res.totalRows;
    waitApprovalTable.tableData = res.list;
    waitApprovalTable.tableData.map((item, index) => {
      item.index = (waitApprovalTable.pagination.current - 1) * waitApprovalTable.pagination.pageSize + index + 1;
      item.reportTime = timestampToDateTime(item.reportTime);
      item.applyPaybackTime = timestampToDateTime(item.applyPaybackTime);
    })
  }).catch(err => {
    MessagePlugin.error(err);
  }).finally(() => {
    waitApprovalTable.tableLoading = false;
  })
}

// 获取全部商品
const getAllCommodity = async () => {
  request.get({
    url: BASE_URL.listCommodity
  }).then(res => {
    console.log(res);
    res.map((item: { commodityName: any; }) => {
      goodsOptions.value.push({
        label: item.commodityName,
        value: item.commodityName
      })
    })
  }).catch(err => {
    MessagePlugin.error(err);
  }).finally(() => {
  })
}

// 搜索
const searchData = async () => {
  waitApprovalTable.pagination.current = 1;
  waitApprovalTable.pagination.pageSize = 20;
  Object.assign(currRequestBody, {
    pageNo: waitApprovalTable.pagination.current,
    pageItems: waitApprovalTable.pagination.pageSize,
    startTime: dateStringToTimestamp(reportDateRange.value[0]),
    endTime: dateStringToTimestamp(reportDateRange.value[1])
  })
  await getTableData();
}

// 下单图预览trigger
const orderPicOpen = () => {
  orderPicVisible.value = true;
}

// 完成图预览trigger
const finishPicOpen = () => {
  finishPicVisible.value = true;
}

// 审批通过
const approved = (row: any) => {
  Object.assign(approvedData, {
    id: row.id,
    status: 2,
    examineNotes: ""
  })
  approvedVisible.value = true;
}
const approvedConfirm = () => {
  request.post({
    url: BASE_URL.examine,
    data: approvedData
  }).then(res => {
    MessagePlugin.success("审批通过")
  }).catch(err => {
    MessagePlugin.error(err);
  }).finally(() => {
    approvedVisible.value = false;
    getTableData()
  })
}


// 作废
const cancel = (row: any) => {
  console.log(row);
  const cancelConfirmDialog = DialogPlugin.confirm({
    header: '提示',
    theme: "warning",
    body: '确定要作废吗？',
    confirmBtn: {
      content: '确认',
      variant: 'base',
      theme: 'danger',
    },
    cancelBtn: '取消',
    onConfirm: () => {
      Object.assign(approvedData, {
        id: row.id,
        status: 4,
        examineNotes: ""
      })
      request.post({
        url: BASE_URL.examine,
        data: approvedData
      }).then(res => {
        MessagePlugin.success("已作废")
      }).catch(err => {
        MessagePlugin.error(err);
      }).finally(() => {
        // 销毁弹框
        cancelConfirmDialog.destroy();
        getTableData()
      })
    },
    onClose: () => {
      cancelConfirmDialog.hide();
    },
  });
}
</script>

<style scoped lang="less">
.wait-approval-card {
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