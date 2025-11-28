<template>
  <div>
    <!-- 主要统计 -->
    <div
      class="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 md:mb-8 md:gap-6 lg:grid-cols-4"
    >
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 sm:text-sm">
              总API Keys
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              {{ dashboardData.totalApiKeys }}
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              活跃: {{ dashboardData.activeApiKeys || 0 }}
            </p>
          </div>
          <div class="stat-icon flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600">
            <PhKey :size="20" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 sm:text-sm">
              服务账户
            </p>
            <div class="flex flex-wrap items-baseline gap-x-2">
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                {{ dashboardData.totalAccounts }}
              </p>
              <!-- 各平台账户数量展示 -->
              <div v-if="dashboardData.accountsByPlatform" class="flex items-center gap-2">
                <!-- Claude账户 -->
                <div
                  v-if="
                    dashboardData.accountsByPlatform.claude &&
                    dashboardData.accountsByPlatform.claude.total > 0
                  "
                  class="inline-flex items-center gap-0.5"
                  :title="`Claude: ${dashboardData.accountsByPlatform.claude.total} 个 (正常: ${dashboardData.accountsByPlatform.claude.normal})`"
                >
                  <PhBrain class="text-indigo-600" :size="12" />
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{
                    dashboardData.accountsByPlatform.claude.total
                  }}</span>
                </div>
                <!-- Claude Console账户 -->
                <div
                  v-if="
                    dashboardData.accountsByPlatform['claude-console'] &&
                    dashboardData.accountsByPlatform['claude-console'].total > 0
                  "
                  class="inline-flex items-center gap-0.5"
                  :title="`Console: ${dashboardData.accountsByPlatform['claude-console'].total} 个 (正常: ${dashboardData.accountsByPlatform['claude-console'].normal})`"
                >
                  <PhTerminal class="text-purple-600" :size="12" />
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{
                    dashboardData.accountsByPlatform['claude-console'].total
                  }}</span>
                </div>
                <!-- Gemini账户 -->
                <div
                  v-if="
                    dashboardData.accountsByPlatform.gemini &&
                    dashboardData.accountsByPlatform.gemini.total > 0
                  "
                  class="inline-flex items-center gap-0.5"
                  :title="`Gemini: ${dashboardData.accountsByPlatform.gemini.total} 个 (正常: ${dashboardData.accountsByPlatform.gemini.normal})`"
                >
                  <PhRobot class="text-yellow-600" :size="12" />
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{
                    dashboardData.accountsByPlatform.gemini.total
                  }}</span>
                </div>
                <!-- Bedrock账户 -->
                <div
                  v-if="
                    dashboardData.accountsByPlatform.bedrock &&
                    dashboardData.accountsByPlatform.bedrock.total > 0
                  "
                  class="inline-flex items-center gap-0.5"
                  :title="`Bedrock: ${dashboardData.accountsByPlatform.bedrock.total} 个 (正常: ${dashboardData.accountsByPlatform.bedrock.normal})`"
                >
                  <PhCloud class="text-orange-600" :size="12" />
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{
                    dashboardData.accountsByPlatform.bedrock.total
                  }}</span>
                </div>
                <!-- OpenAI账户 -->
                <div
                  v-if="
                    dashboardData.accountsByPlatform.openai &&
                    dashboardData.accountsByPlatform.openai.total > 0
                  "
                  class="inline-flex items-center gap-0.5"
                  :title="`OpenAI: ${dashboardData.accountsByPlatform.openai.total} 个 (正常: ${dashboardData.accountsByPlatform.openai.normal})`"
                >
                  <PhRobot class="text-gray-100" :size="12" />
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{
                    dashboardData.accountsByPlatform.openai.total
                  }}</span>
                </div>
                <!-- Azure OpenAI账户 -->
                <div
                  v-if="
                    dashboardData.accountsByPlatform.azure_openai &&
                    dashboardData.accountsByPlatform.azure_openai.total > 0
                  "
                  class="inline-flex items-center gap-0.5"
                  :title="`Azure OpenAI: ${dashboardData.accountsByPlatform.azure_openai.total} 个 (正常: ${dashboardData.accountsByPlatform.azure_openai.normal})`"
                >
                  <PhSquaresFour class="text-blue-600" :size="12" />
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{
                    dashboardData.accountsByPlatform.azure_openai.total
                  }}</span>
                </div>
                <!-- OpenAI-Responses账户 -->
                <div
                  v-if="
                    dashboardData.accountsByPlatform['openai-responses'] &&
                    dashboardData.accountsByPlatform['openai-responses'].total > 0
                  "
                  class="inline-flex items-center gap-0.5"
                  :title="`OpenAI Responses: ${dashboardData.accountsByPlatform['openai-responses'].total} 个 (正常: ${dashboardData.accountsByPlatform['openai-responses'].normal})`"
                >
                  <PhHardDrives class="text-cyan-600" :size="12" />
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{
                    dashboardData.accountsByPlatform['openai-responses'].total
                  }}</span>
                </div>
              </div>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              正常: {{ dashboardData.normalAccounts || 0 }}
              <span v-if="dashboardData.abnormalAccounts > 0" class="text-red-600">
                | 异常: {{ dashboardData.abnormalAccounts }}
              </span>
              <span
                v-if="dashboardData.pausedAccounts > 0"
                class="text-gray-600 dark:text-gray-400"
              >
                | 停止调度: {{ dashboardData.pausedAccounts }}
              </span>
              <span v-if="dashboardData.rateLimitedAccounts > 0" class="text-yellow-600">
                | 限流: {{ dashboardData.rateLimitedAccounts }}
              </span>
            </p>
          </div>
          <div class="stat-icon ml-2 flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600">
            <PhUserCircle :size="20" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 sm:text-sm">
              今日请求
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              {{ dashboardData.todayRequests }}
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              总请求: {{ formatNumber(dashboardData.totalRequests || 0) }}
            </p>
          </div>
          <div class="stat-icon flex-shrink-0 bg-gradient-to-br from-purple-500 to-purple-600">
            <PhChartLine :size="20" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 sm:text-sm">
              系统状态
            </p>
            <p class="text-2xl font-bold text-green-600 sm:text-3xl">
              {{ dashboardData.systemStatus }}
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              运行时间: {{ formattedUptime }}
            </p>
          </div>
          <div class="stat-icon flex-shrink-0 bg-gradient-to-br from-yellow-500 to-orange-500">
            <PhHeartbeat :size="20" />
          </div>
        </div>
      </div>
    </div>

    <!-- Token统计和性能指标 -->
    <div
      class="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 md:mb-8 md:gap-6 lg:grid-cols-4"
    >
      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div class="mr-8 flex-1">
            <p class="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 sm:text-sm">
              今日Token
            </p>
            <div class="mb-2 flex flex-wrap items-baseline gap-2">
              <p class="text-xl font-bold text-blue-600 sm:text-2xl md:text-3xl">
                {{
                  formatNumber(
                    (dashboardData.todayInputTokens || 0) +
                      (dashboardData.todayOutputTokens || 0) +
                      (dashboardData.todayCacheCreateTokens || 0) +
                      (dashboardData.todayCacheReadTokens || 0)
                  )
                }}
              </p>
              <span class="text-sm font-medium text-green-600"
                >/ {{ costsData.todayCosts.formatted.totalCost }}</span
              >
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <div class="flex flex-wrap items-center justify-between gap-x-4">
                <span
                  >输入:
                  <span class="font-medium">{{
                    formatNumber(dashboardData.todayInputTokens || 0)
                  }}</span></span
                >
                <span
                  >输出:
                  <span class="font-medium">{{
                    formatNumber(dashboardData.todayOutputTokens || 0)
                  }}</span></span
                >
                <span v-if="(dashboardData.todayCacheCreateTokens || 0) > 0" class="text-purple-600"
                  >缓存创建:
                  <span class="font-medium">{{
                    formatNumber(dashboardData.todayCacheCreateTokens || 0)
                  }}</span></span
                >
                <span v-if="(dashboardData.todayCacheReadTokens || 0) > 0" class="text-purple-600"
                  >缓存读取:
                  <span class="font-medium">{{
                    formatNumber(dashboardData.todayCacheReadTokens || 0)
                  }}</span></span
                >
              </div>
            </div>
          </div>
          <div class="stat-icon flex-shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-600">
            <PhCoins :size="20" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div class="mr-8 flex-1">
            <p class="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 sm:text-sm">
              总Token消耗
            </p>
            <div class="mb-2 flex flex-wrap items-baseline gap-2">
              <p class="text-xl font-bold text-emerald-600 sm:text-2xl md:text-3xl">
                {{
                  formatNumber(
                    (dashboardData.totalInputTokens || 0) +
                      (dashboardData.totalOutputTokens || 0) +
                      (dashboardData.totalCacheCreateTokens || 0) +
                      (dashboardData.totalCacheReadTokens || 0)
                  )
                }}
              </p>
              <span class="text-sm font-medium text-green-600"
                >/ {{ costsData.totalCosts.formatted.totalCost }}</span
              >
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <div class="flex flex-wrap items-center justify-between gap-x-4">
                <span
                  >输入:
                  <span class="font-medium">{{
                    formatNumber(dashboardData.totalInputTokens || 0)
                  }}</span></span
                >
                <span
                  >输出:
                  <span class="font-medium">{{
                    formatNumber(dashboardData.totalOutputTokens || 0)
                  }}</span></span
                >
                <span v-if="(dashboardData.totalCacheCreateTokens || 0) > 0" class="text-purple-600"
                  >缓存创建:
                  <span class="font-medium">{{
                    formatNumber(dashboardData.totalCacheCreateTokens || 0)
                  }}</span></span
                >
                <span v-if="(dashboardData.totalCacheReadTokens || 0) > 0" class="text-purple-600"
                  >缓存读取:
                  <span class="font-medium">{{
                    formatNumber(dashboardData.totalCacheReadTokens || 0)
                  }}</span></span
                >
              </div>
            </div>
          </div>
          <div class="stat-icon flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600">
            <PhDatabase :size="20" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 sm:text-sm">
              实时RPM
              <span class="text-xs text-gray-400">({{ dashboardData.metricsWindow }}分钟)</span>
            </p>
            <p class="text-2xl font-bold text-orange-600 sm:text-3xl">
              {{ dashboardData.realtimeRPM || 0 }}
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              每分钟请求数
              <span v-if="dashboardData.isHistoricalMetrics" class="text-yellow-600">
                <PhWarning class="inline" :size="12" /> 历史数据
              </span>
            </p>
          </div>
          <div class="stat-icon flex-shrink-0 bg-gradient-to-br from-orange-500 to-orange-600">
            <PhGauge :size="20" />
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400 sm:text-sm">
              实时TPM
              <span class="text-xs text-gray-400">({{ dashboardData.metricsWindow }}分钟)</span>
            </p>
            <p class="text-2xl font-bold text-rose-600 sm:text-3xl">
              {{ formatNumber(dashboardData.realtimeTPM || 0) }}
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              每分钟Token数
              <span v-if="dashboardData.isHistoricalMetrics" class="text-yellow-600">
                <PhWarning class="inline" :size="12" /> 历史数据
              </span>
            </p>
          </div>
          <div class="stat-icon flex-shrink-0 bg-gradient-to-br from-rose-500 to-rose-600">
            <PhRocket :size="20" />
          </div>
        </div>
      </div>
    </div>

    <!-- 模型消费统计 -->
    <div class="mb-8">
      <div class="mb-4 flex flex-col gap-4 sm:mb-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl">
          模型使用分布与Token使用趋势
        </h3>
        <div class="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-end">
          <!-- 快捷日期选择 -->
          <div
            class="flex flex-shrink-0 gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-700"
          >
            <button
              v-for="option in dateFilter.presetOptions"
              :key="option.value"
              :class="[
                'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                dateFilter.preset === option.value && dateFilter.type === 'preset'
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
              ]"
              @click="setDateFilterPreset(option.value)"
            >
              {{ option.label }}
            </button>
          </div>

          <!-- 粒度切换按钮 -->
          <div class="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
            <button
              :class="[
                'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                trendGranularity === 'day'
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
              ]"
              @click="setTrendGranularity('day')"
            >
              <PhCalendarBlank class="mr-1" :size="14" />按天
            </button>
            <button
              :class="[
                'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                trendGranularity === 'hour'
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
              ]"
              @click="setTrendGranularity('hour')"
            >
              <PhClock class="mr-1" :size="14" />按小时
            </button>
          </div>

          <!-- Element Plus 日期范围选择器 -->
          <div class="flex items-center gap-2">
            <el-date-picker
              v-model="dateFilter.customRange"
              class="custom-date-picker w-full lg:w-auto"
              :default-time="defaultTime"
              :disabled-date="disabledDate"
              end-placeholder="结束日期"
              format="YYYY-MM-DD HH:mm:ss"
              range-separator="至"
              size="default"
              start-placeholder="开始日期"
              style="max-width: 400px"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="onCustomDateRangeChange"
            />
            <span v-if="trendGranularity === 'hour'" class="text-xs text-orange-600">
              <PhInfo class="inline" :size="12" /> 最多24小时
            </span>
          </div>

          <!-- 刷新控制 -->
          <div class="flex items-center gap-2">
            <!-- 自动刷新控制 -->
            <div class="flex items-center rounded-lg bg-gray-100 px-3 py-1 dark:bg-gray-700">
              <label class="relative inline-flex cursor-pointer items-center">
                <input v-model="autoRefreshEnabled" class="peer sr-only" type="checkbox" />
                <!-- 更小的开关 -->
                <div
                  class="peer relative h-5 w-9 rounded-full bg-gray-300 transition-all duration-200 after:absolute after:left-[2px] after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-4 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:bg-gray-600 dark:after:bg-gray-300 dark:peer-focus:ring-blue-600"
                />
                <span
                  class="ml-2.5 flex select-none items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  <PhArrowClockwise class="text-gray-500 dark:text-gray-400" :size="12" />
                  <span>自动刷新</span>
                  <span
                    v-if="autoRefreshEnabled"
                    class="ml-1 font-mono text-xs text-blue-600 transition-opacity"
                    :class="refreshCountdown > 0 ? 'opacity-100' : 'opacity-0'"
                  >
                    {{ refreshCountdown }}s
                  </span>
                </span>
              </label>
            </div>

            <!-- 刷新按钮 -->
            <button
              class="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 sm:gap-2"
              :disabled="isRefreshing"
              title="立即刷新数据"
              @click="refreshAllData()"
            >
              <PhArrowsClockwise :class="{ 'animate-spin': isRefreshing }" :size="12" />
              <span class="hidden sm:inline">{{ isRefreshing ? '刷新中' : '刷新' }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 饼图 -->
        <div class="card p-4 sm:p-6">
          <h4 class="mb-4 text-base font-semibold text-gray-800 dark:text-gray-200 sm:text-lg">
            Token使用分布
          </h4>
          <div class="relative" style="height: 280px">
            <v-chart
              ref="modelUsageChartRef"
              :autoresize="true"
              class="chart"
              :option="modelUsageChartOption"
            />
          </div>
        </div>

        <!-- 详细数据表格 -->
        <div class="card p-4 sm:p-6">
          <h4 class="mb-4 text-base font-semibold text-gray-800 dark:text-gray-200 sm:text-lg">
            详细统计数据
          </h4>
          <div v-if="dashboardModelStats.length === 0" class="py-8 text-center">
            <p class="text-sm text-gray-500 sm:text-base">暂无模型使用数据</p>
          </div>
          <div v-else class="max-h-[250px] overflow-auto sm:max-h-[300px]">
            <table class="min-w-full">
              <thead class="sticky top-0 bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 sm:px-4"
                  >
                    模型
                  </th>
                  <th
                    class="hidden px-2 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-300 sm:table-cell sm:px-4"
                  >
                    请求数
                  </th>
                  <th
                    class="px-2 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-300 sm:px-4"
                  >
                    总Token
                  </th>
                  <th
                    class="px-2 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-300 sm:px-4"
                  >
                    费用
                  </th>
                  <th
                    class="hidden px-2 py-2 text-right text-xs font-medium text-gray-700 dark:text-gray-300 sm:table-cell sm:px-4"
                  >
                    占比
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                <tr
                  v-for="stat in dashboardModelStats"
                  :key="stat.model"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td class="px-2 py-2 text-xs text-gray-900 dark:text-gray-100 sm:px-4 sm:text-sm">
                    <span class="block max-w-[100px] truncate sm:max-w-none" :title="stat.model">
                      {{ stat.model }}
                    </span>
                  </td>
                  <td
                    class="hidden px-2 py-2 text-right text-xs text-gray-600 dark:text-gray-400 sm:table-cell sm:px-4 sm:text-sm"
                  >
                    {{ formatNumber(stat.requests) }}
                  </td>
                  <td
                    class="px-2 py-2 text-right text-xs text-gray-600 dark:text-gray-400 sm:px-4 sm:text-sm"
                  >
                    {{ formatNumber(stat.allTokens) }}
                  </td>
                  <td
                    class="px-2 py-2 text-right text-xs font-medium text-green-600 sm:px-4 sm:text-sm"
                  >
                    {{ stat.formatted ? stat.formatted.total : '$0.000000' }}
                  </td>
                  <td
                    class="hidden px-2 py-2 text-right text-xs font-medium sm:table-cell sm:px-4 sm:text-sm"
                  >
                    <span
                      class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {{ calculatePercentage(stat.allTokens, dashboardModelStats) }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Token使用趋势图 -->
    <div class="mb-4 sm:mb-6 md:mb-8">
      <div class="card p-4 sm:p-6">
        <div class="sm:h-[350px]" style="height: 300px">
          <v-chart
            ref="usageTrendChartRef"
            :autoresize="true"
            class="chart"
            :option="usageTrendChartOption"
          />
        </div>
      </div>
    </div>

    <!-- API Keys 使用趋势图 -->
    <div class="mb-4 sm:mb-6 md:mb-8">
      <div class="card p-4 sm:p-6">
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            API Keys 使用趋势
          </h3>
          <!-- 维度切换按钮 -->
          <div class="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
            <button
              :class="[
                'rounded-md px-2 py-1 text-xs font-medium transition-colors sm:px-3 sm:text-sm',
                apiKeysTrendMetric === 'requests'
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
              ]"
              @click="((apiKeysTrendMetric = 'requests'), reloadApiKeysUsageTrendChart())"
            >
              <PhArrowsLeftRight class="mr-1" :size="14" /><span class="hidden sm:inline"
                >请求次数</span
              ><span class="sm:hidden">请求</span>
            </button>
            <button
              :class="[
                'rounded-md px-2 py-1 text-xs font-medium transition-colors sm:px-3 sm:text-sm',
                apiKeysTrendMetric === 'tokens'
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
              ]"
              @click="((apiKeysTrendMetric = 'tokens'), reloadApiKeysUsageTrendChart())"
            >
              <PhCoins class="mr-1" :size="14" /><span class="hidden sm:inline">Token 数量</span
              ><span class="sm:hidden">Token</span>
            </button>
          </div>
        </div>
        <div class="mb-4 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
          <span v-if="apiKeysTrendData.totalApiKeys > 10">
            共 {{ apiKeysTrendData.totalApiKeys }} 个 API Key，显示使用量前 10 个
          </span>
          <span v-else> 共 {{ apiKeysTrendData.totalApiKeys }} 个 API Key </span>
        </div>
        <div class="sm:h-[350px]" style="height: 300px">
          <v-chart
            ref="apiKeysUsageTrendChartRef"
            :autoresize="true"
            class="chart"
            :option="apiKeysUsageTrendChartOption"
          />
        </div>
      </div>
    </div>

    <!-- 账号使用趋势图 -->
    <div class="mb-4 sm:mb-6 md:mb-8">
      <div class="card p-4 sm:p-6">
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
              账号使用趋势
            </h3>
            <span class="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              当前分组：{{ accountUsageTrendData.groupLabel || '未选择' }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <div class="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
              <button
                v-for="option in accountGroupOptions"
                :key="option.value"
                :class="[
                  'rounded-md px-2 py-1 text-xs font-medium transition-colors sm:px-3 sm:text-sm',
                  accountUsageGroup === option.value
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                ]"
                @click="handleAccountUsageGroupChange(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
        <div
          class="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400 sm:text-sm"
        >
          <span>共 {{ accountUsageTrendData.totalAccounts || 0 }} 个账号</span>
          <span
            v-if="accountUsageTrendData.topAccounts && accountUsageTrendData.topAccounts.length"
          >
            显示消耗排名前 {{ accountUsageTrendData.topAccounts.length }} 个账号
          </span>
        </div>
        <div
          v-if="!accountUsageTrendData.data || accountUsageTrendData.data.length === 0"
          class="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          暂无账号使用数据
        </div>
        <div v-else class="sm:h-[350px]" style="height: 300px">
          <v-chart
            ref="accountUsageTrendChartRef"
            :autoresize="true"
            class="chart"
            :option="accountUsageTrendChartOption"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboard'
