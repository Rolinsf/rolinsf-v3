<!-- 分页组件 -->
<template>
  <div class="pagination">
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      background
      prev-text="上一页"
      next-text="下一页"
      :page-size-text="'条/页'"
      jumper-text="前往"
      total-text="共"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义属性
const props = defineProps({
  pagination: {
    type: Object,
    required: true,
    default: () => ({
      currentPage: 1,
      pageSize: 10,
      total: 0
    })
  }
})

// 定义事件
const emit = defineEmits(['size-change', 'current-change'])

// 处理每页条数变化
const handleSizeChange = (size) => {
  emit('size-change', size)
}

// 处理当前页码变化
const handleCurrentChange = (current) => {
  emit('current-change', current)
}
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pagination {
    justify-content: center;
  }
}
</style>