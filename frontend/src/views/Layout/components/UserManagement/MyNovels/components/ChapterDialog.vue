<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑章节' : '添加章节'"
    width="800px"
    height="80vh"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="所属卷" prop="volumeId">
        <el-select v-model="form.volumeId" placeholder="选择卷" style="width: 100%">
          <el-option
            v-for="volume in treeData"
            :key="volume.id"
            :label="volume.title"
            :value="volume.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="章节标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入章节标题" />
      </el-form-item>
      <el-form-item label="章节状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="draft">草稿</el-radio>
          <el-radio label="published">已发布</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="章节字数">
        <el-input v-model="form.wordCount" disabled placeholder="自动统计" />
      </el-form-item>
      <el-form-item label="章节内容" prop="content">
        <div class="vditor-container">
          <div ref="vditorRef" class="vditor"></div>
          <div class="word-count" v-if="form.wordCount > 0">{{ form.wordCount }}字</div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  treeData: {
    type: Array,
    default: () => []
  },
  editData: {
    type: Object,
    default: null
  },
  defaultVolumeId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'save'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const formRef = ref(null)
const vditorRef = ref(null)
const isEdit = computed(() => !!props.editData)

let vditorInstance = null

const form = ref({
  title: '',
  wordCount: 0,
  content: '',
  volumeId: '',
  status: 'draft'
})

const formRules = {
  title: [
    { required: true, message: '请输入章节标题', trigger: 'blur' }
  ],
  volumeId: [
    { required: true, message: '请选择所属卷', trigger: 'change' }
  ]
}

// 监听可见性变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 延迟初始化Vditor，确保DOM已渲染
    setTimeout(() => {
      initVditor(form.value.content || '')
    }, 100)
  } else {
    // 销毁Vditor实例
    if (vditorInstance) {
      vditorInstance.destroy()
      vditorInstance = null
    }
  }
})

// 重置表单
const resetForm = () => {
  form.value = {
    title: '',
    wordCount: 0,
    content: '',
    volumeId: props.defaultVolumeId || '',
    status: 'draft'
  }
}

// 监听编辑数据变化
watch(() => props.editData, (newVal) => {
  if (newVal) {
    form.value = {
      title: newVal.title,
      wordCount: newVal.wordCount || 0,
      content: newVal.content || '',
      volumeId: newVal.volumeId || props.defaultVolumeId,
      status: newVal.status || 'draft'
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// 初始化Vditor
const initVditor = (content) => {
  if (vditorRef.value && !vditorInstance) {
    vditorInstance = new Vditor(vditorRef.value, {
      height: 400,
      value: content || '',
      mode: 'ir', // 即时渲染模式
      preview: {
        theme: {
          current: 'auto'
        },
        hljs: {
          enable: true
        }
      },
      toolbarConfig: {
        pin: true,
        toolbar: [
          'emoji',
          'headings',
          'bold',
          'italic',
          'strike',
          '|',
          'list',
          'ordered-list',
          'check',
          'outdent',
          'indent',
          '|',
          'link',
          'image',
          'table',
          '|',
          'code',
          'code-block',
          '|',
          'undo',
          'redo',
          '|',
          'fullscreen',
          'edit-mode'
        ]
      },
      cache: {
        enable: false
      },
      input: (value) => {
        // 实时更新字数
        form.value.wordCount = calculateWordCount(value)
      }
    })
  }
}

// 计算字数
const calculateWordCount = (content) => {
  if (!content) return 0
  // 移除Markdown标记，计算纯文本字数
  const plainText = content.replace(/[\*\_\[\]\(\)\~\`\#\>\!\|\{\}\;\:]/g, '')
  return plainText.length
}

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false
  resetForm()
}

// 保存操作
const handleSave = async () => {
  try {
    await formRef.value.validate()
    
    // 获取Vditor内容
    if (vditorInstance) {
      form.value.content = vditorInstance.getValue()
      // 自动计算字数（不包含Markdown标记）
      form.value.wordCount = form.value.content.replace(/[\*\_\[\]\(\)\~\`\#\>\!\|\{\}\;\:]/g, '').length
    }
    
    const chapterData = {
      id: isEdit.value ? props.editData.id : Date.now().toString(),
      ...form.value
    }
    
    emit('save', chapterData)
    
    dialogVisible.value = false
    ElMessage.success(isEdit.value ? '章节编辑成功' : '章节添加成功')
    resetForm()
  } catch (error) {
    console.error('保存章节失败:', error)
  }
}

// 组件卸载时清理
onUnmounted(() => {
  if (vditorInstance) {
    vditorInstance.destroy()
    vditorInstance = null
  }
})
</script>

<style scoped>
.vditor-container {
  position: relative;
  min-height: 400px;
}

.vditor {
  min-height: 400px;
}

.word-count {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
}
</style>