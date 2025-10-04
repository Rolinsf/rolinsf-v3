<template>
  <el-dialog
    v-model="dialogVisible"
    title="章节管理"
    width="800px"
    @close="handleClose"
  >
    <div v-if="currentNovel" class="chapters-management-container">
      <div class="novel-info">
        <h3>{{ currentNovel.title }}</h3>
        <!-- <p class="novel-description">{{ currentNovel.description }}</p> -->
      </div>
      
      <div class="tree-container">
        <el-button type="primary" size="small" class="add-volume-btn" @click="handleAddVolume">
          <el-icon><Plus /></el-icon> 添加卷
        </el-button>
        
        <el-tree
          :data="chaptersTreeData"
          node-key="id"
          default-expand-all
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <div class="tree-node-content">
              <span>{{ data.name }}</span>
              <div class="node-actions">
                <el-button
                  size="small"
                  type="primary"
                  text
                  @click.stop="handleAddChapter(data)"
                  v-if="data.type === 'volume'"
                >
                  <el-icon><Plus /></el-icon>
                </el-button>
                <el-button
                  size="small"
                  type="primary"
                  text
                  @click.stop="handleEditNode(data)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  text
                  @click.stop="handleDeleteNode(data)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
      
      <div class="dialog-footer-actions">
        <el-button type="primary" @click="handleSave">保存修改</el-button>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <el-empty description="请选择小说" />
    </div>
    
    <!-- 添加/编辑卷对话框 -->
    <el-dialog
      v-model="isVolumeDialogVisible"
      :title="isEditingVolume ? '编辑卷' : '添加卷'"
      width="500px"
    >
      <el-form :model="volumeForm" label-width="80px">
        <el-form-item label="卷标题">
          <el-input v-model="volumeForm.title" placeholder="请输入卷标题" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isVolumeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveVolume">保存</el-button>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑章节对话框 -->
    <el-dialog
      v-model="isChapterDialogVisible"
      :title="isEditingChapter ? '编辑章节' : '添加章节'"
      width="700px"
      height="80vh"
    >
      <el-form :model="chapterForm" label-width="80px">
        <el-form-item label="章节标题">
          <el-input v-model="chapterForm.title" placeholder="请输入章节标题" />
        </el-form-item>
        <el-form-item label="字数">
          <el-input-number v-model="chapterForm.wordCount" :min="0" placeholder="请输入章节字数" />
        </el-form-item>
        <el-form-item label="发布日期">
          <el-date-picker
            v-model="chapterForm.publishDate"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="章节内容">
          <div class="markdown-editor-container">
            <div class="editor-tabs">
              <el-radio-group v-model="activeTab" size="small" class="editor-tab-group">
                <el-radio-button label="编辑">编辑</el-radio-button>
                <el-radio-button label="预览">预览</el-radio-button>
              </el-radio-group>
              <div class="markdown-tips">
                <el-tooltip content="支持Markdown语法">
                  <el-button type="text" size="small">
                    <el-icon><InfoFilled /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <div v-show="activeTab === '编辑'" class="editor-section">
              <el-input
                v-model="chapterForm.content"
                type="textarea"
                :rows="15"
                placeholder="请输入章节内容，支持Markdown语法"
                class="content-editor"
              />
            </div>
            <div v-show="activeTab === '预览'" class="preview-section" v-html="previewContent"></div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isChapterDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveChapter">保存</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Edit, Delete, InfoFilled } from '@element-plus/icons-vue';

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  novel: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['update:visible', 'save']);

// 响应式状态
const currentNovel = ref(null);
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// 添加/编辑对话框控制
const isVolumeDialogVisible = ref(false);
const isChapterDialogVisible = ref(false);
const isEditingVolume = ref(false);
const isEditingChapter = ref(false);
const currentEditingNode = ref(null);
const currentParentVolume = ref(null);

// Markdown编辑器相关
const activeTab = ref('编辑');

// 表单数据
const volumeForm = ref({
  title: ''
});

