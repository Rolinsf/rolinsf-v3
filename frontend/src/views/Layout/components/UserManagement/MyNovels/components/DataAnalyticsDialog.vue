<template>
  <el-dialog
    :model-value="visible"
    title="小说数据分析"
    width="60%"
    @update:model-value="$emit('update:visible', $event)"
  >
    <div v-if="novel" class="analytics-container">
      <el-descriptions :title="`《${novel.title}》核心指标`" :column="2" border>
        <el-descriptions-item label="作品编号">{{ novel.id }}</el-descriptions-item>
        <el-descriptions-item label="最后更新时间">{{ novel.lastUpdated }}</el-descriptions-item>
        <el-descriptions-item label="总字数">
          <el-tag size="small">{{ novel.wordCount.toLocaleString() }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发布状态">
          <el-tag :type="getStatusType(novel.status)" size="small">{{ novel.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="总阅读量">
          <span class="metric-value">{{ novel.views.toLocaleString() }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="总收藏数">
          <span class="metric-value">{{ novel.collections.toLocaleString() }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="连载状态">{{ novel.serializationStatus }}</el-descriptions-item>
        <el-descriptions-item label="类型标签">
          <el-tag
            v-for="tag in novel.tags"
            :key="tag"
            :color="getTagColor(tag)"
            size="small"
            style="color: white; margin-right: 5px;"
          >
            {{ tag }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider>图表分析</el-divider>
      
      <div class="chart-container">
        <v-chart class="chart" :option="chartOption" autoresize />
      </div>

    </div>
    <div v-else>
      <el-empty description="暂无数据" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="$emit('update:visible', false)">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);


const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  novel: {
    type: Object,
    default: () => null,
  },
});

defineEmits(['update:visible']);

// --- 模拟图表数据 ---
const chartOption = computed(() => {
  if (!props.novel) return {};

  // 模拟过去7天的数据
  const dates = Array.from({ length: 7 }, (_, i) => `10-${i + 1}`);
  const viewsData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000) + 50);
  const collectionsData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 5);

  return {
    title: {
      text: '近7日数据趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['阅读量', '收藏量'],
      top: 30,
    },
    grid: {
      top: 70,
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '阅读量',
        type: 'line',
        stack: '总量',
        data: viewsData,
        smooth: true,
        areaStyle: {},
      },
      {
        name: '收藏量',
        type: 'line',
        stack: '总量',
        data: collectionsData,
        smooth: true,
        areaStyle: {},
      },
    ],
  };
});


const getStatusType = (status) => {
  switch (status) {
    case '已发布':
      return 'success';
    case '草稿':
      return 'info';
    case '审核中':
      return 'warning';
    case '已下架':
      return 'danger';
    default:
      return 'info';
  }
};

const tagColors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'];
const getTagColor = (tag) => {
  if (!tag) return '#909399';
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % tagColors.length);
  return tagColors[index];
};

</script>

<style scoped>
.analytics-container {
  padding: 0 20px;
}
.metric-value {
  font-weight: bold;
  color: #E6A23C;
  font-size: 16px;
}
.chart-placeholder {
  text-align: center;
  color: #909399;
  padding: 40px 0;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  margin-top: 20px;
}
.chart-container {
  height: 400px;
  width: 100%;
}
.chart {
  height: 100%;
  width: 100%;
}
.dialog-footer {
  text-align: right;
}
</style>
