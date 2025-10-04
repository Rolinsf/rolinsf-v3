<template>
  <div class="filters">
    <el-input
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      placeholder="按标题搜索我的小说..."
      clearable
      style="width: 300px; margin-bottom: 20px;"
    >
      <template #prepend>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);
</script>
