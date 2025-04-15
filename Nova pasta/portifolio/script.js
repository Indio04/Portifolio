// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Typed.js
    const typed = new Typed('.typing', {
        strings: ['Frontend', 'Web', 'JavaScript', 'React',],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Sticky Header
    const header = document.querySelector('header');
    const scrollTopBtn = document.querySelector('.scroll-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
            scrollTopBtn.classList.add('active');
        } else {
            header.classList.remove('sticky');
            scrollTopBtn.classList.remove('active');
        }
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Contact Form Submission with WhatsApp Integration
const contactForm = document.getElementById('contactForm');
    
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Format message for WhatsApp
        const whatsappMessage = `Olá, meu nome é ${name}, e meu email é ${email}, eu quero falar com você sobre ${subject}, e aqui está a mensagem: ${message}`;
        
        // WhatsApp phone number - replace with your number
        const phoneNumber = "5555996482798";
        
        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
        
        // Reset form after submission
        contactForm.reset();
        
        // Show success message
        alert('Redirecionando para o WhatsApp com sua mensagem!');
    });
}

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on scroll (simple version)
    function revealOnScroll() {
        const elements = document.querySelectorAll('.skill-item, .project-item, .contact-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Set initial styles for animation
    const animatedElements = document.querySelectorAll('.skill-item, .project-item, .contact-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Call on initial load and scroll
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
});

// Verificar se o CV existe
document.addEventListener('DOMContentLoaded', function() {
    const cvLink = document.querySelector('a[href$=".pdf"]');
    
    if (cvLink) {
        // Verificar se o arquivo existe
        fetch(cvLink.href)
            .then(response => {
                if (!response.ok) {
                    console.warn('Arquivo de CV não encontrado. Verifique o caminho.');
                    cvLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        alert('O CV não está disponível no momento. Por favor, tente novamente mais tarde.');
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao verificar o CV:', error);
            });
    }
});