const chapterForm = ref({
  title: '',
  wordCount: 0,
  publishDate: new Date(),
  content: ''
});

// 树形结构配置
const defaultProps = {
  children: 'children',
  label: 'name'
};

// 计算属性：将卷和章节数据转换为树形结构
const chaptersTreeData = computed(() => {
  if (!currentNovel.value || !currentNovel.value.volumes) {
    currentNovel.value.volumes = [];
    return [];
  }
  
  return currentNovel.value.volumes.map(volume => ({
    id: volume.id,
    name: volume.title,
    type: 'volume',
    children: volume.chapters ? volume.chapters.map(chapter => ({
      id: chapter.id,
      name: chapter.title,
      type: 'chapter',
      wordCount: chapter.wordCount,
      publishDate: chapter.publishDate
    })) : []
  }));
});

// 简单的Markdown预览（基础实现）
const previewContent = computed(() => {
  if (!chapterForm.value.content) return '';
  
  let html = chapterForm.value.content;
  
  // 简单的Markdown转换
  // 标题
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  
  // 加粗
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 斜体
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 段落
  html = html.replace(/^(?!<h|>).*$/gm, '<p>$&</p>');
  
  // 换行
  html = html.replace(/\n/g, '<br>');
  
  return html;
});

// 生成唯一ID
const generateId = (prefix) => {
  return prefix + Date.now() + Math.floor(Math.random() * 1000);
};

// 监听小说数据变化
watch(() => props.novel, (newNovel) => {
  if (newNovel) {
    // 深拷贝，避免直接修改props
    currentNovel.value = JSON.parse(JSON.stringify(newNovel));
  }
}, { immediate: true });

// 方法
const handleClose = () => {
  emit('update:visible', false);
};

const handleNodeClick = (data) => {
  console.log('点击了节点:', data);
  // 如果是章节，可以实现章节内容编辑的功能
};

// 添加卷
const handleAddVolume = () => {
  isEditingVolume.value = false;
  volumeForm.value = { title: '' };
  isVolumeDialogVisible.value = true;
};

// 添加章节
const handleAddChapter = (parentVolume) => {
  currentParentVolume.value = parentVolume;
  isEditingChapter.value = false;
  chapterForm.value = {
    title: '',
    wordCount: 0,
    publishDate: new Date(),
    content: ''
  };
  activeTab.value = '编辑';
  isChapterDialogVisible.value = true;
};

// 编辑节点
const handleEditNode = (data) => {
  if (data.type === 'volume') {
    // 编辑卷
    isEditingVolume.value = true;
    currentEditingNode.value = data;
    volumeForm.value = { title: data.name };
    isVolumeDialogVisible.value = true;
  } else {
    // 编辑章节
    isEditingChapter.value = true;
    currentEditingNode.value = data;
    
    // 查找完整的章节数据
    let chapterData = null;
    for (const volume of currentNovel.value.volumes) {
      if (volume.chapters) {
        chapterData = volume.chapters.find(c => c.id === data.id);
        if (chapterData) break;
      }
    }
    
    chapterForm.value = {
      title: data.name,
      wordCount: data.wordCount || 0,
      publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
      content: chapterData?.content || ''
    };
    activeTab.value = '编辑';
    isChapterDialogVisible.value = true;
  }
};

// 保存卷
const handleSaveVolume = () => {
  if (!volumeForm.value.title.trim()) {
    ElMessage.warning('请输入卷标题');
    return;
  }
  
  if (isEditingVolume.value) {
    // 更新现有卷
    const volume = currentNovel.value.volumes.find(v => v.id === currentEditingNode.value.id);
    if (volume) {
      volume.title = volumeForm.value.title;
    }
    ElMessage.success('卷信息更新成功');
  } else {
    // 添加新卷
    const newVolume = {
      id: generateId('VOL'),
      title: volumeForm.value.title,
      chapters: []
    };
    currentNovel.value.volumes.push(newVolume);
    ElMessage.success('卷添加成功');
  }
  
  isVolumeDialogVisible.value = false;
};

