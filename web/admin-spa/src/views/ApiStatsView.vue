<template>
  <div class="min-h-screen p-4 md:p-6" :class="isDarkMode ? 'gradient-bg-dark' : 'gradient-bg'">
    <!-- 顶部导航 -->
    <div class="glass-strong mb-6 rounded-3xl p-4 shadow-xl md:mb-8 md:p-6">
      <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
        <LogoTitle
          :loading="oemLoading"
          :logo-src="oemSettings.siteIconData || oemSettings.siteIcon"
          :subtitle="currentTab === 'stats' ? 'API Key 使用统计' : '使用教程'"
          :title="oemSettings.siteName"
        />
        <div class="flex items-center gap-2 md:gap-4">
          <!-- 主题切换按钮 -->
          <div class="flex items-center">
            <ThemeToggle mode="dropdown" />
          </div>

          <!-- 分隔线 -->
          <div
            v-if="oemSettings.ldapEnabled || oemSettings.showAdminButton !== false"
            class="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-50 dark:via-gray-600"
          />

          <!-- 用户登录按钮 (仅在 LDAP 启用时显示) -->
          <router-link
            v-if="oemSettings.ldapEnabled"
            class="user-login-button flex items-center gap-2 rounded-2xl px-4 py-2 text-white transition-all duration-300 md:px-5 md:py-2.5"
            to="/user-login"
          >
            <PhUser class="text-sm md:text-base" :size="16" />
            <span class="text-xs font-semibold tracking-wide md:text-sm">用户登录</span>
          </router-link>
          <!-- 管理后台按钮 -->
          <router-link
            v-if="oemSettings.showAdminButton !== false"
            class="admin-button-refined flex items-center gap-2 rounded-2xl px-4 py-2 transition-all duration-300 md:px-5 md:py-2.5"
            to="/dashboard"
          >
            <PhShieldCheck class="text-sm md:text-base" :size="16" />
            <span class="text-xs font-semibold tracking-wide md:text-sm">管理后台</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="mb-6 md:mb-8">
      <div class="flex justify-center">
        <div
          class="inline-flex w-full max-w-md rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800 md:w-auto"
        >
          <button
            :class="['tab-pill-button', currentTab === 'stats' ? 'active' : '']"
            @click="currentTab = 'stats'"
          >
            <PhChartLine class="mr-1 md:mr-2" :size="16" />
            <span class="text-sm md:text-base">统计查询</span>
          </button>
          <button
            :class="['tab-pill-button', currentTab === 'tutorial' ? 'active' : '']"
            @click="currentTab = 'tutorial'"
          >
            <PhGraduationCap class="mr-1 md:mr-2" :size="16" />
            <span class="text-sm md:text-base">使用教程</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 统计内容 -->
    <div v-if="currentTab === 'stats'" class="tab-content">
      <!-- API Key 输入区域 -->
      <ApiKeyInput />

      <!-- 错误提示 -->
      <div v-if="error" class="mb-6 md:mb-8">
        <div
          class="rounded-xl border border-red-500/30 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-900/20 dark:text-red-200 md:p-4 md:text-base"
        >
          <PhWarningCircle class="mr-2" :size="16" />
          {{ error }}
        </div>
      </div>

      <!-- 统计数据展示区域 -->
      <div v-if="statsData" class="fade-in">
        <div class="glass-strong rounded-3xl p-4 shadow-xl md:p-6">
          <!-- 时间范围选择器 -->
          <div class="mb-4 border-b border-gray-200 pb-4 dark:border-gray-700 md:mb-6 md:pb-6">
            <div
              class="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center md:gap-4"
            >
              <div class="flex items-center gap-2 md:gap-3">
                <PhClock class="text-base text-blue-500 md:text-lg" :size="20" />
                <span class="text-base font-medium text-gray-700 dark:text-gray-200 md:text-lg"
                  >统计时间范围</span
                >
              </div>
              <div class="flex w-full gap-2 md:w-auto">
                <button
                  class="flex flex-1 items-center justify-center gap-1 px-4 py-2 text-xs font-medium md:flex-none md:gap-2 md:px-6 md:text-sm"
                  :class="['period-btn', { active: statsPeriod === 'daily' }]"
                  :disabled="loading || modelStatsLoading"
                  @click="switchPeriod('daily')"
                >
                  <PhCalendar class="text-xs md:text-sm" :size="16" />
                  今日
                </button>
                <button
                  class="flex flex-1 items-center justify-center gap-1 px-4 py-2 text-xs font-medium md:flex-none md:gap-2 md:px-6 md:text-sm"
                  :class="['period-btn', { active: statsPeriod === 'monthly' }]"
                  :disabled="loading || modelStatsLoading"
                  @click="switchPeriod('monthly')"
                >
                  <PhCalendarBlank class="text-xs md:text-sm" :size="16" />
                  本月
                </button>
              </div>
            </div>
          </div>

          <!-- 基本信息和统计概览 -->
          <StatsOverview />

          <!-- Token 分布和限制配置 -->
          <div
            class="mb-6 mt-6 grid grid-cols-1 gap-4 md:mb-8 md:mt-8 md:gap-6 xl:grid-cols-2 xl:items-stretch"
          >
            <TokenDistribution class="h-full" />
            <template v-if="multiKeyMode">
              <AggregatedStatsCard class="h-full" />
            </template>
            <template v-else>
              <LimitConfig class="h-full" />
            </template>
          </div>

          <!-- 模型使用统计 -->
          <ModelUsageStats />
        </div>
      </div>
    </div>

    <!-- 教程内容 -->
    <div v-if="currentTab === 'tutorial'" class="tab-content">
      <div class="glass-strong rounded-3xl shadow-xl">
        <TutorialView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  PhCalendar,
  PhCalendarBlank,
  PhChartLine,
  PhClock,
  PhGraduationCap,
  PhShieldCheck,
  PhUser,
  PhWarningCircle
} from '@phosphor-icons/vue'
import { useApiStatsStore } from '@/stores/apistats'
import { useThemeStore } from '@/stores/theme'
import LogoTitle from '@/components/common/LogoTitle.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import ApiKeyInput from '@/components/apistats/ApiKeyInput.vue'
import StatsOverview from '@/components/apistats/StatsOverview.vue'
import TokenDistribution from '@/components/apistats/TokenDistribution.vue'
import LimitConfig from '@/components/apistats/LimitConfig.vue'
import AggregatedStatsCard from '@/components/apistats/AggregatedStatsCard.vue'
import ModelUsageStats from '@/components/apistats/ModelUsageStats.vue'
import TutorialView from './TutorialView.vue'