import { useThemeStore } from '@/stores/theme'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useChartConfig } from '@/composables/useChartConfig'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

import {
  PhKey,
  PhBrain,
  PhTerminal,
  PhRobot,
  PhCloud,
  PhSquaresFour,
  PhHardDrives,
  PhUserCircle,
  PhChartLine,
  PhHeartbeat,
  PhCoins,
  PhDatabase,
  PhWarning,
  PhGauge,
  PhRocket,
  PhCalendarBlank,
  PhClock,
  PhInfo,
  PhArrowClockwise,
  PhArrowsClockwise,
  PhArrowsLeftRight
} from '@phosphor-icons/vue'

const dashboardStore = useDashboardStore()
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

const {
  dashboardData,
  costsData,
  dashboardModelStats,
  trendData,
  apiKeysTrendData,
  accountUsageTrendData,
  accountUsageGroup,
  formattedUptime,
  dateFilter,
  trendGranularity,
  apiKeysTrendMetric,
  defaultTime
} = storeToRefs(dashboardStore)

const {
  loadDashboardData,
  loadApiKeysTrend,
  setDateFilterPreset,
  onCustomDateRangeChange,
  setTrendGranularity,
  refreshChartsData,
  setAccountUsageGroup,
  disabledDate
} = dashboardStore

