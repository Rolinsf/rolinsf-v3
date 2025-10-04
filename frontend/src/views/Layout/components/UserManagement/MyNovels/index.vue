<template>
  <el-container class="my-novels-container">
    <el-header class="page-header-section">
      <PageHeader @create-novel="handleCreateNovel" />
      <SearchFilter v-model="searchQuery" />
    </el-header>
    
    <el-main class="page-main-section">
      <NovelList 
        v-if="filteredNovels.length > 0"
        :novels="filteredNovels"
        @manage-chapters="manageChapters"
        @edit="handleEditNovel"
        @analytics="viewAnalytics"
        @delete="deleteNovel"
      />
      <EmptyState v-else @create-novel="handleCreateNovel" />
    </el-main>

    <!-- 新建小说弹窗 -->
    <CreateNovelDialog
      v-model:visible="isCreateDialogVisible"
      @create="handleAddNewNovel"
    />

    <!-- 编辑小说弹窗 -->
    <EditNovelDialog
      v-model:visible="isEditDialogVisible"
      :novel="novelToEdit"
      @update="handleUpdateNovel"
    />

    <!-- 数据分析弹窗 -->
  <DataAnalyticsDialog
    v-model:visible="isAnalyticsDialogVisible"
    :novel="novelToAnalyze"
  />
  
  <!-- 章节管理弹窗 -->
  <ManageChaptersDialog
    v-model:visible="isChaptersDialogVisible"
    :novel="novelToManageChapters"
    @save="handleSaveChapters"
  />
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PageHeader from './components/PageHeader.vue';
import SearchFilter from './components/SearchFilter.vue';
import NovelList from './components/NovelList.vue';
import EmptyState from './components/EmptyState.vue';
import CreateNovelDialog from './components/CreateNovelDialog.vue';
import EditNovelDialog from './components/EditNovelDialog.vue';
import DataAnalyticsDialog from './components/DataAnalyticsDialog.vue';
import ManageChaptersDialog from './components/ManageChaptersDialog.vue';

// --- 工具函数 ---
/**
 * 生成作品唯一编号
 * @returns {string} RLSF开头的唯一编号
 */
const generateNovelId = () => {
  const prefix = 'RLSF';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomPart = '';
  for (let i = 0; i < 8; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return prefix + randomPart;
};

// --- 响应式状态 ---

// 弹窗控制
const isCreateDialogVisible = ref(false);
const isEditDialogVisible = ref(false);
const isAnalyticsDialogVisible = ref(false);
const isChaptersDialogVisible = ref(false);

// 数据
const searchQuery = ref('');
const novels = ref([]);
const novelToEdit = ref(null);
const novelToAnalyze = ref(null);
const novelToManageChapters = ref(null);

// --- 数据获取 ---
const fetchNovels = () => {
  // 模拟获取数据
  novels.value = [
    {
      id: 'RLSFaBcd1234',
      title: '我的第一部玄幻巨作',
      description: '这是一个关于勇气与冒险的史诗故事...',
      cover: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
      status: '已发布',
      wordCount: 120500,
      views: 88000,
      collections: 4500,
      lastUpdated: '2025-10-03 18:00',
      serializationStatus: '连载中',
      tags: ['玄幻', '热血', '穿越'],
      volumes: [
        {
          id: 'VOL001',
          title: '第一卷：觉醒',
          chapters: [
            {
              id: 'CH001',
              title: '第1章：奇怪的梦',
              wordCount: 3200,
              publishDate: '2025-09-15 10:00'
            },
            {
              id: 'CH002',
              title: '第2章：神秘的力量',
              wordCount: 2800,
              publishDate: '2025-09-16 10:00'
            }
          ]
        },
        {
          id: 'VOL002',
          title: '第二卷：历练',
          chapters: [
            {
              id: 'CH003',
              title: '第3章：初次冒险',
              wordCount: 3500,
              publishDate: '2025-09-17 10:00'
            }
          ]
        }
      ]
    },
  ];
  console.log("组件已挂载，已加载测试数据。");
};

onMounted(() => {
  fetchNovels();
});

// --- 计算属性 ---
const filteredNovels = computed(() => {
  if (!searchQuery.value) {
    return novels.value;
  }
  return novels.value.filter(novel =>
    novel.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --- 事件处理 ---

const handleCreateNovel = () => {
  isCreateDialogVisible.value = true;
};

const handleAddNewNovel = (newNovelData) => {
  const newNovel = {
    id: generateNovelId(),
    ...newNovelData,
    status: '草稿',
    wordCount: 0,
    views: 0,
    collections: 0,
    lastUpdated: new Date().toLocaleString().replace(/\//g, '-'),
  };
  novels.value.unshift(newNovel);
  ElMessage.success(`小说创建成功！作品编号: ${newNovel.id}`);
};

// 编辑
const handleEditNovel = (id) => {
  const novel = novels.value.find(n => n.id === id);
  if (novel) {
    novelToEdit.value = novel;
    isEditDialogVisible.value = true;
  }
};

const handleUpdateNovel = (updatedNovel) => {
  const index = novels.value.findIndex(n => n.id === updatedNovel.id);
  if (index !== -1) {
    novels.value[index] = updatedNovel;
    ElMessage.success('小说信息更新成功！');
  }
};

// 其他操作
const manageChapters = (id) => {
  const novel = novels.value.find(n => n.id === id);
  if (novel) {
    novelToManageChapters.value = novel;
    isChaptersDialogVisible.value = true;
  }
};

const handleSaveChapters = (updatedNovel) => {
  const index = novels.value.findIndex(n => n.id === updatedNovel.id);
  if (index !== -1) {
    novels.value[index] = updatedNovel;
    ElMessage.success('章节信息更新成功！');
  }
};

const viewAnalytics = (id) => {
  const novel = novels.value.find(n => n.id === id);
  if (novel) {
    novelToAnalyze.value = novel;
    isAnalyticsDialogVisible.value = true;
  }
};

const deleteNovel = (id) => {
  ElMessageBox.confirm(
    '确定要删除这部小说吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // 从列表中移除小说
      novels.value = novels.value.filter(novel => novel.id !== id);
      ElMessage.success('小说已删除');
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};
</script>

<style scoped>
.my-novels-container {
  background-color: #f5f7fa;
  height: 100%;
}

.page-header-section {
  height: auto;
  padding: 20px 20px 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.page-main-section {
  padding: 20px;
}
</style>
