// js/authGuard.js
const AuthManager = {
    // 檢查是否登入 (實務上應檢查 Token 或 Session)
    isLoggedIn() {
        return localStorage.getItem('artEcho_isLoggedIn') === 'true';
    },

    // 執行登入
    login() {
        localStorage.setItem('artEcho_isLoggedIn', 'true');
        window.location.href = 'index.html';
    },

    // 執行登出
    logout() {
        localStorage.removeItem('artEcho_isLoggedIn');
        window.location.href = 'index.html';
    },

    // 更新導覽列 UI
    updateNav() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        const loggedIn = this.isLoggedIn();

        // 定義所有可能的連結
        const links = [
            { name: '主頁', href: 'index.html', public: true },
            { name: '個人雲端藝術庫', href: 'Gallery.html', public: false },
            { name: '劇情繪畫', href: 'Story.html', public: false },
            { name: '公開藝術畫廊', href: 'Cloud_space.html', public: true },
        ];

        // 重新構建導覽列
        let html = '';
        links.forEach(link => {
            if (link.public || loggedIn) {
                const isActive = window.location.pathname.includes(link.href) ? 'active' : '';
                html += `<a class="nav-btn ${isActive}" href="${link.href}">${link.name}</a>`;
            }
        });

        // 登入/登出按鈕
        if (loggedIn) {
            html += `<a class="nav-btn" href="#" id="logoutBtn">登出</a>`;
        } else {
            html += `<a class="nav-btn" href="login.html">登入</a>`;
        }

        navLinks.innerHTML = html;

        // 綁定登出事件
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                this.logout();
            };
        }
    },

    // 頁面存取限制
    checkAccess() {
        const publicPages = ['index.html', 'Cloud_space.html', 'login.html', 'register.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (!publicPages.includes(currentPage) && !this.isLoggedIn()) {
            alert('此頁面需要登入後查看');
            window.location.href = 'login.html';
        }
    }
};

// 立即執行檢查
AuthManager.checkAccess();
document.addEventListener('DOMContentLoaded', () => AuthManager.updateNav());