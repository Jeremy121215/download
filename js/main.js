// 通用功能模块
class DownloadApp {
    constructor() {
        this.currentCategory = null;
        this.currentSubcategory = 'all';
        this.searchQuery = '';
    }

    // 加载JSON数据
    async loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('加载JSON数据失败:', error);
            return null;
        }
    }

    // 搜索功能 - 根据关键词过滤数据
    searchData(data, query, fields = ['name', 'description']) {
        if (!query) return data;
        
        const lowercaseQuery = query.toLowerCase();
        return data.filter(item => {
            return fields.some(field => {
                const value = item[field];
                return value && value.toLowerCase().includes(lowercaseQuery);
            });
        });
    }

    // 获取URL参数
    getURLParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    // 生成随机ID
    generateID() {
        return Math.random().toString(36).substr(2, 9);
    }

    // 显示加载状态
    showLoading(element) {
        element.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i>
                <p>加载中...</p>
            </div>
        `;
    }

    // 显示空状态
    showEmptyState(element, message = '没有找到相关内容') {
        element.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>未找到内容</h3>
                <p>${message}</p>
            </div>
        `;
    }

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 获取文件类型图标
    getFileTypeIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
            'pdf': 'fa-file-pdf',
            'doc': 'fa-file-word',
            'docx': 'fa-file-word',
            'xls': 'fa-file-excel',
            'xlsx': 'fa-file-excel',
            'ppt': 'fa-file-powerpoint',
            'pptx': 'fa-file-powerpoint',
            'zip': 'fa-file-archive',
            'rar': 'fa-file-archive',
            '7z': 'fa-file-archive',
            'jpg': 'fa-file-image',
            'jpeg': 'fa-file-image',
            'png': 'fa-file-image',
            'gif': 'fa-file-image',
            'mp3': 'fa-file-audio',
            'mp4': 'fa-file-video',
            'exe': 'fa-file-download',
            'dmg': 'fa-file-download',
            'pkg': 'fa-file-download'
        };
        return icons[ext] || 'fa-file';
    }
}

// 初始化应用实例
const app = new DownloadApp();

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
    // 添加搜索事件监听
    const searchInput = document.getElementById('global-search') || document.getElementById('category-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// 搜索函数（会在各页面中具体实现）
function performSearch() {
    // 由各页面具体实现
    console.log('搜索功能将由具体页面实现');
}