// ECharts 组件引用
const modelUsageChartRef = ref(null)
const usageTrendChartRef = ref(null)
const apiKeysUsageTrendChartRef = ref(null)
const accountUsageTrendChartRef = ref(null)

// ECharts 配置
const { getDoughnutOptions, getLineOptions, getMultiLineOptions } = useChartConfig()

// 图表配置 options
const modelUsageChartOption = ref({})
const usageTrendChartOption = ref({})
const apiKeysUsageTrendChartOption = ref({})
const accountUsageTrendChartOption = ref({})

const accountGroupOptions = [
  { value: 'claude', label: 'Claude' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'droid', label: 'Droid' }
]

const accountTrendUpdating = ref(false)

// 自动刷新相关
const autoRefreshEnabled = ref(false)
const autoRefreshInterval = ref(30) // 秒
const autoRefreshTimer = ref(null)
const refreshCountdown = ref(0)
const countdownTimer = ref(null)
const isRefreshing = ref(false)

// 计算倒计时显示
// const refreshCountdownDisplay = computed(() => {
//   if (!autoRefreshEnabled.value || refreshCountdown.value <= 0) return ''
//   return `${refreshCountdown.value}秒后刷新`
// })

// 格式化数字
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toString()
}

// 计算百分比
function calculatePercentage(value, stats) {
  if (!stats || stats.length === 0) return 0
  const total = stats.reduce((sum, stat) => sum + stat.allTokens, 0)
  if (total === 0) return 0
  return ((value / total) * 100).toFixed(1)
}

