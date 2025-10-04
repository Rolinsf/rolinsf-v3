<template>
  <el-dialog
    v-model="dialogVisible"
    title="章节管理"
    width="900px"
    :before-close="handleClose"
  >
    <div class="novel-info">
      <h3>{{ novel.title }}</h3>
      <p class="author">作者: {{ novel.author }}</p>
    </div>
    
    <!-- 批量操作工具栏 -->
    <div class="toolbar">
      <el-button type="primary" size="small" @click="handleAddVolume">
        <el-icon><Plus /></el-icon> 添加卷
      </el-button>
      <el-button size="small" @click="handleBatchPublish" :disabled="selectedNodes.length === 0">
        <el-icon><Check /></el-icon> 批量发布
      </el-button>
      <el-button size="small" @click="handleBatchDelete" :disabled="selectedNodes.length === 0" type="danger">
        <el-icon><Delete /></el-icon> 批量删除
      </el-button>
      <div class="search-wrapper">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索章节/卷"
          size="small"
          :prefix-icon="Search"
          @input="handleSearch"
        />
      </div>
    </div>
    
    <!-- 章节树组件 -->
    <ChapterTree
      :treeData="treeData"
      :searchKeyword="searchKeyword"
      @node-click="handleNodeClick"
      @check-change="handleCheckChange"
      @check="handleCheck"
      @add-chapter="handleAddChapter"
      @edit-node="handleEditNode"
      @publish-chapter="handlePublishChapter"
      @delete-node="handleDeleteNode"
      @move-up="handleMoveUp"
      @move-down="handleMoveDown"
      @context-menu="handleContextMenu"
    />
    
    <div class="actions">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
    
    <!-- 子组件对话框 -->
    <VolumeDialog
      v-model:visible="addVolumeDialogVisible"
      :treeData="treeData"
      :editData="currentEditNode"
      @save="handleSaveVolume"
    />
    
    <ChapterDialog
      v-model:visible="addChapterDialogVisible"
      :treeData="treeData"
      :editData="currentEditNode"
      :defaultVolumeId="currentEditVolumeId"
      @save="handleSaveChapter"
    />
    
    <!-- 右键菜单 -->
    <ContextMenu
      :visible="contextMenuVisible"
      :menuNode="contextMenuNode"
      :menuStyle="contextMenuStyle"
      @add-volume="handleAddVolumeFromMenu"
      @add-chapter="handleAddChapterFromMenu"
      @edit="handleEditFromMenu"
      @publish="handlePublishFromMenu"
      @move-up="handleMoveUpFromMenu"
      @move-down="handleMoveDownFromMenu"
      @delete="handleDeleteFromMenu"
    />
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Check, Search, Top, Bottom } from '@element-plus/icons-vue'

// 引入子组件
import ChapterTree from './ChapterTree.vue'
import VolumeDialog from './VolumeDialog.vue'
import ChapterDialog from './ChapterDialog.vue'
import ContextMenu from './ContextMenu.vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  novel: {
    type: Object,
    default: () => ({
      id: '',
      title: '',
      author: '',
      volumes: []
    })
  }
})

// Emits
const emit = defineEmits(['update:visible', 'save'])

// 响应式数据
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const treeData = ref([])

// 搜索相关
const searchKeyword = ref('')

// 对话框相关
const addVolumeDialogVisible = ref(false)
const addChapterDialogVisible = ref(false)

// 当前编辑的节点信息
const currentEditNode = ref(null)
const currentEditVolumeId = ref(null)

// 多选功能
const selectedNodes = ref([])
const checkNodeKeys = ref([])

// 右键菜单
const contextMenuVisible = ref(false)
const contextMenuNode = ref(null)
const contextMenuStyle = ref({ top: '0px', left: '0px' })

// 初始化树形数据
const initTreeData = () => {
  if (props.novel && props.novel.volumes) {
    treeData.value = JSON.parse(JSON.stringify(props.novel.volumes))
    // 确保每个节点都有必要的属性
    treeData.value.forEach(volume => {
      volume.isVolume = true
      if (!volume.chapters) volume.chapters = []
      volume.chapters.forEach(chapter => {
        chapter.isVolume = false
        if (!chapter.status) chapter.status = 'draft'
      })
    })
  } else {
    treeData.value = []
  }
  selectedNodes.value = []
  checkNodeKeys.value = []
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    initTreeData()
  }
})

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  // 关闭右键菜单
  contextMenuVisible.value = false
}

