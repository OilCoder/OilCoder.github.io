/**
 * @file main.js
 * @brief Script principal para el sitio web de Carlos Andrés Esquivel
 * @author Carlos Andrés Esquivel
 * @date 2024-01-15
 */

// Variables globales
let currentLanguage = 'es';
let contentData = {};
let isLoaded = false;

// Inicialización del sitio
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing site...');
    initializeLanguage();
    initializeThemeToggle();
    loadContent(currentLanguage);
    initializeLanguageSelector();
    initializeMobileMenu();
    initializeSkillsCarousel();
});

/**
 * Inicializa el idioma basado en localStorage o navegador
 */
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = navigator.language.substring(0, 2);

    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
        currentLanguage = savedLanguage;
    } else if (browserLanguage === 'en') {
        currentLanguage = 'en';
    } else {
        currentLanguage = 'es';
    }
    console.log('Language initialized:', currentLanguage);
}

/**
 * Carga el contenido desde el archivo JSON correspondiente
 * @param {string} language - Código del idioma ('es' o 'en')
 */
async function loadContent(language) {
    try {
        console.log('Loading content for language:', language);
        const response = await fetch(`assets/data/content-${language}.json?v=2.2.0`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        contentData = await response.json();
        console.log('Content loaded successfully:', contentData);
        isLoaded = true;
        hideLoadingPlaceholders();
        updatePageContent();
        updateLanguageSelector();
    } catch (error) {
        console.error('Error loading content:', error);
        // Fallback al español si hay error
        if (language !== 'es') {
            console.log('Falling back to Spanish...');
            loadContent('es');
        }
    }
}

/**
 * Oculta los placeholders de "Cargando..." y muestra el contenido
 */
function hideLoadingPlaceholders() {
    const loadingElements = document.querySelectorAll('*');
    loadingElements.forEach(element => {
        if (element.textContent && element.textContent.trim() === 'Cargando...') {
            element.style.opacity = '0.5';
        }
    });
}

/**
 * Actualiza todo el contenido de la página
 */
function updatePageContent() {
    console.log('Updating page content...');
    try {
        updateMeta();
        updateNavigation();
        updateHero();
        updateAbout();
        updateEducation();
        updateExperience();
        updateProjects();
        updateSkills();
        updateContact();
        updateFooter();
        console.log('Page content updated successfully');
    } catch (error) {
        console.error('Error updating page content:', error);
    }
}

/**
 * Actualiza los metadatos de la página
 */
function updateMeta() {
    if (contentData.meta) {
        document.title = contentData.meta.title;
        document.documentElement.lang = contentData.meta.lang;

        // Update meta description based on language
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && contentData.meta.lang === 'en') {
            metaDesc.content = "Petroleum Engineer specialized in AI & Machine Learning. Expert in wireline operations, well testing, and advanced data analysis with Python, MATLAB, and deep learning frameworks.";
        } else if (metaDesc) {
            metaDesc.content = "Ingeniero de petróleos especializado en IA y Machine Learning. Experto en operaciones wireline, pruebas de pozos y análisis avanzado de datos con Python, MATLAB y frameworks de deep learning.";
        }

        // Update Open Graph and Twitter meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogLocale = document.querySelector('meta[property="og:locale"]');
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');

        if (ogTitle) ogTitle.setAttribute('content', contentData.meta.title);
        if (ogDescription) ogDescription.setAttribute('content', metaDesc.content);
        if (ogLocale) {
            ogLocale.setAttribute('content', contentData.meta.lang === 'es' ? 'es_ES' : 'en_US');
        }
        if (twitterTitle) twitterTitle.setAttribute('content', contentData.meta.title);
        if (twitterDescription) twitterDescription.setAttribute('content', metaDesc.content);
    }
}

/**
 * Actualiza la navegación
 */
