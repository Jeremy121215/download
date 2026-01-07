// 工具函数集合

/**
 * 从URL获取查询参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 获取JSON数据
 * @param {string} url - JSON文件URL
 * @returns {Promise} Promise对象
 */
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
        throw error;
    }
}

/**
 * 创建加载动画
 * @param {string} containerId - 容器ID
 * @param {string} message - 加载消息
 */
function createLoadingIndicator(containerId, message = '加载中...') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

/**
 * 创建空状态提示
 * @param {string} containerId - 容器ID
 * @param {string} message - 提示消息
 * @param {string} icon - Font Awesome图标类
 */
function createEmptyState(containerId, message = '暂无数据', icon = 'fas fa-inbox') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <i class="${icon}"></i>
            <p>${message}</p>
        </div>
    `;
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 安全地设置元素内容
 * @param {HTMLElement} element - DOM元素
 * @param {string} content - 要设置的内容
 */
function safeSetContent(element, content) {
    if (element) {
        element.textContent = content;
    }
}

/**
 * 显示或隐藏元素
 * @param {string} elementId - 元素ID
 * @param {boolean} show - 是否显示
 */
function toggleElementVisibility(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

/**
 * 切换CSS类
 * @param {HTMLElement} element - DOM元素
 * @param {string} className - CSS类名
 * @param {boolean} add - 是否添加（true）或移除（false）
 */
function toggleClass(element, className, add) {
    if (element) {
        if (add) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }
}
