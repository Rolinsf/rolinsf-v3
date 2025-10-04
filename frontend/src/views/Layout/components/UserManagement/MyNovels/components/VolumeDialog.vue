<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑卷' : '添加卷'"
    width="500px"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="卷名" prop="title">
        <el-input v-model="form.title" placeholder="请输入卷名" />
      </el-form-item>
      <el-form-item label="排序位置" v-if="!isEdit">
        <el-select v-model="form.sortOrder" placeholder="选择位置" style="width: 100%">
          <el-option label="添加到末尾" :value="0" />
          <el-option v-for="(vol, index) in treeData" :key="vol.id" :label="`插入到'${vol.title}'之前`" :value="index + 1" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

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
  }
})

const emit = defineEmits(['update:visible', 'save'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const formRef = ref(null)
const isEdit = computed(() => !!props.editData)

const form = ref({
  title: '',
  sortOrder: 0
})

const formRules = {
  title: [
    { required: true, message: '请输入卷名', trigger: 'blur' }
  ]
}

// 重置表单
const resetForm = () => {
  form.value = {
    title: '',
    sortOrder: 0
  }
}

// 监听编辑数据变化
watch(() => props.editData, (newVal) => {
  if (newVal) {
    form.value = {
      title: newVal.title,
      sortOrder: 0
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false
  resetForm()
}

// 保存操作
const handleSave = async () => {
  try {
    await formRef.value.validate()
    
    const volumeData = {
      id: isEdit.value ? props.editData.id : Date.now().toString(),
      title: form.value.title,
      isVolume: true,
      chapters: isEdit.value ? props.editData.chapters || [] : []
    }
    
    emit('save', {
      ...volumeData,
      sortOrder: form.value.sortOrder
    })
    
    dialogVisible.value = false
    ElMessage.success(isEdit.value ? '卷编辑成功' : '卷添加成功')
    resetForm()
  } catch (error) {
    console.error('保存卷失败:', error)
  }
}
</script>

<style scoped>
.dialog-form {
  margin: 20px 0;
}

.form-item {
  margin-bottom: 20px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 5px auto;
  }
  
  .dialog-form {
    margin: 10px 0;
  }
  
  .form-item {
    margin-bottom: 15px;
  }
  
  .actions {
    flex-direction: column;
    margin-top: 20px;
  }
  
  .actions :deep(.el-button) {
    width: 100%;
  }
  
  :deep(.el-dialog__body) {
    padding: 10px;
  }
}
</style>