// 更新模型使用饼图
function updateModelUsageChart() {
  const data = dashboardModelStats.value || []
  if (data.length === 0) {
    modelUsageChartOption.value = {}
    return
  }

  const chartData = data.map((d) => ({
    name: d.model,
    value: d.allTokens
  }))

  modelUsageChartOption.value = getDoughnutOptions(chartData)
}

// 更新使用趋势图
function updateUsageTrendChart() {
  const data = trendData.value || []
  if (data.length === 0) {
    usageTrendChartOption.value = {}
    return
  }

  // 根据数据类型确定标签字段和格式
  const labelField = data[0]?.date ? 'date' : 'hour'
  const labels = data.map((d) => {
    if (d.label) return d.label
    if (labelField === 'hour') {
      const date = new Date(d.hour)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      return `${month}/${day} ${hour}:00`
    }
    const dateStr = d.date
    if (dateStr && dateStr.includes('-')) {
      const parts = dateStr.split('-')
      if (parts.length >= 3) return `${parts[1]}/${parts[2]}`
    }
    return d.date
  })

  const datasets = [
    {
      label: '输入Token',
      data: data.map((d) => d.inputTokens || 0),
      color: '#6366F1',
      showArea: true
    },
    {
      label: '输出Token',
      data: data.map((d) => d.outputTokens || 0),
      color: '#EC4899',
      showArea: true
    },
    {
      label: '缓存创建Token',
      data: data.map((d) => d.cacheCreateTokens || 0),
      color: '#3B82F6',
      showArea: false
    },
    {
      label: '缓存读取Token',
      data: data.map((d) => d.cacheReadTokens || 0),
      color: '#8B5CF6',
      showArea: false
    },
    {
      label: '费用 (USD)',
      data: data.map((d) => d.cost || 0),
      color: '#22C55E',
      yAxisIndex: 1,
      showArea: false
    },
    {
      label: '请求数',
      data: data.map((d) => d.requests || 0),
      color: '#10B981',
      yAxisIndex: 1,
      showArea: false
    }
  ]

  usageTrendChartOption.value = getLineOptions(labels, datasets, {
    title: 'Token使用趋势',
    yAxisName: 'Token数量',
    y2AxisName: '请求数'
  })
}