// 保存章节
const handleSaveChapter = () => {
  if (!chapterForm.value.title.trim()) {
    ElMessage.warning('请输入章节标题');
    return;
  }
  
  if (!chapterForm.value.content.trim()) {
    ElMessage.warning('请输入章节内容');
    return;
  }
  
  // 自动计算字数
  const contentText = chapterForm.value.content.replace(/\n/g, '');
  chapterForm.value.wordCount = contentText.length;
  
  if (isEditingChapter.value) {
    // 更新现有章节
    for (const volume of currentNovel.value.volumes) {
      const chapter = volume.chapters.find(c => c.id === currentEditingNode.value.id);
      if (chapter) {
        chapter.title = chapterForm.value.title;
        chapter.wordCount = chapterForm.value.wordCount;
        chapter.publishDate = chapterForm.value.publishDate ? chapterForm.value.publishDate.toLocaleString('zh-CN').replace(/\//g, '-') : new Date().toLocaleString('zh-CN').replace(/\//g, '-');
        chapter.content = chapterForm.value.content;
        break;
      }
    }
    ElMessage.success('章节信息更新成功');
  } else {
    // 添加新章节
    const volume = currentNovel.value.volumes.find(v => v.id === currentParentVolume.value.id);
    if (volume) {
      const newChapter = {
        id: generateId('CH'),
        title: chapterForm.value.title,
        wordCount: chapterForm.value.wordCount,
        publishDate: chapterForm.value.publishDate ? chapterForm.value.publishDate.toLocaleString('zh-CN').replace(/\//g, '-') : new Date().toLocaleString('zh-CN').replace(/\//g, '-'),
        content: chapterForm.value.content
      };
      if (!volume.chapters) {
        volume.chapters = [];
      }
      volume.chapters.push(newChapter);
      ElMessage.success('章节添加成功');
    }
  }
  
  isChapterDialogVisible.value = false;
};

// 删除节点
const handleDeleteNode = (data) => {
  ElMessageBox.confirm(
    `确定要删除${data.type === 'volume' ? '卷' : '章节'}「${data.name}」吗？此操作不可恢复。`,
    '警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      if (data.type === 'volume') {
        // 删除卷
        currentNovel.value.volumes = currentNovel.value.volumes.filter(v => v.id !== data.id);
      } else {
        // 删除章节
        for (const volume of currentNovel.value.volumes) {
          if (volume.chapters) {
            volume.chapters = volume.chapters.filter(c => c.id !== data.id);
          }
        }
      }
      ElMessage.success('删除成功');
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

const handleSave = () => {
  // 保存修改并通知父组件
  emit('save', currentNovel.value);
  emit('update:visible', false);
};
</script>

<style scoped>
.chapters-management-container {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.novel-info {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.novel-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}

.add-volume-btn {
  margin-bottom: 10px;
}

.tree-node-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.node-actions {
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tree-node-content:hover .node-actions {
  opacity: 1;
}

.dialog-footer-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.loading-state {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Markdown编辑器样式 */
.markdown-editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

.editor-tab-group {
  margin: 5px 0;
}

.markdown-tips {
  display: flex;
  align-items: center;
}

.editor-section, .preview-section {
  padding: 15px;
  min-height: 300px;
}

.content-editor {
  resize: vertical;
  min-height: 300px;
  font-family: Monaco, Menlo, Consolas, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.preview-section {
  background-color: #fafafa;
  line-height: 1.8;
  white-space: pre-wrap;
}

.preview-section h1 {
  font-size: 24px;
  margin: 20px 0 10px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #eaecef;
}

.preview-section h2 {
  font-size: 20px;
  margin: 18px 0 8px 0;
  padding-bottom: 5px;
  border-bottom: 1px solid #eaecef;
}

.preview-section h3 {
  font-size: 18px;
  margin: 15px 0 5px 0;
}

.preview-section p {
  margin: 10px 0;
}

.preview-section strong {
  font-weight: bold;
  color: #303133;
}

.preview-section em {
  font-style: italic;
}
</style>