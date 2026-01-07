// 全局通用功能

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化搜索功能（如果页面有搜索框）
    initSearch();
    
    // 初始化返回顶部按钮
    initBackToTop();
    
    // 初始化下载确认
    initDownloadConfirm();
});

/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const debouncedSearch = debounce(function() {
            const searchTerm = searchInput.value.toLowerCase();
            filterCategories(searchTerm);
        }, 300);
        
        searchInput.addEventListener('input', debouncedSearch);
    }
    
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        const debouncedGlobalSearch = debounce(function() {
            const searchTerm = globalSearch.value.toLowerCase();
            // 全局搜索功能在download.js中实现
            if (window.filterDownloads) {
                window.filterDownloads(searchTerm, 'global');
            }
        }, 300);
        
        globalSearch.addEventListener('input', debouncedGlobalSearch);
    }
    
    const subcategorySearch = document.getElementById('subcategorySearch');
    if (subcategorySearch) {
        const debouncedSubSearch = debounce(function() {
            const searchTerm = subcategorySearch.value.toLowerCase();
            // 子分类内搜索功能在download.js中实现
            if (window.filterDownloads) {
                window.filterDownloads(searchTerm, 'subcategory');
            }
        }, 300);
        
        subcategorySearch.addEventListener('input', debouncedSubSearch);
    }
}

/**
 * 过滤分类（首页使用）
 * @param {string} searchTerm - 搜索关键词
 */
function filterCategories(searchTerm) {
    const categoryCards = document.querySelectorAll('.category-card');
    let visibleCount = 0;
    
    categoryCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // 如果没有匹配项，显示提示
    const container = document.getElementById('categoriesContainer');
    const noResults = container.querySelector('.no-results') || 
                     container.querySelector('.empty-state');
    
    if (visibleCount === 0) {
        if (!noResults) {
            createEmptyState('categoriesContainer', '未找到匹配的分类', 'fas fa-search');
        }
    } else if (noResults) {
        noResults.remove();
    }
}

/**
 * 初始化返回顶部按钮
 */
function initBackToTop() {
    // 创建返回顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        display: none;
        z-index: 99;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // 滚动事件监听
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
            backToTopBtn.style.alignItems = 'center';
            backToTopBtn.style.justifyContent = 'center';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // 点击事件
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 添加悬停效果
    backToTopBtn.addEventListener('mouseenter', function() {
        backToTopBtn.style.backgroundColor = '#2980b9';
        backToTopBtn.style.transform = 'translateY(-3px)';
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        backToTopBtn.style.backgroundColor = 'var(--primary-color)';
        backToTopBtn.style.transform = 'translateY(0)';
    });
}

/**
 * 初始化下载确认
 */
function initDownloadConfirm() {
    // 使用事件委托处理下载按钮点击
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-download, .btn-download-sm')) {
            const button = e.target.closest('.btn-download, .btn-download-sm');
            const itemName = button.getAttribute('data-name') || '该文件';
            
            // 在实际应用中，这里应该直接下载
            // 这里我们模拟一个确认对话框
            if (confirm(`您确定要下载"${itemName}"吗？`)) {
                // 获取下载链接
                const downloadLink = button.getAttribute('href') || button.getAttribute('data-link');
                
                if (downloadLink && downloadLink !== '#') {
                    // 在新标签页中打开下载链接
                    window.open(downloadLink, '_blank');
                    
                    // 显示下载成功提示
                    showNotification(`开始下载: ${itemName}`, 'success');
                } else {
                    showNotification('下载链接无效', 'error');
                }
            }
            e.preventDefault();
        }
    });
}

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型（success, error, info）
 */
function showNotification(message, type = 'info') {
    // 创建通知容器（如果不存在）
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(notificationContainer);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background-color: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        margin-bottom: 10px;
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // 添加图标
    const icon = document.createElement('i');
    icon.className = `fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`;
    
    // 添加消息
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(messageSpan);
    notificationContainer.appendChild(notification);
    
    // 3秒后自动移除通知
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // 添加动画关键帧
    if (!document.getElementById('notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}
