<template>
  <t-row :gutter="16" class="row-container">
    <t-col :xs="12" :xl="8">
      <t-card title="近七天报单数" subtitle="(单)" class="dashboard-chart-card">
        <div
            id="stokeContainer"
            ref="stokeContainer"
            style="width: 100%; height: 350px"
            class="dashboard-chart-container"
        ></div>
      </t-card>
    </t-col>
    <t-col :xs="12" :xl="4">
      <t-card title="销售订单排名" class="dashboard-rank-card">
        <t-table :data="SALE_TEND_LIST" :columns="SALE_COLUMNS" row-key="productName">
          <template #index="{ rowIndex }">
            <t-tag v-if="rowIndex<=2" theme="danger">
              {{ rowIndex + 1 }}
            </t-tag>
            <t-tag v-else theme="default">
              {{ rowIndex + 1 }}
            </t-tag>
          </template>
        </t-table>
      </t-card>
    </t-col>
  </t-row>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, ref} from 'vue';

import * as echarts from 'echarts/core';
import {GridComponent, LegendComponent, TooltipComponent} from 'echarts/components';
import {LineChart, PieChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import {useSettingStore} from '@/store';
import {BASE_URL, SALE_COLUMNS} from '../constants';

import {constructInitDataset} from '../index';
import {LAST_7_DAYS} from "@/utils/date";
import {request} from "@/utils/request";

const SALE_TEND_LIST = ref([]);
let reportCountList: string[] = [];

echarts.use([TooltipComponent, LegendComponent, PieChart, GridComponent, LineChart, CanvasRenderer]);


const store = useSettingStore();
const resizeTime = ref(1);

const chartColors = computed(() => store.chartColors);

// stokeCharts
let stokeContainer: HTMLElement;
let stokeChart: echarts.ECharts;
const renderStokeChart = () => {
  if (!stokeContainer) {
    stokeContainer = document.getElementById('stokeContainer');
  }
  stokeChart = echarts.init(stokeContainer);
  console.log(reportCountList)
  stokeChart.setOption(constructInitDataset({
    dateTime: LAST_7_DAYS, reportCountList: reportCountList, ...chartColors.value
  }));
};

const renderCharts = async () => {
  renderStokeChart();
};

// chartSize update
const updateContainer = () => {
  if (document.documentElement.clientWidth >= 1400 && document.documentElement.clientWidth < 1920) {
    resizeTime.value = Number((document.documentElement.clientWidth / 2080).toFixed(2));
  } else if (document.documentElement.clientWidth < 1080) {
    resizeTime.value = Number((document.documentElement.clientWidth / 1080).toFixed(2));
  } else {
    resizeTime.value = 1;
  }

  stokeChart.resize({
    width: stokeContainer.clientWidth,
    height: stokeContainer.clientHeight,
  });
};

onMounted(async () => {
  window.addEventListener('resize', updateContainer, false);
  await getWeekStat();
  getReportRank();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateContainer);
});

// 获取近七天报单数
const getWeekStat = async () => {
  reportCountList = [];
  await request.get({
    url: BASE_URL.weekStat
  }).then(res => {
    res.map((i: { reportCount: number; }) => {
      reportCountList.push(i.reportCount.toString())
    })
    renderCharts();
  });
  await nextTick(() => {
    updateContainer();
  });
}

// 获取销售订单排名
const getReportRank = () => {
  SALE_TEND_LIST.value = [];
  request.get({
    url: BASE_URL.reportRank
  }).then((res) => {
    console.log(res)
    SALE_TEND_LIST.value = res;
  });
}
</script>

<style lang="less" scoped>
.dashboard-chart-card {
  padding: 8px;

  :deep(.t-card__header) {
    padding-bottom: 24px;
  }

  :deep(.t-card__title) {
    font-size: 20px;
    font-weight: 500;
  }
}

.dashboard-rank-card {
  padding: 8px;

  :deep(.t-card__header) {
    padding-bottom: 24px;
  }

  :deep(.t-card__title) {
    font-size: 20px;
    font-weight: 500;
  }
}
</style>