// 更新 API Keys 使用趋势图
function updateApiKeysUsageTrendChart() {
  const data = apiKeysTrendData.value.data || []
  if (data.length === 0) {
    apiKeysUsageTrendChartOption.value = {}
    return
  }

  const metric = apiKeysTrendMetric.value
  const labelField = data[0]?.date ? 'date' : 'hour'

  const labels = data.map((d) => {
    if (d.label) return d.label
    if (labelField === 'hour') {
      const date = new Date(d.hour)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      return `${month}/${day} ${hour}:00`
    }
    const dateStr = d.date
    if (dateStr && dateStr.includes('-')) {
      const parts = dateStr.split('-')
      if (parts.length >= 3) return `${parts[1]}/${parts[2]}`
    }
    return d.date
  })

  const datasets =
    apiKeysTrendData.value.topApiKeys?.map((apiKeyId) => {
      const apiKeyName =
        apiKeysTrendData.value.data.find((item) => item.apiKeys && item.apiKeys[apiKeyId])?.apiKeys[
          apiKeyId
        ]?.name || `API Key ${apiKeyId}`

      return {
        label: apiKeyName,
        data: apiKeysTrendData.value.data.map((item) => {
          if (!item.apiKeys || !item.apiKeys[apiKeyId]) return 0
          return metric === 'tokens'
            ? item.apiKeys[apiKeyId].tokens
            : item.apiKeys[apiKeyId].requests || 0
        })
      }
    }) || []

  apiKeysUsageTrendChartOption.value = getMultiLineOptions(labels, datasets, {
    yAxisName: metric === 'tokens' ? 'Token 数量' : '请求次数'
  })
}

