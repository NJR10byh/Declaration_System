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
        row-key="id"
        hover
        stripe
        :pagination="waitRebateTable.pagination"
        :loading="waitRebateTable.tableLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        :horizontal-scroll-affixed-bottom="{ offsetBottom: 64, container: getContainer }"
        :pagination-affixed-bottom="{ offsetBottom: 0,container: getContainer }"
        @page-change="waitRebateTablePageChange"
        size="small"
        style="margin-top: 10px;"
    >
      <template #waitSettlementAmount="slotProps">
        <t-tag theme="primary" variant="light-outline">
          {{ slotProps.row.waitSettlementAmount }}
        </t-tag>
      </template>
      <template #settings="slotProps">
        <div class="settingBtns">
          <t-button theme="primary" @click="settlement(slotProps.row)">
            <template #icon>
              <t-icon name="money-circle"></t-icon>
            </template>
            结算
          </t-button>
        </div>
      </template>
    </t-table>
  </t-card>

  <!--  结算对话框  -->
  <t-dialog
      v-model:visible="settlementVisible"
      width="1000px"
      header="结算"
      attach="body"
      :confirm-on-enter="true"
  >
    <template #body>
      <t-space direction="vertical">
        <t-row>
          <t-col :span="12">
            <t-table
                class="tableStyle"
                :data="settlementTable.tableData"
                :columns="SETTLEMENT_TABLE_COLUMNS"
                row-key="id"
                hover
                stripe
                :pagination="settlementTable.pagination"
                :loading="settlementTable.tableLoading"
                @page-change="settlementTablePageChange"
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
                  <span style="font-weight: bold;">姓名：</span>{{ settlementAccount.name }}
                </t-list-item>
                <t-list-item>
                  <span style="font-weight: bold;">身份证号码：</span>{{ ID_card(settlementAccount.idCard) }}
                </t-list-item>
                <t-list-item>
                  <span style="font-weight: bold;">手机号：</span>{{ phone_number(settlementAccount.phone) }}
                </t-list-item>
                <t-list-item>
                  <span style="font-weight: bold;">支付宝账号：</span>{{ settlementAccount.aliPayAccount }}
                </t-list-item>
                <t-list-item>
                  <span style="font-weight: bold;">银行名称：</span>{{ settlementAccount.bank }}
                </t-list-item>
                <t-list-item>
                  <span style="font-weight: bold;">银行卡号：</span>{{ settlementAccount.account }}
                </t-list-item>
              </t-list>
            </t-card>
          </t-col>
          <t-col :span="6">
            <t-card title="收款码">
              <t-row justify="space-between">
                <t-image
                    src="https://tdesign.gtimg.com/demo/demo-image-1.png"
                    fit="contain"
                    :style="{ width: '200px', height: '200px' }"
                />
                <t-image
                    src="https://tdesign.gtimg.com/demo/demo-image-1.png"
                    fit="contain"
                    :style="{ width: '200px', height: '200px' }"
                />
              </t-row>
            </t-card>
          </t-col>
        </t-row>
      </t-space>
    </template>
    <template #footer>
      <t-button theme="default" @click="settlementVisible = false">取消</t-button>
      <t-button theme="primary" @click="pay('aliPay')">支付宝支付</t-button>
      <t-button theme="success" @click="pay('weChat')">微信支付</t-button>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {useSettingStore} from "@/store";
import {useRouter} from "vue-router";
import {prefix} from "@/config/global";
import {SETTLEMENT_TABLE_COLUMNS, WAIT_REBATE_TABLE_COLUMNS} from "./constants";
import {ID_card, phone_number} from "@/utils/antianaphylaxis";
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next";

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
const waitRebateTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [
    {
      index: 1,
      userName: "用户名称",
      declarationNum: 2,
      waitSettlementAmount: 1000
    },
    {
      index: 2,
      userName: "用户名称",
      declarationNum: 5,
      waitSettlementAmount: 3200
    }
  ],
  searchText: "",
  // 表格分页
  pagination: {
    total: 0,
    current: 1,
    pageSize: 20
  }
});

// 结算表格
const settlementTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [
    {
      index: 1,
      orderId: "0000001",
      goodsName: "商品1",
      relMoney: 13,
      preBackMoney: 1,
      remark: "备注",
      approvalRemark: "审批备注"
    },
    {
      index: 2,
      orderId: "0000002",
      goodsName: "商品2",
      relMoney: 234,
      preBackMoney: 12,
      remark: "备注",
      approvalRemark: "审批备注"
    }
  ],
  // 表格分页
  pagination: {
    total: 0,
    current: 1,
    pageSize: 20,
    showPageSize: false
  }
});

const settlementAccount = reactive({
  name: "张三",
  idCard: "320123199709210000",
  phone: "18908213728",
  aliPayAccount: "1890821",
  bank: "中国银行",
  account: "3213412323123",
});

// 结算对话框
const settlementVisible = ref(false);

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
const waitRebateTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
};

const settlementTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
};

/**
 * 业务相关
 */
// 结算
const settlement = (row: any) => {
  console.log("结算", row);
  settlementVisible.value = true;
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
      switch (method) {
        case "aliPay":
          console.log("支付宝支付");
          break;
        case "weChat":
          console.log("微信支付");
          break;
      }
      MessagePlugin.success("已支付")
      // 请求成功后，销毁弹框
      payConfirmDialog.destroy();
    },
    onClose: () => {
      payConfirmDialog.hide();
    },
  });
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
</style>