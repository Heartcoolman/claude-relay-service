// Toast 通知管理
let toastContainer = null
let toastId = 0

// SVG 图标（来自 Phosphor Icons）
const svgIcons = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>`
}

export function showToast(message, type = 'info', title = '', duration = 3000) {
  // 创建容器
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000;'
    document.body.appendChild(toastContainer)
  }

  // 创建 toast
  const id = ++toastId
  const toast = document.createElement('div')
  toast.className = `toast rounded-2xl p-4 shadow-2xl toast-${type}`
  toast.style.cssText = `
    position: relative;
    min-width: 320px;
    max-width: 500px;
    margin-bottom: 16px;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
  `

  // 处理消息中的换行符，转换为 HTML 换行
  const formattedMessage = message.replace(/\n/g, '<br>')

  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0 mt-0.5">
        ${svgIcons[type] || svgIcons.info}
      </div>
      <div class="flex-1 min-w-0">
        ${title ? `<h4 class="font-semibold text-sm mb-1">${title}</h4>` : ''}
        <p class="text-sm opacity-90 leading-relaxed">${formattedMessage}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" 
              class="flex-shrink-0 text-white/70 hover:text-white transition-colors ml-2">
        ${svgIcons.close}
      </button>
    </div>
  `

  toastContainer.appendChild(toast)

  // 触发动画
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
  }, 10)

  // 自动移除
  if (duration > 0) {
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)'
      setTimeout(() => {
        toast.remove()
      }, 300)
    }, duration)
  }

  return id
}
