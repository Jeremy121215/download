// 首页功能

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
});

/**
 * 加载分类数据
 */
async function loadCategories() {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;
    
    // 显示加载状态
    createLoadingIndicator('categoriesContainer', '正在加载分类...');
    
    try {
        // 从data/navigation.json加载分类数据
        const data = await fetchJSON('data/navigation.json');
        
        if (data.categories && data.categories.length > 0) {
            renderCategories(data.categories);
        } else {
            createEmptyState('categoriesContainer', '暂无分类数据', 'fas fa-folder-open');
        }
    } catch (error) {
        console.error('Failed to load categories:', error);
        createEmptyState('categoriesContainer', '加载失败，请刷新重试', 'fas fa-exclamation-triangle');
    }
}

/**
 * 渲染分类卡片
 * @param {Array} categories - 分类数组
 */
function renderCategories(categories) {
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = createCategoryCard(category);
        container.appendChild(categoryCard);
    });
}

/**
 * 创建分类卡片元素
 * @param {Object} category - 分类对象
 * @returns {HTMLElement} 分类卡片元素
 */
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card card';
    card.dataset.categoryId = category.id;
    
    // 设置卡片颜色
    card.style.borderTop = `5px solid ${category.color || '#3498db'}`;
    
    // 鼠标悬停时的背景色变化
    card.addEventListener('mouseenter', function() {
        this.style.backgroundColor = `${category.color}15`; // 添加透明度
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
    });
    
    // 点击事件 - 跳转到下载页面
    card.addEventListener('click', function() {
        window.location.href = `download.html?category=${encodeURIComponent(category.id)}`;
    });
    
    card.innerHTML = `
        <div class="category-icon">
            <i class="${category.icon}"></i>
        </div>
        <div class="category-info">
            <h4>${category.name}</h4>
            <p>${category.description}</p>
        </div>
    `;
    
    return card;
}
