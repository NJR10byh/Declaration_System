<!--
  * @author baoyuhao
  * @date 2023/8/4 13:58:24
  * @description 待返款
  * @version 0.8.0
-->
<template>
  <t-card class="wait-rebate-table">
    <t-table
        class="tableStyle"
        :data="waitRebateTable.tableData"
        :columns="WAIT_REBATE_TABLE_COLUMNS"
        row-key="index"
        hover
        :pagination="waitRebateTable.pagination"
        :loading="waitRebateTable.tableLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: 64, container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: 0,container: getContainer }"
        @page-change="waitRebateTablePageChange"
        size="small"
        style="margin-top: 10px;"
    >
      <template #paybackAmount="slotProps">
        <t-tag theme="primary" variant="light-outline">
          {{ slotProps.row.paybackAmount }}
        </t-tag>
      </template>
      <template #settings="slotProps">
        <div class="settingBtns">
          <t-button theme="primary" @click="payDetail(slotProps.row)">
            <template #icon>
              <t-icon name="wallet"></t-icon>
            </template>
            结算
          </t-button>
        </div>
      </template>
    </t-table>
  </t-card>

  <!--  结算对话框  -->
  <t-dialog
      v-model:visible="payDetailVisible"
      width="1000px"
      header="结算"
      attach="body"
      class="payDetailStyle"
      :confirm-on-enter="true"
      z-index="1999"
  >
    <template #body>
      <t-space direction="vertical">
        <t-row>
          <t-col :span="12">
            <t-table
                class="tableStyle"
                :data="payDetailTable.tableData"
                :columns="PAY_DETAIL_TABLE_COLUMNS"
                row-key="index"
                hover
                stripe
                :loading="payDetailTable.tableLoading"
                :foot-data="payDetailTable.footData"
                size="small"
            >
              <template #orderId="slotProps">
                <t-tag theme="primary" variant="light-outline">
                  {{ slotProps.row.orderId }}
                </t-tag>
              </template>
            </t-table>
          </t-col>
        </t-row>
        <t-row justify="space-between">
          <t-col :span="5">
            <t-card title="账户信息">
              <t-list :split="true">
                <t-list-item>
                  <span style="font-weight: bold;">姓名：</span>{{ payDetailTable.accountInfo.userName }}
                </t-list-item>
                <t-list-item>
                  <span style="font-weight: bold;">手机号：</span>{{ payDetailTable.accountInfo.phoneNum }}
                </t-list-item>
                <t-list-item>
                  <span style="font-weight: bold;">支付宝账号：</span>{{ payDetailTable.accountInfo.zfbNum }}
                </t-list-item>
                <t-list-item>
                  <span style="font-weight: bold;">银行名称：</span>{{ payDetailTable.accountInfo.bankName }}
                </t-list-item>
                <t-list-item>
                  <span style="font-weight: bold;">银行卡号：</span>{{ payDetailTable.accountInfo.bankNum }}
                </t-list-item>
              </t-list>
            </t-card>
          </t-col>
          <t-col :span="6">
            <t-card title="收款码">
              <t-row justify="space-between">
                <t-image
                    :src="payDetailTable.accountInfo.wxPic"
                    fit="contain"
                    class="imageStyle"
                    @click="picOpen(payDetailTable.accountInfo.wxPic)"
                />
                <t-image
                    :src="payDetailTable.accountInfo.zfbPic"
                    fit="contain"
                    class="imageStyle"
                    @click="picOpen(payDetailTable.accountInfo.zfbPic)"
                />
              </t-row>
            </t-card>
          </t-col>
        </t-row>
      </t-space>
    </template>
    <template #footer>
      <t-button theme="default" @click="payDetailVisible = false">取消</t-button>
      <t-button theme="primary" @click="pay('bankCard')">银行卡支付</t-button>
      <t-button theme="primary" @click="pay('aliPay')">支付宝支付</t-button>
      <t-button theme="success" @click="pay('weChat')">微信支付</t-button>
    </template>
  </t-dialog>

  <!-- 图片 -->
  <t-dialog v-model:visible="picDialog.visible" :footer="false" z-index="2000">
    <t-image
        :src="picDialog.url"
        fit="contain"
    />
  </t-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {useSettingStore, useUserStore} from "@/store";
import {useRouter} from "vue-router";
import {prefix} from "@/config/global";
import {BASE_URL, PAY_DETAIL_TABLE_COLUMNS, WAIT_REBATE_TABLE_COLUMNS} from "./constants";
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next";
import {request} from "@/utils/request";
import {setObjToUrlParams} from "@/utils/request/utils";

const store = useSettingStore();
const router = useRouter();