const route = useRoute()
const apiStatsStore = useApiStatsStore()
const themeStore = useThemeStore()

// 当前标签页
const currentTab = ref('stats')

// 主题相关
const isDarkMode = computed(() => themeStore.isDarkMode)

const {
  apiKey,
  apiId,
  loading,
  modelStatsLoading,
  oemLoading,
  error,
  statsPeriod,
  statsData,
  oemSettings,
  multiKeyMode
} = storeToRefs(apiStatsStore)

const { queryStats, switchPeriod, loadStatsWithApiId, loadOemSettings, reset } = apiStatsStore

// 处理键盘快捷键
const handleKeyDown = (event) => {
  // Ctrl/Cmd + Enter 查询
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    if (!loading.value && apiKey.value.trim()) {
      queryStats()
    }
    event.preventDefault()
  }

  // ESC 清除数据
  if (event.key === 'Escape') {
    reset()
  }
}

// 初始化
onMounted(() => {
  // API Stats Page loaded

  // 初始化主题（因为该页面不在 MainLayout 内）
  themeStore.initTheme()

  // 加载 OEM 设置
  loadOemSettings()

  // 检查 URL 参数
  const urlApiId = route.query.apiId
  const urlApiKey = route.query.apiKey

  if (
    urlApiId &&
    urlApiId.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i)
  ) {
    // 如果 URL 中有 apiId，直接使用 apiId 加载数据
    apiId.value = urlApiId
    loadStatsWithApiId()
  } else if (urlApiKey && urlApiKey.length > 10) {
    // 向后兼容，支持 apiKey 参数
    apiKey.value = urlApiKey
  }

  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeyDown)
})

