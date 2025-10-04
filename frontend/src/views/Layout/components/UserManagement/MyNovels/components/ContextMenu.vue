<template>
  <el-dropdown-menu v-if="visible" :style="menuStyle" ref="menuRef">
    <el-dropdown-item @click="$emit('add-volume')">
      <el-icon><Plus /></el-icon> 添加卷
    </el-dropdown-item>
    <el-dropdown-item 
      v-if="menuNode && menuNode.isVolume" 
      @click="$emit('add-chapter', menuNode)"
    >
      <el-icon><Plus /></el-icon> 添加章节
    </el-dropdown-item>
    <el-dropdown-item @click="$emit('edit', menuNode)" v-if="menuNode">
      <el-icon><Edit /></el-icon> 编辑
    </el-dropdown-item>
    <el-dropdown-item 
      v-if="menuNode && !menuNode.isVolume" 
      @click="$emit('publish', menuNode)"
    >
      <el-icon><Check /></el-icon> 发布
    </el-dropdown-item>
    <el-dropdown-item 
      v-if="menuNode && !menuNode.isVolume" 
      @click="$emit('move-up', menuNode)"
      :disabled="menuNode.isFirst"
    >
      <el-icon><Top /></el-icon> 上移
    </el-dropdown-item>
    <el-dropdown-item 
      v-if="menuNode && !menuNode.isVolume" 
      @click="$emit('move-down', menuNode)"
      :disabled="menuNode.isLast"
    >
      <el-icon><Bottom /></el-icon> 下移
    </el-dropdown-item>
    <el-dropdown-item @click="$emit('delete', menuNode)" v-if="menuNode" divided>
      <el-icon><Delete /></el-icon> 删除
    </el-dropdown-item>
  </el-dropdown-menu>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Edit, Delete, Check, Top, Bottom } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  menuNode: {
    type: Object,
    default: null
  },
  menuStyle: {
    type: Object,
    default: () => ({ top: '0px', left: '0px' })
  }
})

const emit = defineEmits(['add-volume', 'add-chapter', 'edit', 'publish', 'move-up', 'move-down', 'delete'])

const menuRef = ref(null)
</script>

<style scoped>
/* 右键菜单样式 */
.el-dropdown-menu {
  position: fixed;
  z-index: 1001;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border: 1px solid #ebeef5;
  padding: 5px 0;
  margin: 0;
  min-width: 100px;
}

.el-dropdown-item {
  height: 36px;
  line-height: 36px;
  padding: 0 20px;
  clear: both;
  font-size: 14px;
  white-space: nowrap;
  color: #606266;
  cursor: pointer;
  transition: 0.3s;
}

.el-dropdown-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.el-dropdown-item.is-disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.el-dropdown-item.is-disabled:hover {
  background-color: #fff;
  color: #c0c4cc;
}

.el-dropdown-item.divided {
  border-top: 1px solid #ebeef5;
  margin-top: 6px;
  padding-top: 6px;
}
</style>