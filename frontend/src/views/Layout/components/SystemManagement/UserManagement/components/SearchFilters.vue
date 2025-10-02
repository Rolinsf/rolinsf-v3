<!-- 搜索部分 -->
<template>
  <div class="search-filters">
    <!-- 基础搜索条件 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :span="6">
        <el-input 
          v-model="searchForm.username" 
          placeholder="用户名搜索" 
          prefix-icon="Search"
          clearable
        />
      </el-col>
      <el-col :span="6">
        <el-input 
          v-model="searchForm.email" 
          placeholder="邮箱搜索" 
          prefix-icon="Message"
          clearable
        />
      </el-col>
      <el-col :span="6">
        <el-select v-model="searchForm.status" placeholder="用户状态" clearable>
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="text" @click="showAdvanced = !showAdvanced">
          {{ showAdvanced ? '收起' : '高级搜索' }}
          <el-icon>
            <ArrowDown v-if="!showAdvanced" />
            <ArrowUp v-else />
          </el-icon>
        </el-button>
      </el-col>
    </el-row>
    
    <!-- 高级搜索条件 -->
    <el-collapse-transition>
      <div v-show="showAdvanced" class="advanced-filters">
        <el-divider>高级搜索</el-divider>
        <el-row :gutter="20" class="mb-20">
          <el-col :span="6">
            <el-input 
              v-model="searchForm.nickname" 
              placeholder="昵称搜索" 
              prefix-icon="Avatar"
              clearable
            />
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.gender" placeholder="性别" clearable>
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.roleId" placeholder="角色" clearable>
              <el-option 
                v-for="role in roleList" 
                :key="role.id" 
                :label="role.name" 
                :value="role.id" 
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.sortBy" placeholder="排序方式" clearable>
              <el-option label="上次登录时间(正序)" value="lastLoginAsc" />
              <el-option label="上次登录时间(倒序)" value="lastLoginDesc" />
            </el-select>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
            <el-col :span="12">
              <div class="date-picker-with-label">
                <label class="date-picker-label">注册时间</label>
                <el-date-picker
                  v-model="searchForm.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  placeholder="注册时间段"
                />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="date-picker-with-label">
                <label class="date-picker-label">上次登录时间</label>
                <el-date-picker
                  v-model="searchForm.lastLoginRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  placeholder="上次登录时间段"
                />
              </div>
            </el-col>
          </el-row>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

// 定义属性
const props = defineProps({
  roleList: {
    type: Array,
    default: () => []
  }
})

// 是否显示高级搜索
const showAdvanced = ref(false)

// 搜索表单
const searchForm = reactive({
  username: '',
  email: '',
  status: '',
  nickname: '',
  gender: '',
  roleId: '',
  dateRange: null, // [startDate, endDate]
  lastLoginRange: null, // [startDate, endDate]
  sortBy: ''
})

// 定义事件
const emit = defineEmits(['search', 'reset'])

// 处理搜索
const handleSearch = () => {
  emit('search', { ...searchForm })
}

// 处理重置
const handleReset = () => {
  searchForm.username = ''
  searchForm.email = ''
  searchForm.status = ''
  searchForm.nickname = ''
  searchForm.gender = ''
  searchForm.roleId = ''
  searchForm.dateRange = null
  searchForm.lastLoginRange = null
  searchForm.sortBy = ''
  emit('reset')
}
</script>

<style scoped>
.search-filters {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.advanced-filters {
  padding-top: 15px;
}

.mb-20 {
  margin-bottom: 20px;
}

.date-picker-with-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-picker-label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-filters .el-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-filters .el-col {
    width: 100% !important;
  }
}
</style>