// 节点点击事件
const handleNodeClick = (data) => {
  // 可以在这里添加节点点击后的操作
}

// 搜索功能
const handleSearch = () => {
  // 搜索逻辑已在ChapterTree组件中实现
}

// 右键菜单事件
const handleContextMenu = ({ event, data }) => {
  contextMenuNode.value = data
  contextMenuStyle.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`
  }
  contextMenuVisible.value = true
}

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenuVisible.value = false
  contextMenuNode.value = null
}

// 多选功能
const handleCheckChange = (data, checked, indeterminate) => {
  if (checked) {
    selectedNodes.value.push(data)
  } else {
    const index = selectedNodes.value.findIndex(node => node.id === data.id)
    if (index > -1) {
      selectedNodes.value.splice(index, 1)
    }
  }
}

const handleCheck = (data, node) => {
  // 多选逻辑可以在这里进一步处理
}

// 添加卷
const handleAddVolume = () => {
  currentEditNode.value = null
  addVolumeDialogVisible.value = true
}

// 从右键菜单添加卷
const handleAddVolumeFromMenu = () => {
  closeContextMenu()
  handleAddVolume()
}

// 保存卷
const handleSaveVolume = (volumeData) => {
  if (volumeData.sortOrder === 0 || volumeData.sortOrder > treeData.value.length) {
    // 添加到末尾
    treeData.value.push(volumeData)
  } else {
    // 插入到指定位置
    treeData.value.splice(volumeData.sortOrder - 1, 0, volumeData)
  }
}

// 添加章节
const handleAddChapter = (volume) => {
  currentEditNode.value = null
  currentEditVolumeId.value = volume.id
  addChapterDialogVisible.value = true
}

// 从右键菜单添加章节
const handleAddChapterFromMenu = (volume) => {
  closeContextMenu()
  handleAddChapter(volume)
}

// 编辑节点
const handleEditNode = (data) => {
  currentEditNode.value = data
  if (data.isVolume) {
    addVolumeDialogVisible.value = true
  } else {
    addChapterDialogVisible.value = true
  }
  closeContextMenu()
}

// 从右键菜单编辑
const handleEditFromMenu = (data) => {
  closeContextMenu()
  handleEditNode(data)
}

// 保存章节
const handleSaveChapter = (chapterData) => {
  if (chapterData.id) {
    // 编辑章节
    for (let volume of treeData.value) {
      const chapterIndex = volume.chapters.findIndex(c => c.id === chapterData.id)
      if (chapterIndex > -1) {
        // 如果卷改变了，需要从原卷移除并添加到新卷
        if (volume.id !== chapterData.volumeId) {
          const chapterToMove = volume.chapters.splice(chapterIndex, 1)[0]
          const newVolume = treeData.value.find(v => v.id === chapterData.volumeId)
          if (newVolume) {
            newVolume.chapters.push({ ...chapterToMove, ...chapterData })
          }
        } else {
          // 否则直接更新
          volume.chapters[chapterIndex] = {
            ...volume.chapters[chapterIndex],
            ...chapterData
          }
        }
        break
      }
    }
  } else {
    // 添加章节
    const volume = treeData.value.find(v => v.id === currentEditVolumeId.value)
    if (volume) {
      volume.chapters.push(chapterData)
    }
  }
}

// 删除节点
const handleDeleteNode = async (data) => {
  try {
    const result = await ElMessageBox.confirm(
      `确定要删除${data.isVolume ? '卷' : '章节'}「${data.title}」吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (result === 'confirm') {
      if (data.isVolume) {
        // 删除卷
        const volumeIndex = treeData.value.findIndex(v => v.id === data.id)
        if (volumeIndex > -1) {
          treeData.value.splice(volumeIndex, 1)
        }
      } else {
        // 删除章节
        for (let volume of treeData.value) {
          const chapterIndex = volume.chapters.findIndex(c => c.id === data.id)
          if (chapterIndex > -1) {
            volume.chapters.splice(chapterIndex, 1)
            break
          }
        }
      }
      ElMessage.success('删除成功')
      
      // 从选中列表中移除
      const index = selectedNodes.value.findIndex(node => node.id === data.id)
      if (index > -1) {
        selectedNodes.value.splice(index, 1)
      }
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 从右键菜单删除
const handleDeleteFromMenu = (data) => {
  closeContextMenu()
  handleDeleteNode(data)
}

// 发布章节
const handlePublishChapter = async (data) => {
  try {
    const result = await ElMessageBox.confirm(
      `确定要发布章节「${data.title}」吗？`,
      '确认发布',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    if (result === 'confirm') {
      data.status = 'published'
      ElMessage.success('章节发布成功')
    }
  } catch (error) {
    // 用户取消发布
  }
}

// 从右键菜单发布
const handlePublishFromMenu = (data) => {
  closeContextMenu()
  handlePublishChapter(data)
}

// 批量发布
const handleBatchPublish = async () => {
  try {
    const chaptersToPublish = selectedNodes.value.filter(node => !node.isVolume)
    if (chaptersToPublish.length === 0) {
      ElMessage.warning('请选择要发布的章节')
      return
    }
    
    const result = await ElMessageBox.confirm(
      `确定要发布选中的${chaptersToPublish.length}个章节吗？`,
      '批量发布',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    if (result === 'confirm') {
      chaptersToPublish.forEach(chapter => {
        chapter.status = 'published'
      })
      ElMessage.success(`成功发布${chaptersToPublish.length}个章节`)
    }
  } catch (error) {
    // 用户取消发布
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    if (selectedNodes.value.length === 0) {
      ElMessage.warning('请选择要删除的项目')
      return
    }
    
    const volumesCount = selectedNodes.value.filter(node => node.isVolume).length
    const chaptersCount = selectedNodes.value.length - volumesCount
    
    const result = await ElMessageBox.confirm(
      `确定要删除选中的${volumesCount}个卷和${chaptersCount}个章节吗？`,
      '批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (result === 'confirm') {
      // 删除卷
      selectedNodes.value.forEach(node => {
        if (node.isVolume) {
          const volumeIndex = treeData.value.findIndex(v => v.id === node.id)
          if (volumeIndex > -1) {
            treeData.value.splice(volumeIndex, 1)
          }
        } else {
          // 删除章节
          for (let volume of treeData.value) {
            const chapterIndex = volume.chapters.findIndex(c => c.id === node.id)
            if (chapterIndex > -1) {
              volume.chapters.splice(chapterIndex, 1)
              break
            }
          }
        }
      })
      
      ElMessage.success(`成功删除${volumesCount}个卷和${chaptersCount}个章节`)
      selectedNodes.value = []
      checkNodeKeys.value = []
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 章节上移
const handleMoveUp = (data, node) => {
  for (const volume of treeData.value) {
    const chapterIndex = volume.chapters.findIndex(c => c.id === data.id)
    if (chapterIndex > 0) {
      // 交换位置
      const temp = volume.chapters[chapterIndex - 1]
      volume.chapters[chapterIndex - 1] = volume.chapters[chapterIndex]
      volume.chapters[chapterIndex] = temp
      ElMessage.success('章节已上移')
      break
    }
  }
}

// 从右键菜单上移
const handleMoveUpFromMenu = (data) => {
  closeContextMenu()
  handleMoveUp(data)
}

// 章节下移
const handleMoveDown = (data, node) => {
  for (const volume of treeData.value) {
    const chapterIndex = volume.chapters.findIndex(c => c.id === data.id)
    if (chapterIndex > -1 && chapterIndex < volume.chapters.length - 1) {
      // 交换位置
      const temp = volume.chapters[chapterIndex + 1]
      volume.chapters[chapterIndex + 1] = volume.chapters[chapterIndex]
      volume.chapters[chapterIndex] = temp
      ElMessage.success('章节已下移')
      break
    }
  }
}

// 从右键菜单下移
const handleMoveDownFromMenu = (data) => {
  closeContextMenu()
  handleMoveDown(data)
}

// 保存所有更改
const handleSave = () => {
  // 传递更新后的数据给父组件
  emit('save', {
    ...props.novel,
    volumes: treeData.value
  })
  handleClose()
}

// 全局点击事件监听，用于关闭右键菜单
const handleGlobalClick = () => {
  if (contextMenuVisible.value) {
    closeContextMenu()
  }
}

// 组件挂载时监听visible变化和全局点击事件
onMounted(() => {
  initTreeData()
  document.addEventListener('click', handleGlobalClick)
})

// 组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped>
.novel-info {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.novel-info h3 {
  margin: 0 0 10px 0;
}

.novel-info .author {
  margin: 0;
  color: #606266;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.search-wrapper {
  margin-left: auto;
  width: 300px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* 确保对话框内容不会溢出 */
:deep(.el-dialog__body) {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>