<template>
  <div class="api-input-wide-card mb-8 rounded-3xl p-6 shadow-xl">
    <!-- 标题区域 -->
    <div class="wide-card-title mb-6">
      <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-200">
        <PhChartLine class="chart-line-icon mr-3" :size="20" />
        使用统计查询
      </h2>
      <p class="text-base text-gray-600 dark:text-gray-400">查询您的 API Key 使用情况和统计数据</p>
    </div>

    <!-- 输入区域 -->
    <div class="mx-auto max-w-4xl">
      <!-- 控制栏 -->
      <div class="control-bar mb-4 flex flex-wrap items-center justify-between gap-3">
        <!-- API Key 标签 -->
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          <PhKey class="mr-2" :size="16" />
          {{ multiKeyMode ? '输入您的 API Keys（每行一个或用逗号分隔）' : '输入您的 API Key' }}
        </label>

        <!-- 模式切换和查询按钮组 -->
        <div class="button-group flex items-center gap-2">
          <!-- 模式切换 -->
          <div
            class="mode-switch-group flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
          >
            <button
              class="mode-switch-btn"
              :class="{ active: !multiKeyMode }"
              title="单一模式"
              @click="multiKeyMode = false"
            >
              <PhKey class="mode-icon" :size="16" />
              <span class="ml-2 hidden sm:inline">单一</span>
            </button>
            <button
              class="mode-switch-btn"
              :class="{ active: multiKeyMode }"
              title="聚合模式"
              @click="multiKeyMode = true"
            >
              <PhStack class="mode-icon" :size="16" />
              <span class="ml-2 hidden sm:inline">聚合</span>
              <span
                v-if="multiKeyMode && parsedApiKeys.length > 0"
                class="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-semibold"
              >
                {{ parsedApiKeys.length }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div class="api-input-grid grid grid-cols-1 gap-4 lg:grid-cols-4">
        <!-- API Key 输入 -->
        <div class="lg:col-span-3">
          <!-- 单 Key 模式输入框 -->
          <input
            v-if="!multiKeyMode"
            v-model="apiKey"
            class="wide-card-input w-full"
            :disabled="loading"
            placeholder="请输入您的 API Key (cr_...)"
            type="password"
            @keyup.enter="queryStats"
          />

          <!-- 多 Key 模式输入框 -->
          <div v-else class="relative">
            <textarea
              v-model="apiKey"
              class="wide-card-input w-full resize-y"
              :disabled="loading"
              placeholder="请输入您的 API Keys，支持以下格式：&#10;cr_xxx&#10;cr_yyy&#10;或&#10;cr_xxx, cr_yyy"
              rows="4"
              @keyup.ctrl.enter="queryStats"
            />
            <button
              v-if="apiKey && !loading"
              class="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              title="清空输入"
              @click="clearInput"
            >
              <PhXCircle :size="16" />
            </button>
          </div>
        </div>

        <!-- 查询按钮 -->
        <div class="lg:col-span-1">
          <button
            class="btn btn-primary btn-query flex h-full w-full items-center justify-center gap-2"
            :disabled="loading || !hasValidInput"
            @click="queryStats"
          >
            <PhSpinner v-if="loading" class="loading-spinner" :size="16" />
            <PhMagnifyingGlass v-else :size="16" />
            {{ loading ? '查询中...' : '查询统计' }}
          </button>
        </div>
      </div>

      <!-- 安全提示 -->
      <div class="security-notice mt-4">
        <PhShieldCheck class="shield-icon mr-2" :size="16" />
        {{
          multiKeyMode
            ? '您的 API Keys 仅用于查询统计数据，不会被存储。聚合模式下部分个体化信息将不显示。'
            : '您的 API Key 仅用于查询自己的统计数据，不会被存储或用于其他用途'
        }}
      </div>

      <!-- 多 Key 模式额外提示 -->
      <div
        v-if="multiKeyMode"
        class="mt-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      >
        <PhLightbulb class="mr-2" :size="16" />
        <span>提示：最多支持同时查询 30 个 API Keys。使用 Ctrl+Enter 快速查询。</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  PhChartLine,
  PhKey,
  PhLightbulb,
  PhMagnifyingGlass,
  PhShieldCheck,
  PhSpinner,
  PhStack,
  PhXCircle
} from '@phosphor-icons/vue'
import { useApiStatsStore } from '@/stores/apistats'

const apiStatsStore = useApiStatsStore()
const { apiKey, loading, multiKeyMode } = storeToRefs(apiStatsStore)
const { queryStats, clearInput } = apiStatsStore

