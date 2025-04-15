document.addEventListener('DOMContentLoaded', function() {
    // Loader
    setTimeout(function() {
        document.querySelector('.loader-container').classList.add('hidden');
    }, 1000);

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle hamburger animation
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Dropdown Menu for Mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth < 992) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Search Toggle
    const searchBtn = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    
    if (searchBtn && searchOverlay && closeSearch) {
        searchBtn.addEventListener('click', function() {
            searchOverlay.classList.add('active');
        });
        
        closeSearch.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
        });
    }

    // Cart Sidebar Toggle
    const cartBtn = document.querySelector('.cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartBtn && cartSidebar && closeCart) {
        cartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('active');
        });
        
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
        });
    }

    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const prevSlide = document.querySelector('.prev-slide');
    const nextSlide = document.querySelector('.next-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    function showSlide(n) {
        heroSlides.forEach(slide => {
            slide.classList.remove('active');
            
            // Reset animations
            const animatedElements = slide.querySelectorAll('.animate-text');
            animatedElements.forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; // Trigger reflow
                el.style.animation = null;
            });
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        currentSlide = (n + heroSlides.length) % heroSlides.length;
        
        heroSlides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    if (prevSlide && nextSlide) {
        prevSlide.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
        
        nextSlide.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto slide
    let slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
    
    // Pause auto slide on hover
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        heroSlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);
        });
    }

    // Product Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    if (card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Quick View Modal
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const modal = document.querySelector('#quick-view-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (quickViewBtns.length > 0 && modal && closeModal) {
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                modal.classList.add('active');
            });
        });
        
        closeModal.addEventListener('click', function() {
            modal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Product Quantity
    const minusBtns = document.querySelectorAll('.minus');
    const plusBtns = document.querySelectorAll('.plus');
    const quantityInputs = document.querySelectorAll('.quantity input');
    
    if (minusBtns.length > 0 && plusBtns.length > 0) {
        minusBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                let value = parseInt(quantityInputs[index].value);
                if (value > 1) {
                    value--;
                    quantityInputs[index].value = value;
                }
            });
        });
        
        plusBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                let value = parseInt(quantityInputs[index].value);
                value++;
                quantityInputs[index].value = value;
            });
        });
    }

    // Product Variations
    const variationOptions = document.querySelectorAll('.variation-option');
    
    variationOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.variation-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Countdown Timer
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Set the countdown date (1 week from now)
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 7);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (daysEl) daysEl.innerHTML = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.innerHTML = hours < 10 ? '0' + hours : hours;
        if (minutesEl) minutesEl.innerHTML = minutes < 10 ? '0' + minutes : minutes;
        if (secondsEl) secondsEl.innerHTML = seconds < 10 ? '0' + seconds : seconds;
    }
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            
            if (email) {
                // Here you would typically send the email to your server
                alert('Obrigado por se inscrever em nossa newsletter!');
                this.reset();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Loader
        setTimeout(function() {
            const loader = document.querySelector('.loader-container');
            if (loader) {
                loader.classList.add('hidden');
                // Ou use a manipulação direta de estilo se preferir
            }
        }, 1000);
        
        // Resto do código...
    } catch (error) {
        console.error('Erro ao inicializar a página:', error);
        // Remover o loader mesmo se houver erro
        const loader = document.querySelector('.loader-container');
        if (loader) loader.style.display = 'none';
    }
});