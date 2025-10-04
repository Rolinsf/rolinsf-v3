<template>
  <el-dialog
    :model-value="visible"
    title="新建小说"
    width="50%"
    @update:model-value="$emit('update:visible', $event)"
    @close="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="小说标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入小说标题"></el-input>
      </el-form-item>
      <el-form-item label="小说简介" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入小说简介"
        ></el-input>
      </el-form-item>
      <el-form-item label="小说封面" prop="cover">
        <el-upload
          class="cover-uploader"
          action="#"
          :show-file-list="false"
          :on-change="handleCoverChange"
          :auto-upload="false"
          accept="image/png, image/jpeg, image/gif"
        >
          <img v-if="form.cover" :src="form.cover" class="cover-image" />
          <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="el-upload__tip">
          支持 jpg/png/gif 格式，大小不超过 2MB。
        </div>
      </el-form-item>
      <el-form-item label="连载状态" prop="serializationStatus">
        <el-radio-group v-model="form.serializationStatus">
          <el-radio label="连载中">连载中</el-radio>
          <el-radio label="已完结">已完结</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类型标签" prop="tags">
        <div class="dynamic-tags-container">
          <el-tag
            v-for="tag in form.tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleTagClose(tag)"
            :color="getTagColor(tag)"
            style="color: white; margin: 2px;"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
            style="width: 100px"
          />
          <el-button v-else size="small" @click="showInput" style="margin: 2px;">
            + 新建标签
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:visible', 'create']);

const formRef = ref(null);

const form = reactive({
  title: '',
  description: '',
  cover: '', // 将用于存储封面的预览URL
  coverFile: null, // 用于存储原始文件对象
  serializationStatus: '连载中',
  tags: [],
});

const rules = reactive({
  title: [{ required: true, message: '请输入小说标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入小说简介', trigger: 'blur' }],
  serializationStatus: [{ required: true, message: '请选择连载状态', trigger: 'change' }],
  tags: [{ type: 'array', required: true, message: '请至少添加一个类型标签', trigger: 'change' }],
});

// --- 封面上传逻辑 ---
const handleCoverChange = (uploadFile) => {
  const isLt2M = uploadFile.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('上传封面图片大小不能超过 2MB!');
    return;
  }
  // 生成本地预览URL
  form.cover = URL.createObjectURL(uploadFile.raw);
  form.coverFile = uploadFile.raw; // 保存文件对象，用于后续真实上传
};


// --- 动态标签逻辑 ---
const inputValue = ref('');
const inputVisible = ref(false);
const InputRef = ref(null);

const handleTagClose = (tag) => {
  form.tags.splice(form.tags.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value?.input.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value && !form.tags.includes(inputValue.value)) {
    form.tags.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};

// --- 标签颜色 ---
const tagColors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'];
const getTagColor = (tag) => {
  // 根据 tag 的 hash 值选择一个固定的颜色，确保相同 tag 颜色一致
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % tagColors.length);
  return tagColors[index];
};


const resetForm = () => {
  formRef.value?.resetFields();
  form.tags = []; 
  form.cover = '';
  form.coverFile = null;
};

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 在实际应用中，这里应该先上传 form.coverFile 文件到服务器，
      // 获取到真实的URL后，再替换掉 form.cover 的 blob: URL
      emit('create', { ...form });
      emit('update:visible', false);
    } else {
      ElMessage.error('请填写所有必填项');
      return false;
    }
  });
};
</script>

<style scoped>
.cover-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.cover-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.cover-image {
  width: 178px;
  height: 178px;
  display: block;
}

.dynamic-tags-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 5px;
}
.dialog-footer {
  text-align: right;
}
</style>