function updateNavigation() {
    if (!contentData.navigation) return;

    const nav = contentData.navigation;
    const aboutLink = document.querySelector('a[href="#about"]');
    const educationLink = document.querySelector('a[href="#education"]');
    const experienceLink = document.querySelector('a[href="#experience"]');
    const projectsLink = document.querySelector('a[href="#projects"]');
    const skillsLink = document.querySelector('a[href="#skills"]');
    const contactLink = document.querySelector('a[href="#contact"]');

    if (aboutLink) aboutLink.textContent = nav.about;
    if (educationLink) educationLink.textContent = nav.education;
    if (experienceLink) experienceLink.textContent = nav.experience;
    if (projectsLink) projectsLink.textContent = nav.projects;
    if (skillsLink) skillsLink.textContent = nav.skills;
    if (contactLink) contactLink.textContent = nav.contact;

    // Update CV download button in navigation
    const navCvButton = document.querySelector('.btn-nav-cv');
    if (navCvButton) {
        navCvButton.innerHTML = `<i class="fas fa-download"></i> CV`;
        // Update CV link based on language
        const cvFile = currentLanguage === 'es' ? 'cv/CV_Español.pdf' : 'cv/CV_English.pdf';
        navCvButton.href = cvFile;
    }
}

/**
 * Actualiza la sección hero
 */
function updateHero() {
    if (!contentData.hero) return;

    const hero = contentData.hero;
    const h1 = document.querySelector('.hero-text h1');
    const h2 = document.querySelector('.hero-text h2');
    const objective = document.querySelector('.objective');
    const btnDownload = document.querySelector('.btn-download');

    if (h1) h1.textContent = hero.name;
    if (h2) h2.textContent = hero.title;
    if (objective) objective.textContent = hero.objective;
    if (btnDownload) btnDownload.innerHTML = `<i class="fas fa-download"></i> ${hero.downloadCV}`;
}

/**
 * Actualiza la sección sobre mí
 */
function updateAbout() {
    if (!contentData.about) return;

    const about = contentData.about;
    const title = document.querySelector('#about h2');
    const description = document.querySelector('#about > .container > p');

    if (title) title.textContent = about.title;
    if (description) description.textContent = about.description;

    const highlights = document.querySelectorAll('.highlight-item');
    about.highlights.forEach((highlight, index) => {
        if (highlights[index]) {
            const h3 = highlights[index].querySelector('h3');
            const p = highlights[index].querySelector('p');
            if (h3) h3.textContent = highlight.title;
            if (p) p.textContent = highlight.description;
        }
    });
}

/**
 * Actualiza la sección de educación
 */
function updateEducation() {
    if (!contentData.education) return;

    const education = contentData.education;
    const title = document.querySelector('#education h2');
    if (title) title.textContent = education.title;

    const educationItems = document.querySelectorAll('.education-item');
    education.items.forEach((item, index) => {
        if (educationItems[index]) {
            const h3 = educationItems[index].querySelector('h3');
            const h4 = educationItems[index].querySelector('h4');
            const p = educationItems[index].querySelector('p');

            if (h3) h3.textContent = item.institution;
            if (h4) h4.textContent = item.degree;
            if (p) p.textContent = item.details;
        }
    });

    // Actualizar idiomas
    // Actualizar título de idiomas en sidebar
    const sidebarLanguagesTitle = document.querySelector('.sidebar-languages h3');
    if (sidebarLanguagesTitle) {
        sidebarLanguagesTitle.innerHTML = `<i class="fas fa-globe"></i> ${education.languages.title}`;
    }

    // Actualizar idiomas en sidebar
    const sidebarLanguageItems = document.querySelectorAll('.sidebar-languages .language-item');
    education.languages.items.forEach((lang, index) => {
        if (sidebarLanguageItems[index]) {
            const langName = sidebarLanguageItems[index].querySelector('.language-name span');
            const level = sidebarLanguageItems[index].querySelector('.level');

            if (langName) langName.textContent = lang.language;
            if (level) level.textContent = lang.level;
        }
    });
}

/**
 * Actualiza la sección de experiencia
 */