// 重新加载并更新 API Keys 使用趋势图
async function reloadApiKeysUsageTrendChart() {
  await loadApiKeysTrend(apiKeysTrendMetric.value)
  await nextTick()
  updateApiKeysUsageTrendChart()
}

// 更新账号使用趋势图
function updateAccountUsageTrendChart() {
  const trend = accountUsageTrendData.value?.data || []
  const topAccounts = accountUsageTrendData.value?.topAccounts || []

  if (trend.length === 0 || topAccounts.length === 0) {
    accountUsageTrendChartOption.value = {}
    return
  }

  const labelField = trend[0]?.date ? 'date' : 'hour'
  const labels = trend.map((item) => {
    if (item.label) return item.label
    if (labelField === 'hour') {
      const date = new Date(item.hour)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      return `${month}/${day} ${hour}:00`
    }
    if (item.date && item.date.includes('-')) {
      const parts = item.date.split('-')
      if (parts.length >= 3) return `${parts[1]}/${parts[2]}`
    }
    return item.date
  })

  const datasets = topAccounts.map((accountId) => {
    const accountName =
      trend.find((item) => item.accounts && item.accounts[accountId])?.accounts[accountId]?.name ||
      `账号 ${String(accountId).slice(0, 6)}`

    return {
      label: accountName,
      data: trend.map((item) => {
        if (!item.accounts || !item.accounts[accountId]) return 0
        return item.accounts[accountId].cost || 0
      })
    }
  })

  accountUsageTrendChartOption.value = getMultiLineOptions(labels, datasets, {
    yAxisName: '消耗金额 (USD)'
  })
}

