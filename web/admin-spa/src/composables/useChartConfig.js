import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

export function useChartConfig() {
  const themeStore = useThemeStore()
  const isDark = computed(() => themeStore.isDarkMode)

  // 现代配色方案
  const colorSchemes = {
    // 主色调 - 渐变感强
    primary: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#F97316'],
    // 柔和色调
    soft: ['#818CF8', '#A78BFA', '#F472B6', '#FBBF24', '#34D399', '#22D3EE', '#60A5FA', '#FB923C'],
    // 深色调
    deep: ['#4F46E5', '#7C3AED', '#DB2777', '#D97706', '#059669', '#0891B2', '#2563EB', '#EA580C']
  }

  // 根据主题获取文本颜色
  const textColor = computed(() => (isDark.value ? '#E5E7EB' : '#374151'))
  const subTextColor = computed(() => (isDark.value ? '#9CA3AF' : '#6B7280'))
  const borderColor = computed(() => (isDark.value ? '#374151' : '#E5E7EB'))
  const bgColor = computed(() => (isDark.value ? '#1F2937' : '#FFFFFF'))

  // 环形图配置生成器
  const getDoughnutOptions = (data, { title = '', showLegend = true } = {}) => {
    return {
      backgroundColor: 'transparent',
      title: title
        ? {
            text: title,
            left: 'center',
            top: 10,
            textStyle: {
              color: textColor.value,
              fontSize: 16,
              fontWeight: 600
            }
          }
        : undefined,
      tooltip: {
        trigger: 'item',
        backgroundColor: isDark.value ? '#374151' : '#FFFFFF',
        borderColor: borderColor.value,
        borderWidth: 1,
        textStyle: {
          color: textColor.value
        },
        formatter: (params) => {
          const { name, value, percent } = params
          return `
            <div style="padding: 8px 12px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${name}</div>
              <div style="color: ${subTextColor.value};">
                ${formatNumber(value)} <span style="color: ${colorSchemes.primary[params.dataIndex % colorSchemes.primary.length]};">(${percent}%)</span>
              </div>
            </div>
          `
        }
      },
      legend: showLegend
        ? {
            type: 'scroll',
            orient: 'horizontal',
            bottom: 10,
            itemWidth: 12,
            itemHeight: 12,
            itemGap: 16,
            textStyle: {
              color: textColor.value,
              fontSize: 12
            },
            pageTextStyle: {
              color: subTextColor.value
            }
          }
        : undefined,
      series: [
        {
          type: 'pie',
          radius: ['50%', '75%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: bgColor.value,
            borderWidth: 3
          },
          label: {
            show: false
          },
          emphasis: {
            scale: true,
            scaleSize: 8,
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          },
          data: data.map((item, index) => ({
            ...item,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: colorSchemes.primary[index % colorSchemes.primary.length] },
                  { offset: 1, color: colorSchemes.soft[index % colorSchemes.soft.length] }
                ]
              }
            }
          }))
        }
      ]
    }
  }

  // 折线图配置生成器
  const getLineOptions = (
    labels,
    datasets,
    { title = '', showLegend = true, yAxisName = '', y2AxisName = '', smooth = true } = {}
  ) => {
    const series = datasets.map((ds, index) => ({
      name: ds.label,
      type: 'line',
      smooth: smooth,
      symbol: 'circle',
      symbolSize: 6,
      showSymbol: false,
      yAxisIndex: ds.yAxisIndex || 0,
      lineStyle: {
        width: 2.5,
        color: ds.color || colorSchemes.primary[index % colorSchemes.primary.length]
      },
      itemStyle: {
        color: ds.color || colorSchemes.primary[index % colorSchemes.primary.length],
        borderWidth: 2,
        borderColor: bgColor.value
      },
      areaStyle: ds.showArea
        ? {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color:
                    (ds.color || colorSchemes.primary[index % colorSchemes.primary.length]) + '40'
                },
                {
                  offset: 1,
                  color:
                    (ds.color || colorSchemes.primary[index % colorSchemes.primary.length]) + '05'
                }
              ]
            }
          }
        : undefined,
      emphasis: {
        focus: 'series',
        itemStyle: {
          borderWidth: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      data: ds.data
    }))

    // 构建 Y 轴配置
    const yAxis = [
      {
        type: 'value',
        name: yAxisName,
        nameTextStyle: {
          color: subTextColor.value,
          fontSize: 12
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: subTextColor.value,
          fontSize: 11,
          formatter: (value) => formatNumber(value)
        },
        splitLine: {
          lineStyle: {
            color: borderColor.value,
            type: 'dashed'
          }
        }
      }
    ]

    // 如果有第二个 Y 轴
    if (datasets.some((ds) => ds.yAxisIndex === 1)) {
      yAxis.push({
        type: 'value',
        name: y2AxisName,
        position: 'right',
        nameTextStyle: {
          color: subTextColor.value,
          fontSize: 12
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: subTextColor.value,
          fontSize: 11,
          formatter: (value) => formatNumber(value)
        },
        splitLine: {
          show: false
        }
      })
    }

    return {
      backgroundColor: 'transparent',
      title: title
        ? {
            text: title,
            left: 'center',
            top: 10,
            textStyle: {
              color: textColor.value,
              fontSize: 16,
              fontWeight: 600
            }
          }
        : undefined,
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark.value ? '#374151' : '#FFFFFF',
        borderColor: borderColor.value,
        borderWidth: 1,
        textStyle: {
          color: textColor.value,
          fontSize: 12
        },
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: subTextColor.value
          },
          lineStyle: {
            color: borderColor.value,
            type: 'dashed'
          }
        }
      },
      legend: showLegend
        ? {
            type: 'scroll',
            top: title ? 40 : 10,
            itemWidth: 16,
            itemHeight: 3,
            itemGap: 20,
            textStyle: {
              color: textColor.value,
              fontSize: 12
            },
            pageTextStyle: {
              color: subTextColor.value
            }
          }
        : undefined,
      grid: {
        left: 60,
        right: y2AxisName ? 60 : 20,
        top: title ? 80 : showLegend ? 50 : 20,
        bottom: 40,
        containLabel: false
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels,
        axisLine: {
          lineStyle: {
            color: borderColor.value
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: subTextColor.value,
          fontSize: 11,
          rotate: labels.length > 12 ? 45 : 0
        }
      },
      yAxis: yAxis,
      series: series
    }
  }

  // 多系列折线图（用于 API Keys 和账号趋势）
  const getMultiLineOptions = (labels, datasets, { title = '', yAxisName = '' } = {}) => {
    const series = datasets.map((ds, index) => ({
      name: ds.label,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      showSymbol: false,
      lineStyle: {
        width: 2.5,
        color: colorSchemes.primary[index % colorSchemes.primary.length]
      },
      itemStyle: {
        color: colorSchemes.primary[index % colorSchemes.primary.length],
        borderWidth: 2,
        borderColor: bgColor.value
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          borderWidth: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      data: ds.data
    }))

    return {
      backgroundColor: 'transparent',
      title: title
        ? {
            text: title,
            left: 'center',
            top: 10,
            textStyle: {
              color: textColor.value,
              fontSize: 16,
              fontWeight: 600
            }
          }
        : undefined,
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark.value ? '#374151' : '#FFFFFF',
        borderColor: borderColor.value,
        borderWidth: 1,
        textStyle: {
          color: textColor.value,
          fontSize: 12
        },
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: borderColor.value,
            type: 'dashed'
          }
        },
        formatter: (params) => {
          if (!params || params.length === 0) return ''

          // 按值排序
          const sorted = [...params].sort((a, b) => (b.value || 0) - (a.value || 0))

          let html = `<div style="padding: 8px 12px; min-width: 180px;">
            <div style="font-weight: 600; margin-bottom: 8px; color: ${textColor.value};">${params[0].axisValue}</div>`

          sorted.forEach((item, idx) => {
            const medal = idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : ''
            html += `
              <div style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0;">
                <span style="display: flex; align-items: center;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>
                  ${medal}${item.seriesName}
                </span>
                <span style="font-weight: 600; margin-left: 16px;">${formatNumber(item.value || 0)}</span>
              </div>`
          })

          html += '</div>'
          return html
        }
      },
      legend: {
        type: 'scroll',
        bottom: 10,
        itemWidth: 16,
        itemHeight: 3,
        itemGap: 16,
        textStyle: {
          color: textColor.value,
          fontSize: 12
        },
        pageTextStyle: {
          color: subTextColor.value
        }
      },
      grid: {
        left: 60,
        right: 20,
        top: title ? 60 : 20,
        bottom: 60,
        containLabel: false
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels,
        axisLine: {
          lineStyle: {
            color: borderColor.value
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: subTextColor.value,
          fontSize: 11,
          rotate: labels.length > 12 ? 45 : 0
        }
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
        nameTextStyle: {
          color: subTextColor.value,
          fontSize: 12
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: subTextColor.value,
          fontSize: 11,
          formatter: (value) => formatNumber(value)
        },
        splitLine: {
          lineStyle: {
            color: borderColor.value,
            type: 'dashed'
          }
        }
      },
      series: series
    }
  }

  return {
    colorSchemes,
    textColor,
    subTextColor,
    borderColor,
    bgColor,
    isDark,
    getDoughnutOptions,
    getLineOptions,
    getMultiLineOptions
  }
}

// 格式化数字
export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toLocaleString()
}

// 格式化费用
export function formatCost(cost) {
  if (!Number.isFinite(cost)) return '$0.00'
  if (cost >= 1) return `$${cost.toFixed(2)}`
  if (cost >= 0.01) return `$${cost.toFixed(3)}`
  return `$${cost.toFixed(6)}`
}
