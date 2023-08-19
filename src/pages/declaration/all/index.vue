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
      <t-input class="inputStyle" v-model="allDeclarationTable.searchText" placeholder="请输入订单号" clearable/>
      <t-select
          class="inputStyle"
          v-model="allDeclarationTable.searchText"
          placeholder="-请选择商品-"
          :options="goodsOptions"
          filterable
          clearable
      />
      <t-select
          class="inputStyle"
          v-model="allDeclarationTable.searchText"
          placeholder="-请选择订单状态-"
          :options="statusOptions"
          filterable
          clearable
      />
      <t-input class="inputStyle" v-model="allDeclarationTable.searchText" placeholder="请输入报单人" clearable/>
      <t-input class="inputStyle" v-model="allDeclarationTable.searchText" placeholder="请输入微信名" clearable/>
      <t-date-range-picker class="inputStyle rangeInputStyle" :placeholder="['报单日期 起', '报单日期 止']" clearable/>
    </t-row>
  </t-card>
  <t-card class="all-declaration-card">
    <t-row justify="space-between" class="cardTop">
      <div>
        <t-button>
          <template #icon>
            <t-icon name="search"></t-icon>
          </template>
          查询
        </t-button>
      </div>
      <div>
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
      </div>
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
        <t-tag theme="success" variant="light-outline" shape="round">
          {{ slotProps.row.orderStatus }}
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
          <t-button theme="primary">
            <template #icon>
              <t-icon name="file"></t-icon>
            </template>
            日志
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
          <t-select
              v-model="editFormData.goodsName"
              placeholder="-请选择商品-"
              :options="goodsOptions"
              filterable
              clearable
          />
        </t-form-item>
        <t-form-item label="状态">
          <t-select
              v-model="editFormData.orderStatus"
              placeholder="-请选择状态-"
              :options="statusOptions"
              filterable
              clearable
          />
        </t-form-item>
        <t-form-item label="订单号">
          <t-input v-model="editFormData.orderId" placeholder="请输入订单号"/>
        </t-form-item>
        <t-form-item label="实付金额">
          <t-input v-model="editFormData.relMoney" placeholder="请输入实付金额" suffix="元"/>
        </t-form-item>
        <t-form-item label="备注">
          <t-textarea v-model="editFormData.remark" placeholder="请输入备注"/>
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
import {ALL_DECLARATION_TABLE_COLUMNS} from "./constants";

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
const allDeclarationTable = reactive({
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
      orderStatus: "已审核",
      orderPic: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1eRF4j.img?w=1920&h=1080&q=60&m=2&f=jpg",
      completePic: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1eRF4j.img?w=1920&h=1080&q=60&m=2&f=jpg",
    },
    {
      index: 2,
      orderId: "123456789",
      goodsName: "加长商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称",
      declarationPerson: "报单人",
      wechatName: "微信名",
      relMoney: "1000",
      preBackMoney: "800",
      relBackMoney: "700",
      backMoneyTime: "2023-08-01",
      declarateTime: "2023-08-02",
      orderStatus: "审核中",
      orderPic: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1eRF4j.img?w=1920&h=1080&q=60&m=2&f=jpg",
      completePic: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1eRF4j.img?w=1920&h=1080&q=60&m=2&f=jpg",
    }
  ],// 表格数据
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
const allDeclarationTablePageChange = (curr: any) => {
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

// 编辑报单
const editDeclaration = (row: any) => {
  console.log(row);
  Object.assign(editFormData, {
    goodsName: row.goodsName,
    orderStatus: row.orderStatus,
    orderId: row.orderId,
    relMoney: row.relMoney,
    remark: row.remark,
  });
  editVisible.value = true;
}

// 编辑对话框确认
const editConfirm = () => {
  editVisible.value = false;
  console.log(editFormData);

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