function updateExperience() {
    if (!contentData.experience) return;

    const experience = contentData.experience;
    const title = document.querySelector('#experience h2');
    if (title) title.textContent = experience.title;

    const timelineItems = document.querySelectorAll('.timeline-item');
    experience.items.forEach((item, index) => {
        if (timelineItems[index]) {
            const date = timelineItems[index].querySelector('.timeline-date');
            const h3 = timelineItems[index].querySelector('h3');
            const h4 = timelineItems[index].querySelector('h4');
            const ul = timelineItems[index].querySelector('ul');

            if (date) date.textContent = item.period;
            if (h3) h3.textContent = item.position;
            if (h4) h4.textContent = item.company;

            if (ul) {
                ul.innerHTML = '';
                item.responsibilities.forEach(responsibility => {
                    const li = document.createElement('li');
                    li.textContent = responsibility;
                    ul.appendChild(li);
                });
            }
        }
    });
}

/**
 * Actualiza la sección de proyectos
 */
function updateProjects() {
    if (!contentData.projects) return;

    const projects = contentData.projects;
    const title = document.querySelector('#projects h2');
    if (title) title.textContent = projects.title;

    const projectCards = document.querySelectorAll('.project-card');
    projects.items.forEach((project, index) => {
        if (projectCards[index]) {
            const h3 = projectCards[index].querySelector('h3');
            const projectDate = projectCards[index].querySelector('.project-date');
            const description = projectCards[index].querySelector('p:not(.project-date)');

            if (h3) h3.textContent = project.title;
            if (projectDate) projectDate.textContent = project.period;
            if (description) description.textContent = project.description;

            const achievementsContainer = projectCards[index].querySelector('.project-achievements');
            if (achievementsContainer) {
                achievementsContainer.innerHTML = '';
                project.achievements.forEach(achievement => {
                    const span = document.createElement('span');
                    span.className = 'achievement';
                    span.textContent = achievement;
                    achievementsContainer.appendChild(span);
                });
            }

            const techContainer = projectCards[index].querySelector('.tech-stack');
            if (techContainer) {
                techContainer.innerHTML = '';
                project.technologies.forEach(tech => {
                    const span = document.createElement('span');
                    span.textContent = tech;
                    techContainer.appendChild(span);
                });
            }

            // Update project links
            const githubLink = projectCards[index].querySelector('.github-link');
            const demoLink = projectCards[index].querySelector('.demo-link');

            if (githubLink && project.github) {
                githubLink.href = project.github;
                githubLink.target = '_blank';
                githubLink.rel = 'noopener noreferrer';
                githubLink.style.display = 'flex';

                // Remove any existing click handlers and add new one
                githubLink.onclick = function (e) {
                    e.preventDefault();
                    window.open(project.github, '_blank', 'noopener,noreferrer');
                };
            } else if (githubLink) {
                githubLink.style.display = 'none';
            }

            if (demoLink && project.demo && project.demo !== '#') {
                demoLink.href = project.demo;
                demoLink.target = '_blank';
                demoLink.rel = 'noopener noreferrer';
                demoLink.style.display = 'flex';

                // Remove any existing click handlers and add new one
                demoLink.onclick = function (e) {
                    e.preventDefault();
                    window.open(project.demo, '_blank', 'noopener,noreferrer');
                };
            } else if (demoLink) {
                demoLink.style.display = 'none';
            }
        }
    });
}

/**
 * Actualiza la sección de habilidades
 */
function updateSkills() {
    if (!contentData.skills) return;

    const skills = contentData.skills;
    const title = document.querySelector('#skills h2');
    if (title) title.textContent = skills.title;

    const skillCategories = document.querySelectorAll('.skill-category');
    skills.categories.forEach((category, index) => {
        if (skillCategories[index]) {
            const h3 = skillCategories[index].querySelector('h3');
            if (h3) h3.innerHTML = `<i class="${category.icon}"></i> ${category.title}`;

            const skillList = skillCategories[index].querySelector('.skill-list');
            if (skillList) {
                skillList.innerHTML = '';
                category.items.forEach(skill => {
                    const span = document.createElement('span');
                    span.textContent = skill;
                    skillList.appendChild(span);
                });
            }
        }
    });
}

/**
 * Actualiza la sección de contacto
 */
