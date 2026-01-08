// 首页逻辑
class IndexPage {
    constructor() {
        this.categories = [];
        this.filteredCategories = [];
        this.init();
    }

    // 初始化
    async init() {
        await this.loadCategories();
        this.setupEventListeners();
    }

    // 加载分类数据
    async loadCategories() {
        const container = document.getElementById('categories-container');
        app.showLoading(container);
        
        this.categories = await app.loadJSON('data/navigation.json');
        
        if (this.categories) {
            this.filteredCategories = [...this.categories];
            this.renderCategories();
        } else {
            app.showEmptyState(container, '无法加载分类数据');
        }
    }

    // 渲染分类列表
    renderCategories() {
        const container = document.getElementById('categories-container');
        
        if (this.filteredCategories.length === 0) {
            app.showEmptyState(container, '没有找到匹配的分类');
            return;
        }

        container.innerHTML = this.filteredCategories.map(category => `
            <div class="category-card" onclick="indexPage.navigateToCategory('${category.id}')">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <h2>${category.name}</h2>
                <p>${category.description}</p>
                <a href="download.html?category=${category.id}" class="enter-btn">进入</a>
            </div>
        `).join('');
    }

    // 设置事件监听器
    setupEventListeners() {
        const searchInput = document.getElementById('global-search');
        const searchBtn = document.getElementById('search-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchCategories(e.target.value);
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput ? searchInput.value : '';
                this.searchCategories(query);
            });
        }
    }

    // 搜索分类
    searchCategories(query) {
        if (!query) {
            this.filteredCategories = [...this.categories];
        } else {
            this.filteredCategories = app.searchData(this.categories, query);
        }
        this.renderCategories();
    }

    // 导航到分类页面
    navigateToCategory(categoryId) {
        window.location.href = `download.html?category=${categoryId}`;
    }
}

// 初始化首页
let indexPage;
window.addEventListener('DOMContentLoaded', () => {
    indexPage = new IndexPage();
    
    // 重写全局搜索函数
    window.performSearch = () => {
        const searchInput = document.getElementById('global-search');
        const query = searchInput ? searchInput.value : '';
        indexPage.searchCategories(query);
    };
});
