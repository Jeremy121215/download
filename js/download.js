// 下载页面逻辑
class DownloadPage {
    constructor() {
        this.categoryData = null;
        this.filteredFiles = [];
        this.currentSubcategory = 'all';
        this.searchQuery = '';
        this.init();
    }

    // 初始化
    async init() {
        const params = app.getURLParams();
        this.currentCategory = params.category;
        
        if (!this.currentCategory) {
            window.location.href = 'index.html';
            return;
        }
        
        await this.loadCategoryData();
        this.setupEventListeners();
    }

    // 加载分类数据
    async loadCategoryData() {
        const container = document.getElementById('files-container');
        app.showLoading(container);
        
        // 加载导航数据以获取分类名称
        const navigationData = await app.loadJSON('data/navigation.json');
        const categoryInfo = navigationData?.find(cat => cat.id === this.currentCategory);
        
        if (categoryInfo) {
            const titleElement = document.getElementById('category-title');
            if (titleElement) {
                titleElement.textContent = categoryInfo.name;
            }
        }
        
        // 加载分类下载数据
        this.categoryData = await app.loadJSON(`data/${this.currentCategory}.json`);
        
        if (this.categoryData) {
            this.filteredFiles = [...this.categoryData.files];
            this.renderSubcategories();
            this.renderFiles();
        } else {
            app.showEmptyState(container, '无法加载下载数据');
        }
    }

    // 渲染子分类筛选
    renderSubcategories() {
        const container = document.getElementById('subcategories');
        
        if (!this.categoryData || !this.categoryData.subcategories) {
            container.innerHTML = '';
            return;
        }

        const subcategories = this.categoryData.subcategories;
        
        container.innerHTML = `
            <h3>筛选：</h3>
            <button class="subcategory-btn ${this.currentSubcategory === 'all' ? 'active' : ''}" 
                    onclick="downloadPage.filterBySubcategory('all')">
                全部
            </button>
            ${subcategories.map(subcat => `
                <button class="subcategory-btn ${this.currentSubcategory === subcat.id ? 'active' : ''}" 
                        onclick="downloadPage.filterBySubcategory('${subcat.id}')">
                    ${subcat.name}
                </button>
            `).join('')}
        `;
    }

    // 渲染文件列表
    renderFiles() {
        const container = document.getElementById('files-container');
        
        if (this.filteredFiles.length === 0) {
            app.showEmptyState(container, '没有找到相关下载文件');
            return;
        }

        container.innerHTML = this.filteredFiles.map(file => `
            <div class="file-card">
                <div class="file-header">
                    <div class="file-icon">
                        <i class="${file.icon || 'fas fa-file-download'}"></i>
                    </div>
                    <div class="file-info">
                        <h3>${file.name}</h3>
                        <span class="file-subcategory">${this.getSubcategoryName(file.subcategory)}</span>
                    </div>
                </div>
                <p class="file-description">${file.description}</p>
                <a href="${file.link}" class="download-btn" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-download"></i> 下载
                </a>
            </div>
        `).join('');
    }

    // 获取子分类名称
    getSubcategoryName(subcategoryId) {
        if (!subcategoryId || !this.categoryData?.subcategories) {
            return '未分类';
        }
        
        const subcategory = this.categoryData.subcategories.find(subcat => subcat.id === subcategoryId);
        return subcategory ? subcategory.name : '未分类';
    }

    // 设置事件监听器
    setupEventListeners() {
        const searchInput = document.getElementById('category-search');
        const searchBtn = document.getElementById('search-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.applyFilters();
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput ? searchInput.value : '';
                this.searchQuery = query;
                this.applyFilters();
            });
        }
    }

    // 按子分类筛选
    filterBySubcategory(subcategoryId) {
        this.currentSubcategory = subcategoryId;
        this.applyFilters();
        this.renderSubcategories(); // 更新子分类按钮状态
    }

    // 应用所有筛选条件
    applyFilters() {
        let filtered = [...this.categoryData.files];
        
        // 按子分类筛选
        if (this.currentSubcategory !== 'all') {
            filtered = filtered.filter(file => file.subcategory === this.currentSubcategory);
        }
        
        // 按搜索关键词筛选
        if (this.searchQuery) {
            filtered = app.searchData(filtered, this.searchQuery);
        }
        
        this.filteredFiles = filtered;
        this.renderFiles();
    }

    // 搜索文件
    searchFiles(query) {
        this.searchQuery = query;
        this.applyFilters();
    }
}

// 初始化下载页面
let downloadPage;
window.addEventListener('DOMContentLoaded', () => {
    downloadPage = new DownloadPage();
    
    // 重写全局搜索函数
    window.performSearch = () => {
        const searchInput = document.getElementById('category-search');
        const query = searchInput ? searchInput.value : '';
        downloadPage.searchFiles(query);
    };
});
