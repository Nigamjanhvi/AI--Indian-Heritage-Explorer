
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('mainNavbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Also observe timeline items for reveal animation
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});

// Slight parallax effect on hero banner for a subtle modern touch
document.addEventListener('mousemove', function(e){
    const banner = document.querySelector('.hero-banner');
    if(!banner) return;
    const rect = banner.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    banner.style.transform = `translate3d(${x*6}px, ${y*4}px, 0)`;
    banner.style.transition = 'transform 0.15s linear';
});

// Gallery Filter Function
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.btn-custom');
    
    // Remove active class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Show/hide gallery items based on category
    items.forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 10);
        } else {
            if (item.dataset.category === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        }
    });
}

// Contact Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (name.trim() === '' || email.trim() === '' || subject === '' || message.trim() === '') {
                showMessage('Please fill in all required fields.', 'danger');
                return;
            }
            
            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showMessage('Please enter a valid email address.', 'danger');
                return;
            }
            
            // If validation passes
            showMessage('Thank you for your message! We will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // In a real website, here you would send the data to a server
            // using fetch() or XMLHttpRequest
        });
    }
});

// Show message function for contact form
function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.heritage-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Prepare summaries and modal behavior for heritage & natural cards
document.addEventListener('DOMContentLoaded', function() {
    const siteModalEl = document.getElementById('siteModal');
    const bsModal = siteModalEl ? new bootstrap.Modal(siteModalEl) : null;
    const modalTitle = document.getElementById('siteModalLabel');
    const modalImage = document.getElementById('modalImageLarge');
    const modalFullDescription = document.getElementById('modalFullDescription');
    const modalMeta = document.getElementById('modalMeta');

    function makeSummary(card) {
        const body = card.querySelector('.card-body');
        if(!body) return;
        // collect full text from textual paragraphs excluding small.meta
        const paras = Array.from(body.querySelectorAll('p.card-text'));
        const smalls = Array.from(body.querySelectorAll('small'));
        // Join paragraphs (exclude small text)
        const full = paras.map(p => p.textContent.trim()).join('\n\n');
        card.dataset.full = full;
        // prepare summary element
        let summary = body.querySelector('.card-summary');
        if(!summary) {
            summary = document.createElement('p');
            summary.className = 'card-text card-summary';
            // insert summary after the title
            const title = body.querySelector('.card-title');
            if(title) title.insertAdjacentElement('afterend', summary);
            else body.appendChild(summary);
        }
        const short = full.length > 180 ? full.slice(0, 180).trim() + '…' : full;
        summary.textContent = short;

        // hide the original paragraphs to avoid duplicate text
        paras.forEach(p => p.style.display = 'none');
    }

    document.querySelectorAll('.heritage-card').forEach(card => {
        makeSummary(card);
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            // prevent clicks on links/buttons inside card
            if(e.target.closest('a') || e.target.closest('button')) return;
            const img = card.querySelector('img');
            const title = card.querySelector('.card-title')?.textContent || '';
            const year = card.querySelector('.card-text strong')?.textContent || '';
            const full = card.dataset.full || '';
            if(modalTitle) modalTitle.textContent = title;
            if(modalImage && img) modalImage.src = img.src;
            if(modalFullDescription) modalFullDescription.textContent = full;
            if(modalMeta) modalMeta.textContent = year;
            bsModal && bsModal.show();
            // highlight card briefly
            card.classList.add('active');
            setTimeout(()=>card.classList.remove('active'), 800);
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

// Initialize gallery items opacity
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
});

// Add active state to current page in navigation
document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Ensure only the current page link is highlighted.
    navLinks.forEach(link => link.classList.remove('active'));

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentLocation || (currentLocation === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Console message
console.log('%cIndian Heritage Explore', 'color: #FF9933; font-size: 24px; font-weight: bold;');
console.log('%cExploring India\'s Rich Cultural Heritage', 'color: #138808; font-size: 14px;');
console.log('%cThis is an educational project created to promote awareness about Indian heritage.', 'color: #666; font-size: 12px;');

// === Temple explorer: filter + highlight + optional modal ===
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('templeGrid');
    if (!grid) return;

    const cards = Array.from(document.querySelectorAll('#templeGrid .temple-card'));
    const search = document.getElementById('templeSearch');
    const stateFilter = document.getElementById('templeStateFilter');
    const regionFilter = document.getElementById('templeRegionFilter');
    const noResults = document.getElementById('templeNoResults');

    const highlightImage = document.getElementById('highlightImage');
    const highlightBadge = document.getElementById('highlightBadge');
    const highlightTitle = document.getElementById('highlightTitle');
    const highlightMeta = document.getElementById('highlightMeta');
    const highlightIntro = document.getElementById('highlightIntro');

    const modal = document.getElementById('templeModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalLocation = document.getElementById('modalLocation');
    const modalYear = document.getElementById('modalYear');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = document.querySelector('.temple-modal-close');
    let lastFocused = null;

    function categoryLabel(categoryRaw) {
        const categories = (categoryRaw || '').toLowerCase();
        if (categories.includes('multi-faith')) return 'Multi-Faith Temple';
        if (categories.includes('mountain')) return 'Mountain Temple';
        if (categories.includes('south')) return 'South India';
        if (categories.includes('north')) return 'North India';
        return 'Featured Temple';
    }

    function setActiveCard(activeCard) {
        cards.forEach(card => card.classList.remove('active-temple'));
        if (activeCard) activeCard.classList.add('active-temple');
    }

    function updateHighlight(card) {
        if (!card) return;
        const title = card.dataset.title || '';
        const location = card.dataset.location || '';
        const state = card.dataset.state || '';
        const year = card.dataset.year || '';
        const image = card.dataset.image || '';
        const description = card.dataset.description || '';

        if (highlightImage) highlightImage.src = image;
        if (highlightTitle) highlightTitle.textContent = title;
        if (highlightMeta) highlightMeta.textContent = `${location}, ${state} | ${year}`;
        if (highlightIntro) highlightIntro.textContent = description;
        if (highlightBadge) highlightBadge.textContent = categoryLabel(card.dataset.category || '');

        setActiveCard(card);
    }

    function openModalFromCard(card) {
        if (!modal) return;
        const title = card.dataset.title || '';
        const location = `${card.dataset.location || ''}, ${card.dataset.state || ''}`;
        const year = card.dataset.year || '';
        const image = card.dataset.image || '';
        const description = card.dataset.description || '';

        if (modalImage) modalImage.style.backgroundImage = `url('${image}')`;
        if (modalTitle) modalTitle.textContent = title;
        if (modalLocation) modalLocation.textContent = location;
        if (modalYear) modalYear.textContent = year;
        if (modalDescription) modalDescription.textContent = description;

        modal.setAttribute('aria-hidden', 'false');
        lastFocused = document.activeElement;
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'true');
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    function getVisibleCards() {
        return cards.filter(card => {
            const col = card.closest('[class*="col-"]');
            return col && col.style.display !== 'none';
        });
    }

    function applyFilters() {
        const q = (search ? search.value : '').trim().toLowerCase();
        const state = stateFilter ? stateFilter.value.trim().toLowerCase() : '';
        const category = regionFilter ? regionFilter.value.trim().toLowerCase() : '';

        cards.forEach(card => {
            const text = [
                card.dataset.title || '',
                card.dataset.location || '',
                card.dataset.state || '',
                card.dataset.year || '',
                card.dataset.description || '',
                card.dataset.category || ''
            ].join(' ').toLowerCase();

            const cardState = (card.dataset.state || '').toLowerCase();
            const cardCategories = (card.dataset.category || '').toLowerCase().split(',').map(v => v.trim());

            const matchText = !q || text.includes(q);
            const matchState = !state || cardState === state;
            const matchCategory = !category || cardCategories.includes(category);

            const col = card.closest('[class*="col-"]');
            if (!col) return;
            col.style.display = (matchText && matchState && matchCategory) ? '' : 'none';
        });

        const visible = getVisibleCards();
        if (noResults) noResults.classList.toggle('d-none', visible.length > 0);

        if (!visible.length) {
            setActiveCard(null);
            return;
        }

        let chosen = visible[0];
        if (q) {
            const firstExact = visible.find(card => {
                const title = (card.dataset.title || '').toLowerCase();
                return title.includes(q);
            });
            if (firstExact) chosen = firstExact;
        }

        updateHighlight(chosen);
    }

    cards.forEach(card => {
        card.addEventListener('click', function() {
            updateHighlight(card);
            openModalFromCard(card);
        });
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                updateHighlight(card);
                openModalFromCard(card);
            }
        });
    });

    if (search) search.addEventListener('input', applyFilters);
    if (stateFilter) stateFilter.addEventListener('change', applyFilters);
    if (regionFilter) regionFilter.addEventListener('change', applyFilters);

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target.classList && e.target.classList.contains('temple-modal-backdrop')) closeModal();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                closeModal();
            }
        });
    }

    applyFilters();
});
