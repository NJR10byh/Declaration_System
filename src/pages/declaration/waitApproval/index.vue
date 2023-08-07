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
      <t-input class="inputStyle" v-model="waitApprovalTable.searchText" placeholder="请输入订单号" clearable/>
      <t-select
          class="inputStyle"
          v-model="waitApprovalTable.searchText"
          placeholder="-请选择商品-"
          :options="goodsOptions"
          filterable
          clearable
      />
      <t-input class="inputStyle" v-model="waitApprovalTable.searchText" placeholder="请输入报单人" clearable/>
      <t-date-range-picker class="inputStyle rangeInputStyle" :placeholder="['报单日期 起', '报单日期 止']" clearable/>
      <t-button class="inputStyle" style="width: 100px;">
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
        row-key="id"
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
      <template #completePic="slotProps">
        <div class="tdesign-demo-image-viewer__base">
          <t-image-viewer v-model:visible="completePicVisible" :images="[slotProps.row.completePic]">
            <template #trigger>
              <div class="tdesign-demo-image-viewer__ui-image">
                <img alt="test" :src="slotProps.row.completePic" class="tdesign-demo-image-viewer__ui-image--img"/>
                <div class="tdesign-demo-image-viewer__ui-image--hover" @click="completePicOpen">
                  <span><t-icon size="1.2em" name="browse"/> 预览</span>
                </div>
              </div>
            </template>
          </t-image-viewer>
        </div>
      </template>
      <template #orderStatus="slotProps">
        <t-tag theme="warning" variant="light-outline" shape="round">
          {{ slotProps.row.orderStatus }}
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
</template>

<script setup lang="ts">
import {useSettingStore} from "@/store";
import {useRouter} from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";
import {prefix} from "@/config/global";
import {WAIT_APPROVAL_TABLE_COLUMNS} from "./constants";
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
const waitApprovalTable = reactive({
  tableLoading: false,// 表格加载
  tableData: [
    {
      index: 1,
      orderId: "123456789",
      goodsName: "商品名称",
      declarationPerson: "报单人",
      wechatName: "微信名",
      relMoney: "1000",
      preBackMoney: "800",
      relBackMoney: "700",
      backMoneyTime: "2023-08-01",
      declarateTime: "2023-08-02",
      orderStatus: "待审核",
      orderPic: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1eRF4j.img?w=1920&h=1080&q=60&m=2&f=jpg",
      completePic: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1eRF4j.img?w=1920&h=1080&q=60&m=2&f=jpg",
      operation: "操作"
    },
    {
      index: 1,
      orderId: "123456789",
      goodsName: "加长商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称",
      declarationPerson: "报单人",
      wechatName: "微信名",
      relMoney: "1000",
      preBackMoney: "800",
      relBackMoney: "700",
      backMoneyTime: "2023-08-01",
      declarateTime: "2023-08-02",
      orderStatus: "待审核",
      orderPic: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1eRF4j.img?w=1920&h=1080&q=60&m=2&f=jpg",
      completePic: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1eRF4j.img?w=1920&h=1080&q=60&m=2&f=jpg",
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

// 商品选项
const goodsOptions = reactive([
  {label: '选项一', value: '1'},
  {label: '选项二', value: '2'},
  {label: '选项三', value: '3'},
  {label: 'option4', value: '4'},
  {label: 'OPTION5', value: '5'}
])
// 状态选项
const statusOptions = reactive([
  {label: '全部', value: '0'},
  {label: '审核中', value: '1'},
  {label: '已审核', value: '2'}
])

// 下单图预览
const orderPicVisible = ref(false);
// 完成图预览
const completePicVisible = ref(false);
// 编辑对话框
const editVisible = ref(false);

// 编辑表单
const editFormData = reactive({
  goodsName: "",
  orderStatus: "",
  orderId: "",
  relMoney: "",
  remark: ""
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
const waitApprovalTablePageChange = (curr: any) => {
  console.log("分页变化", curr);
};

/**
 * 业务相关
 */
// 下单图预览trigger
const orderPicOpen = () => {
  orderPicVisible.value = true;
}

// 完成图预览trigger
const completePicOpen = () => {
  completePicVisible.value = true;
}

// 审批通过
const approved = (row: any) => {
  console.log(row);
}

// 作废
const cancel = (row: any) => {
  console.log(row);
  const confirmDia = DialogPlugin.confirm({
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
      MessagePlugin.success("已作废")
      // 请求成功后，销毁弹框
      confirmDia.destroy();
    },
    onClose: () => {
      confirmDia.hide();
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