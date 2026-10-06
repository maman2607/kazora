/* ========================================
   KaZora - Main JavaScript
   Mobile Menu, FAQ, Smooth Scroll & Template Katalog
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initNavbarScroll();
    initFAQ();
    initSmoothScroll();
    initTemplateKatalog();
    initTemplateModal();
});

/* ========== MOBILE MENU ========== */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileMenuToggle) return;
    
    mobileMenuToggle.addEventListener('click', () => {
        toggleMobileMenu();
    });
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            closeMobileMenu();
        });
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', () => {
            closeMobileMenu();
        });
    }
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    mobileMenuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    mobileMenuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* ========== NAVBAR SCROLL EFFECT ========== */
function initNavbarScroll() {
    const navbar = document.querySelector('.sticky-navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.style.boxShadow = '0 8px 24px rgba(58, 43, 20, 0.08)';
        } else {
            navbar.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
    });
}

/* ========== FAQ ACCORDION ========== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                toggleFAQItem(item);
            });
        }
    });
}

function toggleFAQItem(item) {
    const isActive = item.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('active');
    });
    
    if (!isActive) {
        item.classList.add('active');
    }
}

/* ========== SMOOTH SCROLL ========== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });
    });
}

/* ========== TEMPLATE KATALOG ========== */
let currentFilter = 'semua';
let currentSearch = '';

function initTemplateKatalog() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const searchInput = document.getElementById('templateSearch');
    
    // Filter Tab Events
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderTemplates();
        });
    });
    
    // Search Input Events
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            renderTemplates();
        });
    }
    
    // Initial render
    renderTemplates();
}

function renderTemplates() {
    const templateGrid = document.getElementById('templateGrid');
    const noResults = document.getElementById('noResults');
    
    if (!templateGrid) return;
    
    // Filter templates
    let filteredTemplates = templates.filter(template => {
        // Filter by class
        const classMatch = currentFilter === 'semua' || template.kelas === currentFilter;
        
        // Filter by search
        const searchMatch = template.title.toLowerCase().includes(currentSearch) ||
                          template.nuansa.toLowerCase().includes(currentSearch);
        
        return classMatch && searchMatch;
    });
    
    // Show/hide no results message
    if (filteredTemplates.length === 0) {
        templateGrid.innerHTML = '';
        noResults.style.display = 'flex';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Render template cards
    templateGrid.innerHTML = filteredTemplates.map(template => `
        <div class="template-card" data-template-id="${template.id}">
            <div class="template-image">
                <img src="${template.image}" alt="${template.title}">
                <div class="template-overlay">
                    <button class="template-detail-btn" data-template-id="${template.id}">
                        <i class="fas fa-eye"></i> Lihat Detail
                    </button>
                </div>
            </div>
            <div class="template-content">
                <div class="template-badge template-badge-${template.kelas}">
                    ${getBadgeLabel(template.kelas)}
                </div>
                <h3 class="template-title">${template.title}</h3>
                <p class="template-nuansa">${template.nuansa}</p>
                <div class="template-footer">
                    <span class="template-price">Rp ${formatPrice(template.harga)}</span>
                    <button class="template-arrow" data-template-id="${template.id}">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to detail buttons
    document.querySelectorAll('.template-detail-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const templateId = parseInt(btn.dataset.templateId);
            openTemplateModal(templateId);
        });
    });
    
    // Add event listeners to arrow buttons
    document.querySelectorAll('.template-arrow').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const templateId = parseInt(btn.dataset.templateId);
            openTemplateModal(templateId);
        });
    });
}

function getBadgeLabel(kelas) {
    const badges = {
        basic: '<i class="fas fa-sparkles"></i> Basic',
        premium: '<i class="fas fa-crown"></i> Premium',
        exclusive: '<i class="fas fa-diamond"></i> Exclusive'
    };
    return badges[kelas] || kelas;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* ========== TEMPLATE MODAL ========== */
function initTemplateModal() {
    const modal = document.getElementById('templateModal');
    const closeModalBtn = document.getElementById('closeModal');
    const closeBtn = document.getElementById('closeModalBtn');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeTemplateModal();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeTemplateModal();
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeTemplateModal();
            }
        });
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTemplateModal();
        }
    });
}

function openTemplateModal(templateId) {
    const template = templates.find(t => t.id === templateId);
    
    if (!template) return;
    
    const modal = document.getElementById('templateModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalNuansa = document.getElementById('modalNuansa');
    const modalPrice = document.getElementById('modalPrice');
    const modalFeaturesList = document.getElementById('modalFeaturesList');
    const modalOrderBtn = document.getElementById('modalOrderBtn');
    
    // Set modal content
    modalImage.src = template.image;
    modalTitle.textContent = template.title;
    modalNuansa.textContent = template.nuansa;
    modalPrice.textContent = `Rp ${formatPrice(template.harga)}`;
    
    // Set features
    modalFeaturesList.innerHTML = template.features.map(feature => `
        <li>
            <i class="fas fa-check-circle"></i>
            ${feature}
        </li>
    `).join('');
    
    // Set order button
    const whatsappMessage = `Saya ingin memesan template ${template.title} (${template.nuansa}) seharga Rp ${formatPrice(template.harga)}`;
    const whatsappUrl = `https://wa.me/6282199773126?text=${encodeURIComponent(whatsappMessage)}`;
    modalOrderBtn.href = whatsappUrl;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTemplateModal() {
    const modal = document.getElementById('templateModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/* ========== UTILITY FUNCTIONS ========== */

/**
 * Throttle function to limit function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function to delay function execution
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Log initialization
 */
console.log('🎨 KaZora - Interactive Template Catalog Loaded');