// 解析输入的 API Keys
const parsedApiKeys = computed(() => {
  if (!multiKeyMode.value || !apiKey.value) return []

  // 支持逗号和换行符分隔
  const keys = apiKey.value
    .split(/[,\n]+/)
    .map((key) => key.trim())
    .filter((key) => key.length > 0)

  // 去重并限制最多30个
  const uniqueKeys = [...new Set(keys)]
  return uniqueKeys.slice(0, 30)
})

// 判断是否有有效输入
const hasValidInput = computed(() => {
  if (multiKeyMode.value) {
    return parsedApiKeys.value.length > 0
  }
  return apiKey.value && apiKey.value.trim().length > 0
})
</script>

<style scoped>
/* 卡片样式 - 遵循设计规范 */
.api-input-wide-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid #e2e8f0;
  transition:
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out;
}

:global(.dark) .api-input-wide-card {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(71, 85, 105, 0.5);
}

/* 标题样式 */
.wide-card-title h2 {
  font-weight: 700;
  color: #1e293b;
}

:global(.dark) .wide-card-title h2 {
  color: #ffffff;
}

.wide-card-title p {
  color: #475569;
}

:global(.dark) .wide-card-title p {
  color: #94a3b8;
}

.wide-card-title .chart-line-icon {
  color: #3b82f6;
}

/* 网格布局 */
.api-input-grid {
  align-items: end;
  gap: 1rem;
}

/* 输入框样式 - 遵循设计规范 */
.wide-card-input {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 16px;
  transition: border-color 0.15s ease-in-out;
  color: #1e293b;
}

:global(.dark) .wide-card-input {
  background: #1e293b;
  border-color: rgba(71, 85, 105, 0.5);
  color: #ffffff;
}

.wide-card-input::placeholder {
  color: #94a3b8;
}

:global(.dark) .wide-card-input::placeholder {
  color: #64748b;
}

.wide-card-input:focus {
  outline: none;
  border-color: #3b82f6;
}

:global(.dark) .wide-card-input:focus {
  border-color: #3b82f6;
}

/* 按钮样式 - 全圆角 Pill */
.btn {
  font-weight: 500;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

/* 查询按钮特定样式 */
.btn-query {
  padding: 14px 24px;
  font-size: 16px;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 安全提示样式 - 简化 */
.security-notice {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  color: #475569;
  font-size: 0.875rem;
}

:global(.dark) .security-notice {
  background: rgba(51, 65, 85, 0.5);
  border-color: rgba(71, 85, 105, 0.5);
  color: #94a3b8;
}

.security-notice .shield-icon {
  color: #10b981;
}

/* 控制栏 */
.control-bar {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

:global(.dark) .control-bar {
  border-bottom-color: rgba(71, 85, 105, 0.5);
}

/* 按钮组 */
.button-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 模式切换组 - 全圆角 */
.mode-switch-group {
  display: inline-flex;
  padding: 4px;
  background: #f1f5f9;
  border-radius: 9999px;
}

:global(.dark) .mode-switch-group {
  background: #1e293b;
}

/* 模式切换按钮 - 全圆角 Pill */
.mode-switch-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  background: transparent;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
  white-space: nowrap;
}

:global(.dark) .mode-switch-btn {
  color: #94a3b8;
}

.mode-switch-btn:hover:not(.active) {
  color: #1e293b;
  background: #e2e8f0;
}

:global(.dark) .mode-switch-btn:hover:not(.active) {
  color: #ffffff;
  background: rgba(71, 85, 105, 0.5);
}

.mode-switch-btn.active {
  color: white;
  background: #3b82f6;
}

.mode-switch-btn .mode-icon {
  width: 14px;
  height: 14px;
}

/* 淡入淡出动画 - 简化 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 加载动画 */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .control-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .button-group {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .api-input-wide-card {
    padding: 1.25rem;
  }

  .wide-card-title {
    margin-bottom: 1.25rem;
  }

  .wide-card-title h2 {
    font-size: 1.5rem;
  }

  .wide-card-title p {
    font-size: 0.875rem;
  }

  .api-input-grid {
    gap: 1rem;
  }

  .wide-card-input {
    padding: 12px 14px;
    font-size: 15px;
  }

  .btn-query {
    padding: 12px 20px;
    font-size: 15px;
  }

  .security-notice {
    padding: 10px 14px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .mode-toggle-btn {
    padding: 5px 8px;
  }

  .toggle-icon {
    width: 18px;
    height: 18px;
  }

  .hint-text {
    font-size: 0.7rem;
    padding: 4px 8px;
  }
}

@media (max-width: 480px) {
  .api-input-wide-card {
    padding: 1rem;
  }

  .wide-card-title h2 {
    font-size: 1.25rem;
  }

  .wide-card-title p {
    font-size: 0.8rem;
  }

  .wide-card-input {
    padding: 10px 12px;
    font-size: 14px;
  }

  .btn-query {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>