async function handleAccountUsageGroupChange(group) {
  if (accountUsageGroup.value === group || accountTrendUpdating.value) {
    return
  }
  accountTrendUpdating.value = true
  try {
    await setAccountUsageGroup(group)
    await nextTick()
    updateAccountUsageTrendChart()
  } finally {
    accountTrendUpdating.value = false
  }
}

// 监听数据变化更新图表
watch(dashboardModelStats, () => {
  nextTick(() => updateModelUsageChart())
})

watch(trendData, () => {
  nextTick(() => updateUsageTrendChart())
})

watch(apiKeysTrendData, () => {
  nextTick(() => updateApiKeysUsageTrendChart())
})

watch(accountUsageTrendData, () => {
  nextTick(() => updateAccountUsageTrendChart())
})

// 刷新所有数据
async function refreshAllData() {
  if (isRefreshing.value) return

  isRefreshing.value = true
  try {
    await Promise.all([loadDashboardData(), refreshChartsData()])
  } finally {
    isRefreshing.value = false
  }
}

// 启动自动刷新
function startAutoRefresh() {
  if (!autoRefreshEnabled.value) return

  // 重置倒计时
  refreshCountdown.value = autoRefreshInterval.value

  // 清除现有定时器
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
  if (autoRefreshTimer.value) {
    clearTimeout(autoRefreshTimer.value)
  }

  // 启动倒计时
  countdownTimer.value = setInterval(() => {
    refreshCountdown.value--
    if (refreshCountdown.value <= 0) {
      clearInterval(countdownTimer.value)
    }
  }, 1000)

  // 设置刷新定时器
  autoRefreshTimer.value = setTimeout(async () => {
    await refreshAllData()
    // 递归调用以继续自动刷新
    if (autoRefreshEnabled.value) {
      startAutoRefresh()
    }
  }, autoRefreshInterval.value * 1000)
}

