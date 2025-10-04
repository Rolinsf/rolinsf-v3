<template>
  <div class="novel-list">
    <el-row :gutter="20">
      <el-col v-for="novel in novels" :key="novel.id" :xs="24" :sm="12" :md="8" :lg="6">
        <NovelCard 
          :novel="novel"
          @manage-chapters="$emit('manage-chapters', $event)"
          @edit="$emit('edit', $event)"
          @analytics="$emit('analytics', $event)"
          @delete="$emit('delete', $event)"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import NovelCard from './NovelCard.vue';

defineProps({
  novels: {
    type: Array,
    required: true,
  },
});

defineEmits(['manage-chapters', 'edit', 'analytics', 'delete']);
</script>
