// 下载页面功能

// 全局变量
let currentCategoryData = null;
let currentSubcategory = '全部';
let currentView = 'grid';
let allDownloadItems = [];

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取分类参数
    const categoryId = getQueryParam('category');
    
    if (categoryId) {
        loadCategoryData(categoryId);
    } else {
        // 如果没有分类参数，重定向到首页
        window.location.href = 'index.html';
    }
    
    // 初始化视图切换
    initViewToggle();
    
    // 初始化子分类按钮事件委托
    initSubcategoryFilter();
});

/**
 * 加载分类数据
 * @param {string} categoryId - 分类ID
 */
async function loadCategoryData(categoryId) {
    // 显示加载状态
    createLoadingIndicator('downloadsContainer', '正在加载资源...');
    
    try {
        // 加载对应的JSON文件
        const filename = `${encodeURIComponent(categoryId)}.json`;
        const data = await fetchJSON(`data/${filename}`);
        
        currentCategoryData = data;
        allDownloadItems = data.items || [];
        
        // 更新页面标题和描述
        updatePageInfo(data);
        
        // 渲染子分类
        renderSubcategories(data.subcategories);
        
        // 渲染下载项目
        renderDownloads(allDownloadItems);
        
        // 更新统计信息
        updateStats(allDownloadItems.length);
        
    } catch (error) {
        console.error('Failed to load category data:', error);
        createEmptyState('downloadsContainer', '加载失败，请刷新重试', 'fas fa-exclamation-triangle');
    }
}

/**
 * 更新页面信息
 * @param {Object} data - 分类数据
 */
function updatePageInfo(data) {
    // 更新页面标题
    document.title = `${data.categoryName || data.category} - 资源下载中心`;
    
    // 更新分类名称和描述
    safeSetContent(document.getElementById('categoryName'), data.categoryName || data.category);
    safeSetContent(document.getElementById('categoryDesc'), data.description || '');
    
    // 更新分类图标颜色（如果有）
    const categoryIcon = document.getElementById('categoryIcon');
    if (categoryIcon && data.color) {
        categoryIcon.style.backgroundColor = data.color;
    }
}

/**
 * 渲染子分类
 * @param {Array} subcategories - 子分类数组
 */
function renderSubcategories(subcategories) {
    const container = document.getElementById('subcategoriesContainer');
    if (!container || !subcategories) return;
    
    // 保留"全部"按钮
    const allButton = container.querySelector('.subcategory-btn[data-subcategory="全部"]');
    container.innerHTML = '';
    container.appendChild(allButton);
    
    // 添加子分类按钮
    subcategories.forEach(subcategory => {
        const button = document.createElement('button');
        button.className = 'subcategory-btn';
        button.dataset.subcategory = subcategory.id;
        button.innerHTML = `<i class="${subcategory.icon}"></i> ${subcategory.name}`;
        container.appendChild(button);
    });
}

/**
 * 初始化子分类筛选
 */
