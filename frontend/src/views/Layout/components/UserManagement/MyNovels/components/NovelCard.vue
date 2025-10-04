<template>
  <el-card class="novel-card" shadow="hover">
    <div class="novel-cover">
      <el-image :src="novel.cover || defaultCover" fit="cover" class="novel-image" />
      <el-tag :type="statusTagType" class="novel-status-tag" effect="dark">{{ novel.status }}</el-tag>
      <el-tag type="warning" class="novel-serialization-tag" effect="light">{{ novel.serializationStatus }}</el-tag>
    </div>
    <div class="novel-info">
      <h3 class="novel-title">{{ novel.title }}</h3>
      <div class="novel-tags">
        <el-tag 
          v-for="tag in novel.tags" 
          :key="tag" 
          size="small" 
          class="tag-item"
          :color="getTagColor(tag)"
          style="color: white;"
        >{{ tag }}</el-tag>
      </div>
      <div class="novel-stats">
        <span><el-icon><Document /></el-icon> {{ formattedWordCount }} 字</span>
        <span><el-icon><View /></el-icon> {{ formattedViews }}</span>
        <span><el-icon><Star /></el-icon> {{ formattedCollections }}</span>
      </div>
      <div class="last-updated">
        <el-icon><Clock /></el-icon>
        <span>最新更新: {{ novel.lastUpdated }}</span>
      </div>
    </div>
    <div class="novel-actions">
      <el-button type="primary" link @click="$emit('manage-chapters', novel.id)">管理章节</el-button>
      <el-dropdown>
        <el-button type="primary" link>
          更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="$emit('edit', novel.id)"><el-icon><Edit /></el-icon>编辑信息</el-dropdown-item>
            <el-dropdown-item @click="$emit('analytics', novel.id)"><el-icon><DataLine /></el-icon>数据分析</el-dropdown-item>
            <el-dropdown-item divided @click="$emit('delete', novel.id)" class="delete-item">
              <el-icon><Delete /></el-icon>删除作品
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue';
import { Document, View, Star, Clock, Edit, DataLine, Delete, ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
  novel: {
    type: Object,
    required: true,
  },
});

defineEmits(['manage-chapters', 'edit', 'analytics', 'delete']);

// 默认封面图
const defaultCover = 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png';

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num;
};

const formattedWordCount = computed(() => formatNumber(props.novel.wordCount));
const formattedViews = computed(() => formatNumber(props.novel.views));
const formattedCollections = computed(() => formatNumber(props.novel.collections));

// 状态标签类型
const statusTagType = computed(() => {
  switch (props.novel.status) {
    case '已发布': return 'success';
    case '草稿': return 'info';
    case '审核中': return 'warning';
    case '已下架': return 'danger';
    default: return 'primary';
  }
});

// --- 标签颜色 ---
const tagColors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#7B68EE', '#FF69B4'];
const getTagColor = (tag) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % tagColors.length);
  return tagColors[index];
};
</script>

<style scoped>
.novel-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.novel-cover {
  position: relative;
  width: 100%;
  height: 180px;
}

.novel-image {
  width: 100%;
  height: 100%;
}

.novel-status-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.novel-serialization-tag {
  position: absolute;
  top: 10px;
  left: 10px;
}

.novel-info {
  padding: 16px;
}

.novel-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.novel-tags {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-item {
  margin: 0;
  border: none; /* 移除 el-tag 的边框 */
}

.novel-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #909399;
  margin-bottom: 10px;
}

.novel-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.last-updated {
  font-size: 12px;
  color: #c0c4cc;
  display: flex;
  align-items: center;
  gap: 4px;
}

.novel-actions {
  border-top: 1px solid #ebeef5;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-item {
  color: #f56c6c;
}
.delete-item:hover {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style>
