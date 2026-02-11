document.addEventListener('DOMContentLoaded', () => {
    autoDismissAlerts();
    enableAutoSubmit();
    enableCopyButtons();
});

function autoDismissAlerts() {
    document.querySelectorAll('.alert, [data-auto-dismiss]').forEach((alert) => {
        setTimeout(() => {
            alert.classList.add('toast-exit');
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });
}

function enableAutoSubmit() {
    document.querySelectorAll('[data-auto-submit]').forEach((element) => {
        element.addEventListener('change', () => {
            element.form?.submit();
        });
    });
}

function enableCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach((button) => {
        button.addEventListener('click', () => {
            const target = document.querySelector(button.dataset.copy);
            if (target) {
                navigator.clipboard.writeText(target.textContent.trim()).then(() => {
                    button.classList.add('copied');
                    setTimeout(() => button.classList.remove('copied'), 1500);
                });
            }
        });
    });
}

// Mobile Navigation
function toggleMobileNav() {
    const overlay = document.getElementById('mobileNavOverlay');
    const drawer = document.getElementById('mobileNavDrawer');
    if (!overlay || !drawer) return;
    
    const isOpen = drawer.classList.contains('open');
    
    if (isOpen) {
        overlay.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    } else {
        overlay.classList.add('open');
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

// Close mobile nav on resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        const overlay = document.getElementById('mobileNavOverlay');
        const drawer = document.getElementById('mobileNavDrawer');
        if (overlay) overlay.classList.remove('open');
        if (drawer) drawer.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// Close mobile nav on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const drawer = document.getElementById('mobileNavDrawer');
        if (drawer && drawer.classList.contains('open')) {
            toggleMobileNav();
        }
    }
});

// Skeleton loader helper
function showSkeleton(container, count, type) {
    if (!container) return;
    let html = '';
    for (let i = 0; i < count; i++) {
        if (type === 'card') {
            html += '<div class="skeleton skeleton-card"></div>';
        } else if (type === 'text') {
            html += `<div class="skeleton skeleton-text mb-2" style="width: ${60 + Math.random() * 30}%"></div>`;
        } else if (type === 'kpi') {
            html += `
                <div class="kpi-card">
                    <div class="skeleton skeleton-text mb-3" style="width: 70%"></div>
                    <div class="skeleton skeleton-heading mb-2"></div>
                    <div class="skeleton skeleton-text" style="width: 40%"></div>
                </div>
            `;
        }
    }
    container.innerHTML = html;
}

// Legacy sidebar toggle support
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');

if (sidebarToggle && sidebar && mainContent) {
    sidebarToggle.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('sidebar-active');
    });
}