// 停止自动刷新
function stopAutoRefresh() {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
  if (autoRefreshTimer.value) {
    clearTimeout(autoRefreshTimer.value)
    autoRefreshTimer.value = null
  }
  refreshCountdown.value = 0
}

// 切换自动刷新
// function toggleAutoRefresh() {
//   autoRefreshEnabled.value = !autoRefreshEnabled.value
//   if (autoRefreshEnabled.value) {
//     startAutoRefresh()
//   } else {
//     stopAutoRefresh()
//   }
// }

// 监听自动刷新状态变化
watch(autoRefreshEnabled, (newVal) => {
  if (newVal) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
})

// 监听主题变化，重新更新图表配置
watch(isDarkMode, () => {
  nextTick(() => {
    updateModelUsageChart()
    updateUsageTrendChart()
    updateApiKeysUsageTrendChart()
    updateAccountUsageTrendChart()
  })
})

// 初始化
onMounted(async () => {
  // 加载所有数据
  await refreshAllData()

  // 更新图表配置
  await nextTick()
  updateModelUsageChart()
  updateUsageTrendChart()
  updateApiKeysUsageTrendChart()
  updateAccountUsageTrendChart()
})

// 清理
onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
/* ECharts 图表容器 */
.chart {
  width: 100%;
  height: 100%;
}

/* 日期选择器基本样式调整 - 让Element Plus官方暗黑模式生效 */
.custom-date-picker {
  font-size: 13px;
}

/* 旋转动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