// 清理
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// 监听 API Key 变化
watch(apiKey, (newValue) => {
  if (!newValue) {
    apiStatsStore.clearData()
  }
})
</script>

<style scoped>
/* 简洁背景 - 遵循设计规范 */
.gradient-bg {
  background: #f8fafc;
  min-height: 100vh;
  position: relative;
}

/* 暗色模式背景 - Slate-800 */
.gradient-bg-dark {
  background: #1e293b;
  min-height: 100vh;
  position: relative;
}

/* 卡片样式 - 遵循设计规范（移除 backdrop-filter 提升滚动性能） */
.glass-strong {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  position: relative;
  z-index: 1;
}

/* 暗色模式卡片样式 */
:global(.dark) .glass-strong {
  background: rgba(31, 41, 55, 0.95);
  border-color: rgba(71, 85, 105, 0.5);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3);
}

/* 标题样式 */
.header-title {
  color: #1e293b;
  font-weight: 700;
  letter-spacing: -0.025em;
}

:global(.dark) .header-title {
  color: #ffffff;
}

/* 用户登录按钮 - 全圆角 Pill */
.user-login-button {
  background: #10b981;
  border: none;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.15s ease-in-out;
}

:global(.dark) .user-login-button {
  background: #10b981;
  color: white;
}

.user-login-button:hover {
  background: #059669;
}

/* 管理后台按钮 - 全圆角 Pill */
.admin-button-refined {
  background: #3b82f6;
  border: none;
  border-radius: 9999px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.15s ease-in-out;
}

:global(.dark) .admin-button-refined {
  background: #3b82f6;
  color: white;
}

.admin-button-refined:hover {
  background: #2563eb;
}

:global(.dark) .admin-button-refined:hover {
  background: #60a5fa;
}

/* 时间范围按钮 - 全圆角 Pill */
.period-btn {
  border-radius: 9999px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
}

.period-btn.active {
  background: #3b82f6;
  color: white;
}

.period-btn:not(.active) {
  color: #475569;
  background: #f1f5f9;
}

:global(html.dark) .period-btn:not(.active) {
  color: #94a3b8;
  background: rgba(51, 65, 85, 0.6);
}

.period-btn:not(.active):hover {
  background: #e2e8f0;
  color: #1e293b;
}

:global(html.dark) .period-btn:not(.active):hover {
  background: rgba(71, 85, 105, 0.8);
  color: #ffffff;
}

/* Tab 胶囊按钮样式 - 全圆角 Pill */
.tab-pill-button {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
  color: #475569;
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  flex: 1;
  justify-content: center;
}

:global(html.dark) .tab-pill-button {
  color: #94a3b8;
}

@media (min-width: 768px) {
  .tab-pill-button {
    padding: 0.625rem 1.25rem;
    flex: none;
  }
}

.tab-pill-button:hover {
  color: #1e293b;
  background: rgba(255, 255, 255, 0.5);
}

:global(html.dark) .tab-pill-button:hover {
  color: #f3f4f6;
  background: rgba(71, 85, 105, 0.4);
}

.tab-pill-button.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:global(html.dark) .tab-pill-button.active {
  background: #334155;
  color: #f3f4f6;
}

/* Tab 内容切换动画 - 优化性能 */
.tab-content {
  animation: tabFadeIn 0.3s ease-in-out;
}

@keyframes tabFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 动画效果 - 简化 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
