<template>
  <div class="tree-container">
    <el-tree
      ref="treeRef"
      :data="filteredTreeData"
      :props="defaultProps"
      node-key="id"
      :expand-on-click-node="false"
      :default-expand-all="true"
      show-checkbox
      @node-click="$emit('node-click', $event)"
      @node-contextmenu="handleContextMenu"
      @check-change="$emit('check-change', $event)"
      @check="$emit('check', $event)"
    >
      <template #default="{ node, data }">
        <div class="tree-node-content">
          <!-- 第一行：标题行 -->
          <div class="node-title-row">
            <el-tag
              v-if="!data.isVolume && data.status"
              :type="data.status === 'published' ? 'success' : 'warning'"
              size="small"
              class="status-tag"
            >
              {{ data.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
            <span class="node-index" v-if="!data.isVolume">{{ getChapterIndex(data) }}.</span>
            <span class="node-title">{{ node.label }}</span>
          </div>
          
          <!-- 第二行：时间信息行 -->
          <div class="node-info-row">
            <span class="node-info">
              <span v-if="!data.isVolume && data.wordCount">{{ data.wordCount }}字</span>
              <span v-if="!data.isVolume && data.publishDate">{{ formatDate(data.publishDate) }}</span>
            </span>
          </div>
          
          <!-- 第三行：操作按钮行 -->
          <div class="node-actions-row">
            <el-button 
              v-if="data.isVolume"
              size="small" 
              type="primary" 
              link 
              @click.stop="$emit('add-chapter', data)"
            >
              <el-icon><Plus /></el-icon> 添加章节
            </el-button>
            <el-button 
              size="small" 
              type="primary" 
              link 
              @click.stop="$emit('edit-node', data)"
            >
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button 
              v-if="!data.isVolume"
              size="small" 
              type="success" 
              link 
              @click.stop="$emit('publish-chapter', data)"
              :disabled="data.status === 'published'"
            >
              <el-icon><Check /></el-icon> 发布
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              link 
              @click.stop="$emit('delete-node', data)"
            >
              <el-icon><Delete /></el-icon> 删除
            </el-button>
            <el-button 
              v-if="!data.isVolume"
              size="small" 
              link 
              @click.stop="$emit('move-up', data, node)"
              :disabled="isFirstChapterInVolume(data)"
            >
              <el-icon><Top /></el-icon> 上移
            </el-button>
            <el-button 
              v-if="!data.isVolume"
              size="small" 
              link 
              @click.stop="$emit('move-down', data, node)"
              :disabled="isLastChapterInVolume(data)"
            >
              <el-icon><Bottom /></el-icon> 下移
            </el-button>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Edit, Delete, Check, Top, Bottom } from '@element-plus/icons-vue'

const props = defineProps({
  treeData: {
    type: Array,
    default: () => []
  },
  searchKeyword: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['node-click', 'check-change', 'check', 'add-chapter', 'edit-node', 'publish-chapter', 'delete-node', 'move-up', 'move-down', 'context-menu'])

const treeRef = ref(null)
const defaultProps = {
  children: 'chapters',
  label: 'title'
}

// 获取章节序号
const getChapterIndex = (chapter) => {
  let index = 0
  for (const volume of props.treeData) {
    for (const c of volume.chapters) {
      index++
      if (c.id === chapter.id) {
        return index
      }
    }
  }
  return 0
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 检查是否是卷中的第一个章节
const isFirstChapterInVolume = (chapter) => {
  for (const volume of props.treeData) {
    if (volume.chapters && volume.chapters.length > 0) {
      if (volume.chapters[0].id === chapter.id) {
        return true
      }
    }
  }
  return false
}

// 检查是否是卷中的最后一个章节
const isLastChapterInVolume = (chapter) => {
  for (const volume of props.treeData) {
    if (volume.chapters && volume.chapters.length > 0) {
      if (volume.chapters[volume.chapters.length - 1].id === chapter.id) {
        return true
      }
    }
  }
  return false
}

// 过滤后的树数据
const filteredTreeData = computed(() => {
  if (!props.searchKeyword.trim()) return props.treeData
  
  return props.treeData.map(volume => {
    const matchingChapters = volume.chapters.filter(chapter => 
      chapter.title.toLowerCase().includes(props.searchKeyword.toLowerCase())
    )
    
    if (volume.title.toLowerCase().includes(props.searchKeyword.toLowerCase())) {
      // 如果卷名匹配，返回该卷的所有章节
      return { ...volume }
    } else if (matchingChapters.length > 0) {
      // 如果章节名匹配，只返回匹配的章节
      return {
        ...volume,
        chapters: matchingChapters
      }
    }
    return null
  }).filter(Boolean)
})

// 右键菜单事件
const handleContextMenu = (e, data) => {
  e.preventDefault()
  // 设置临时属性用于右键菜单
  if (!data.isVolume) {
    data.isFirst = isFirstChapterInVolume(data)
    data.isLast = isLastChapterInVolume(data)
  }
  emit('context-menu', { event: e, data })
}
</script>

<style scoped>
.tree-container {
  max-height: 100%;
  overflow-y: auto;
  padding: 10px;
}

.tree-node-content {
  display: flex;
  align-items: flex-start;
  padding: 8px 0;
  gap: 10px;
}

/* 三行布局容器 */
.node-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 第一行：标题行 */
.node-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.node-index {
  font-weight: 500;
}

.node-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-tag {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

/* 第二行：信息行 */
.node-info-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.node-info {
  color: #909399;
  font-size: 13px;
}

.edited-tag {
  color: #409EFF;
  font-size: 12px;
}

/* 第三行：操作按钮行 */
.node-actions-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.node-actions-row .el-button {
  padding: 4px 8px;
  font-size: 12px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .tree-container {
    max-height: none;
    padding: 10px 15px;
    overflow-x: hidden;
  }
  
  /* 节点容器样式 */
  :deep(.el-tree-node) {
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: #fafafa;
    padding: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .tree-node-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 0;
  }
  
  .node-content-wrapper {
    gap: 8px;
  }
  
  /* 优化复选框 */
  :deep(.el-checkbox) {
    transform: scale(1.3);
    align-self: flex-start;
  }
  
  /* 第一行：标题行 */
  .node-title-row {
    gap: 10px;
    align-items: flex-start;
  }
  
  .node-index {
    font-size: 16px;
    margin-right: 5px;
  }
  
  .node-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    white-space: normal;
    overflow: visible;
  }
  
  .status-tag {
    padding: 3px 10px;
    font-size: 14px;
    white-space: nowrap;
  }
  
  /* 第二行：信息行 */
  .node-info-row {
    gap: 15px;
  }
  
  .node-info {
    font-size: 14px;
    color: #606266;
  }
  
  .edited-tag {
    font-size: 14px;
  }
  
  /* 第三行：操作按钮行 */
  .node-actions-row {
    justify-content: space-between;
    gap: 10px;
  }
  
  .node-actions-row .el-button {
    flex: 1;
    min-width: calc(33.33% - 7px);
    padding: 8px 12px;
    font-size: 14px;
    margin-bottom: 0;
  }
  
  /* 优化节点内容 */
  :deep(.el-tree-node__content) {
    height: auto;
    padding: 5px 0;
  }
  
  /* 优化树形结构的缩进 */
  :deep(.el-tree-node__indent) {
    width: 20px;
  }
  
  /* 优化展开图标 */
  :deep(.el-tree-node__expand-icon) {
    width: 24px;
    height: 24px;
    font-size: 18px;
  }
}
</style>