function initSubcategoryFilter() {
    const container = document.getElementById('subcategoriesContainer');
    if (!container) return;
    
    container.addEventListener('click', function(e) {
        const button = e.target.closest('.subcategory-btn');
        if (!button) return;
        
        // 更新活动按钮
        document.querySelectorAll('.subcategory-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // 更新当前子分类
        currentSubcategory = button.dataset.subcategory;
        
        // 筛选项目
        filterDownloads('', 'subcategory');
    });
}

/**
 * 初始化视图切换
 */
function initViewToggle() {
    const viewToggle = document.querySelector('.view-toggle');
    if (!viewToggle) return;
    
    viewToggle.addEventListener('click', function(e) {
        const button = e.target.closest('.view-btn');
        if (!button) return;
        
        const view = button.dataset.view;
        
        // 如果已经是当前视图，不做任何操作
        if (view === currentView) return;
        
        // 更新活动按钮
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // 更新当前视图
        currentView = view;
        
        // 重新渲染下载项目
        filterDownloads('', 'subcategory');
    });
}

/**
 * 渲染下载项目
 * @param {Array} items - 下载项目数组
 */
function renderDownloads(items) {
    const container = document.getElementById('downloadsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (items.length === 0) {
        toggleElementVisibility('noResults', true);
        return;
    }
    
    toggleElementVisibility('noResults', false);
    
    // 根据当前视图选择布局类
    const layoutClass = currentView === 'list' ? 'downloads-list' : 'downloads-grid';
    container.className = layoutClass;
    
    // 创建并添加项目卡片
    items.forEach(item => {
        const card = createDownloadCard(item);
        container.appendChild(card);
    });
}

/**
 * 创建下载卡片元素
 * @param {Object} item - 下载项目对象
 * @returns {HTMLElement} 下载卡片元素
 */
function createDownloadCard(item) {
    const card = document.createElement('div');
    card.className = `download-card card ${currentView === 'list' ? 'download-card-list' : ''}`;
    
    // 格式化平台显示
    const platforms = Array.isArray(item.platforms) ? 
        item.platforms.join('、') : 
        (item.platforms || '通用');
    
    // 创建标签元素
    const tagsHtml = item.tags && item.tags.length > 0 ? 
        `<div class="download-tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : '';
    
    card.innerHTML = `
        <div class="download-icon">
            <i class="${item.icon || 'fas fa-download'}"></i>
        </div>
        <div class="download-info">
            <h4>${item.name}</h4>
            <p>${item.description || ''}</p>
            <div class="download-meta">
                <div class="meta-item">
                    <i class="fas fa-hdd"></i>
                    <span>${item.fileSize || '未知'}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-laptop"></i>
                    <span>${platforms}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-tag"></i>
                    <span>${item.version || '最新版'}</span>
                </div>
            </div>
            ${currentView === 'grid' ? tagsHtml : ''}
        </div>
        ${currentView === 'list' ? tagsHtml : ''}
        <div class="download-actions">
            <a href="${item.downloadLink || '#'}" 
               class="btn btn-download btn-download-sm" 
               data-name="${item.name}"
               data-link="${item.downloadLink || '#'}">
                <i class="fas fa-download"></i> 下载
            </a>
            ${currentView === 'grid' ? 
                `<button class="btn btn-details">详情</button>` : 
                ''}
        </div>
    `;
    
    // 添加详情按钮点击事件
    const detailsBtn = card.querySelector('.btn-details');
    if (detailsBtn) {
        detailsBtn.addEventListener('click', function() {
            showItemDetails(item);
        });
    }
    
    // 卡片点击事件（除了按钮区域）
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.download-actions') && !e.target.closest('.btn-details')) {
            showItemDetails(item);
        }
    });
    
    return card;
}

/**
 * 显示项目详情
 * @param {Object} item - 下载项目对象
 */
function showItemDetails(item) {
    // 在实际应用中，这里可以打开一个模态框显示更多详情
    // 这里我们用一个简单的alert代替
    const platforms = Array.isArray(item.platforms) ? 
        item.platforms.join('、') : 
        (item.platforms || '通用');
    
    const tags = item.tags && item.tags.length > 0 ? 
        item.tags.join('、') : '无';
    
    const message = `
        名称: ${item.name}
        
        描述: ${item.description || '暂无描述'}
        
        文件大小: ${item.fileSize || '未知'}
        版本: ${item.version || '最新版'}
        支持平台: ${platforms}
        标签: ${tags}
        
        下载链接: ${item.downloadLink || '#'}
    `;
    
    alert(message);
}

/**
 * 筛选下载项目
 * @param {string} searchTerm - 搜索关键词
 * @param {string} searchType - 搜索类型（global, subcategory）
 */
function filterDownloads(searchTerm, searchType) {
    if (!allDownloadItems || allDownloadItems.length === 0) return;
    
    let filteredItems = [...allDownloadItems];
    
    // 首先根据子分类筛选
    if (currentSubcategory !== '全部') {
        filteredItems = filteredItems.filter(item => 
            item.subcategory === currentSubcategory
        );
    }
    
    // 然后根据搜索词筛选
    if (searchTerm && searchTerm.trim() !== '') {
        filteredItems = filteredItems.filter(item => {
            const nameMatch = item.name.toLowerCase().includes(searchTerm);
            const descMatch = item.description && item.description.toLowerCase().includes(searchTerm);
            const tagMatch = item.tags && item.tags.some(tag => 
                tag.toLowerCase().includes(searchTerm)
            );
            
            return nameMatch || descMatch || tagMatch;
        });
    }
    
    // 渲染筛选后的项目
    renderDownloads(filteredItems);
    
    // 更新统计信息
    updateStats(filteredItems.length);
}

/**
 * 更新统计信息
 * @param {number} count - 项目数量
 */
function updateStats(count) {
    const totalItemsElement = document.getElementById('totalItems');
    if (totalItemsElement) {
        totalItemsElement.textContent = count;
    }
}

// 将filterDownloads函数暴露给全局，以便main.js可以调用
window.filterDownloads = filterDownloads;