function updateContact() {
    if (!contentData.contact) return;

    const contact = contentData.contact;
    const title = document.querySelector('#contact h2');
    const infoTitle = document.querySelector('.contact-info h3');
    const socialTitle = document.querySelector('.social-links h3');

    if (title) title.textContent = contact.title;
    if (infoTitle) infoTitle.textContent = contact.info.title;
    if (socialTitle) socialTitle.textContent = contact.social.title;

    const socialLinks = document.querySelectorAll('.social-links a');
    if (socialLinks[0]) socialLinks[0].innerHTML = `<i class="fab fa-linkedin"></i> ${contact.social.linkedin}`;
    if (socialLinks[1]) socialLinks[1].innerHTML = `<i class="fab fa-github"></i> ${contact.social.github}`;
}

/**
 * Actualiza el footer
 */
function updateFooter() {
    if (!contentData.footer) return;

    const footerText = document.querySelector('footer p');
    if (footerText) footerText.textContent = contentData.footer.copyright;
}

/**
 * Inicializa el menú móvil hamburger
 */
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('show');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('show');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

/**
 * Inicializa el selector de idiomas
 */
function initializeLanguageSelector() {
    const languageOptions = document.querySelectorAll('.lang-option');

    languageOptions.forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedLang = this.getAttribute('data-lang');
            changeLanguage(selectedLang);
        });
    });

    // Toggle dropdown
    const dropdownBtn = document.getElementById('languageDropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (dropdownBtn && dropdownContent) {
        dropdownBtn.addEventListener('click', function (e) {
            e.preventDefault();
            dropdownContent.classList.toggle('show');
        });

        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.dropdown')) {
                dropdownContent.classList.remove('show');
            }
        });
    }
}

/**
 * Cambia el idioma de la página
 * @param {string} language - Código del idioma ('es' o 'en')
 */
function changeLanguage(language) {
    if (language !== currentLanguage) {
        console.log('Changing language to:', language);
        currentLanguage = language;
        localStorage.setItem('preferredLanguage', language);
        loadContent(language);
    }
}

/**
 * Actualiza el selector de idiomas
 */
function updateLanguageSelector() {
    const dropdownBtn = document.getElementById('languageDropdown');
    if (!dropdownBtn) return;

    const flagImg = dropdownBtn.querySelector('.flag-img');
    const langText = dropdownBtn.querySelector('.lang-text');

    if (flagImg && langText) {
        if (currentLanguage === 'es') {
            flagImg.src = 'https://flagcdn.com/w20/es.png';
            flagImg.alt = 'España';
            langText.textContent = 'Español';
        } else {
            flagImg.src = 'https://flagcdn.com/w20/gb-eng.png';
            flagImg.alt = 'Inglaterra';
            langText.textContent = 'English';
        }
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }

    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Add animation to timeline items
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});

/**
 * Inicializa el toggle de tema oscuro/claro
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Aplicar tema guardado
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

/**
 * Actualiza el icono del botón de tema
 * @param {string} theme - 'light' o 'dark'
 */
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }
}

/**
 * Inicializa el carrusel de habilidades
 */
function initializeSkillsCarousel() {
    const carousel = document.getElementById('skillsCarousel');
    const prevBtn = document.getElementById('skillsPrev');
    const nextBtn = document.getElementById('skillsNext');
    const indicators = document.querySelectorAll('.indicator');

    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.skill-card').length;

    if (!carousel || !prevBtn || !nextBtn) return;

    /**
     * Actualiza la posición del carrusel
     * @param {number} slideIndex - Índice del slide a mostrar
     */
    function updateCarousel(slideIndex) {
        const translateX = -slideIndex * 100;
        carousel.style.transform = `translateX(${translateX}%)`;

        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === slideIndex);
        });

        currentSlide = slideIndex;
    }

    /**
     * Ir al siguiente slide
     */
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        updateCarousel(nextIndex);
    }

    /**
     * Ir al slide anterior
     */
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel(prevIndex);
    }

    // Event listeners para botones
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            updateCarousel(index);
        });
    });

    // Auto-play del carrusel (opcional)
    let autoPlayInterval;

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // Cambiar cada 5 segundos
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Iniciar auto-play
    startAutoPlay();

    // Pausar auto-play al hacer hover
    const carouselContainer = document.querySelector('.skills-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Soporte para gestos táctiles en móviles
    let startX = 0;
    let endX = 0;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
        }
    }

    // Soporte para teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
} 