const userStore = useUserStore();
const {userInfo} = userStore;


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

// 图片预览
const picDialog = reactive({
  visible: false,
  url: ""
})

/**
 * 表格相关
 */
// 待返款表格
const waitRebateTable = reactive({
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

// 结算表格
const payDetailTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [],
  accountInfo: {
    userName: "张三",
    phoneNum: "18908213728",
    bankName: "中国银行",
    bankNum: "3213412323123",
    wxPic: "",
    zfbPic: "",
    zfbNum: ""
  },
  footData: [
    {
      index: '合计',
      shouldPayback: "0",
    },
  ]
});

// 结算对话框
const payDetailVisible = ref(false);

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
const currReportId = ref("")

/**
 * methods区
 */
/* 生命周期 */
// 组件挂载完成后执行
onMounted(() => {
  waitRebateTable.pagination.current = currRequestBody.pageNo;
  waitRebateTable.pagination.pageSize = currRequestBody.pageItems;
  getTableData()
});

/**
 * 操作钩子
 */
// 分页钩子
const waitRebateTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
  currRequestBody.pageNo = curr.current;
  currRequestBody.pageItems = curr.pageSize;
  waitRebateTable.pagination.current = currRequestBody.pageNo;
  waitRebateTable.pagination.pageSize = currRequestBody.pageItems;
  getTableData();
};

/**
 * 业务相关
 */
const getTableData = () => {
  waitRebateTable.tableData = [];
  waitRebateTable.tableLoading = true;
  request.post({
    url: BASE_URL.listStat,
    data: currRequestBody
  }).then(res => {
    waitRebateTable.pagination.total = res.totalRows;
    waitRebateTable.tableData = res.list;
    waitRebateTable.tableData.map((item, index) => {
      item.index = (waitRebateTable.pagination.current - 1) * waitRebateTable.pagination.pageSize + index + 1;
      item.paybackAmount += " 元";
    })
  }).catch(err => {
  }).finally(() => {
    waitRebateTable.tableLoading = false;
  })
}
// 结算
const payDetail = (row: any) => {
  console.log("结算", row);
  payDetailTable.tableData = [];
  payDetailTable.tableLoading = true;
  payDetailVisible.value = true;
  currReportId.value = row.reporterId;
  let params = {
    reporterId: row.reporterId
  }
  request.post({
    url: setObjToUrlParams(BASE_URL.payDetail, params)
  }).then(res => {
    payDetailTable.tableData = res.payDetailList;
    payDetailTable.tableData.map((item, index) => {
      item.index = index + 1;
      item.payAmount += " 元";
      item.shouldPayback += " 元";
    })
    Object.assign(payDetailTable.accountInfo, {
      userName: res.userName,
      phoneNum: res.phoneNum,
      bankName: res.bankName,
      bankNum: res.bankNum,
      wxPic: res.wxPic,
      zfbPic: res.zfbPic,
      zfbNum: res.zfbNum
    })
    Object.assign(payDetailTable.footData[0], {
      shouldPayback: res.total + " 元"
    })
  }).catch(err => {
    MessagePlugin.error(err.message)
  }).finally(() => {
    payDetailTable.tableLoading = false;
    getTableData();
  })
}

// 支付
const pay = (method: any) => {
  const payConfirmDialog = DialogPlugin.confirm({
    header: '提示',
    theme: "warning",
    body: '确定要支付吗？',
    confirmBtn: '确认支付',
    cancelBtn: '取消',
    onConfirm: () => {
      console.log(userStore.userInfo)
      let params = {
        reporterId: currReportId.value,
        payWay: 0
      }
      switch (method) {
        case "bankCard":
          params.payWay = 0;
          break;
        case "aliPay":
          params.payWay = 1;
          break;
        case "weChat":
          params.payWay = 2;
          break;
      }
      request.post({
        url: setObjToUrlParams(BASE_URL.settle, params)
      }).then(res => {
        console.log(res)
        MessagePlugin.success("支付成功")
        // 请求成功后，销毁弹框
        payConfirmDialog.destroy();
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // 请求成功后，销毁弹框
        payConfirmDialog.destroy();
        payDetailVisible.value = false;
        getTableData();
      });
    },
    onClose: () => {
      payConfirmDialog.hide();
    },
  });
}

// 图片预览
const picOpen = (imageUrl: any) => {
  picDialog.url = imageUrl;
  picDialog.visible = true;
}
</script>

<style lang="less" scoped>
.wait-rebate-table {
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

.payDetailStyle {

  .imageStyle {
    width: 200px;
    height: 200px;

    :hover {
      cursor: pointer;
    }
  }
}
</style>