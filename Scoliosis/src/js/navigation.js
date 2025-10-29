// 页面导航控制
const navigation = {
  init: function() {
    const navItems = document.querySelectorAll('.nav-item');
    const appPages = document.querySelectorAll('.app-page');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        // 切换导航选中状态
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // 切换界面显示
        const targetPageId = item.getAttribute('data-target');
        appPages.forEach(page => {
          page.classList.remove('active');
          if (page.id === targetPageId) {
            page.classList.add('active');
          }
        });
      });
    });
  }
};

export default navigation;