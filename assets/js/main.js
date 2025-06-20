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

    // Detectar si estamos en una página de proyecto
    if (window.location.pathname.includes('/projects/')) {
        loadProjectContent(currentLanguage);
    } else {
        loadContent(currentLanguage);
    }

    initializeLanguageSelector();
    initializeMobileMenu();
    initializeSkillsCarousel();
    initializeSidebarToggle();
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
    if (navCvButton && contentData.hero) {
        // Update CV link based on language
        const cvFile = currentLanguage === 'es' ? 'cv/carlos_esquivel_cv_es.pdf' : 'cv/carlos_esquivel_cv_en.pdf';
        navCvButton.href = cvFile;

        // Update button text based on language
        const cvText = navCvButton.querySelector('.cv-text');
        if (cvText && contentData.hero.cvButtonText) {
            cvText.textContent = contentData.hero.cvButtonText;
        }

        // Update tooltip text based on language
        const tooltip = navCvButton.querySelector('.tooltip');
        if (tooltip) {
            const tooltipText = currentLanguage === 'es' ? 'HV PDF' : 'CV PDF';
            tooltip.textContent = tooltipText;
        }
    }
}

/**
 * Actualiza la sección hero/profile
 */
function updateHero() {
    if (!contentData.hero) return;

    const hero = contentData.hero;
    // Para la página principal (sidebar layout)
    const h1 = document.querySelector('.profile-info h1') || document.querySelector('.hero-text h1');
    const h2 = document.querySelector('.profile-info h2') || document.querySelector('.hero-text h2');
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
            // Update project icon
            const icon = projectCards[index].querySelector('.project-icon i');
            if (icon && project.icon) {
                icon.className = project.icon;
            }

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

    console.log('Updating skills with data:', contentData.skills);

    const skills = contentData.skills;
    const title = document.querySelector('#skills h2');
    if (title) title.textContent = skills.title;

    const skillCategories = document.querySelectorAll('.skill-category');
    skills.categories.forEach((category, index) => {
        if (skillCategories[index]) {
            const h3 = skillCategories[index].querySelector('h3');
            if (h3) h3.innerHTML = `<i class="${category.icon}"></i> ${category.title}`;

            const skillList = skillCategories[index].querySelector('.skill-items');
            if (skillList) {
                skillList.innerHTML = '';
                category.items.forEach(skill => {
                    const skillItem = document.createElement('div');
                    skillItem.className = 'skill-item';

                    // Verificar si el skill tiene icono específico
                    if (typeof skill === 'object' && skill.name && skill.icon) {
                        // Verificar si es un archivo SVG o un icono de Font Awesome
                        if (skill.icon.endsWith('.svg')) {
                            console.log('Creating SVG icon for:', skill.name, 'with path:', skill.icon);
                            skillItem.innerHTML = `<img src="${skill.icon}" alt="${skill.name}" class="skill-icon-svg"><span>${skill.name}</span>`;
                        } else {
                            skillItem.innerHTML = `<i class="${skill.icon}"></i><span>${skill.name}</span>`;
                        }
                    } else {
                        // Mantener compatibilidad con strings simples
                        const skillName = typeof skill === 'string' ? skill : skill.name || skill;
                        skillItem.innerHTML = `<span>${skillName}</span>`;
                    }

                    skillList.appendChild(skillItem);
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

            // Cerrar el dropdown después de seleccionar idioma
            const dropdownContent = document.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.classList.remove('show');
            }
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

        // Detectar si estamos en una página de proyecto
        if (window.location.pathname.includes('/projects/')) {
            loadProjectContent(language);
        } else {
            loadContent(language);
        }
    }
}

/**
 * Actualiza el selector de idiomas
 */
function updateLanguageSelector() {
    // Buscar el selector tanto en página principal como en páginas de proyecto
    const dropdownBtn = document.getElementById('languageDropdown') || document.querySelector('.dropdown-btn');
    if (!dropdownBtn) return;

    const flagImg = dropdownBtn.querySelector('.flag-img') || document.getElementById('current-flag');
    const langText = dropdownBtn.querySelector('.lang-text');

    if (flagImg && langText) {
        if (currentLanguage === 'es') {
            flagImg.src = 'https://flagcdn.com/w20/es.png';
            flagImg.alt = 'España';
            langText.textContent = 'Español';
        } else {
            flagImg.src = 'https://flagcdn.com/w20/us.png';
            flagImg.alt = 'Estados Unidos';
            langText.textContent = 'English';
        }
    } else if (flagImg) {
        // Solo actualizar la bandera si no hay texto
        if (currentLanguage === 'es') {
            flagImg.src = 'https://flagcdn.com/w20/es.png';
            flagImg.alt = 'España';
        } else {
            flagImg.src = 'https://flagcdn.com/w20/us.png';
            flagImg.alt = 'Estados Unidos';
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
    updateThemeCheckbox(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('change', function () {
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

/**
 * Actualiza el estado del checkbox de tema
 * @param {string} theme - 'light' o 'dark'
 */
function updateThemeCheckbox(theme) {
    const themeToggle = document.getElementById('themeToggle') || document.querySelector('.theme-toggle input');
    if (themeToggle) {
        themeToggle.checked = (theme === 'dark');
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

// ===== FUNCIONES GLOBALES PARA HTML =====

/**
 * Función global para cambiar tema (llamada desde HTML)
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeCheckbox(newTheme);
}

/**
 * Función global para mostrar/ocultar dropdown de idioma (llamada desde HTML)
 */
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

/**
 * Carga el contenido del proyecto desde el archivo JSON correspondiente
 * @param {string} language - Código del idioma ('es' o 'en')
 */
async function loadProjectContent(language) {
    try {
        console.log('Loading project content for language:', language);

        // Cargar datos del proyecto según el idioma
        const projectFile = language === 'en' ? 'project-kansas-en.json' : 'project-kansas-es.json';
        const projectResponse = await fetch(`../assets/data/${projectFile}?v=3.6.0`);
        if (!projectResponse.ok) {
            throw new Error(`HTTP error! status: ${projectResponse.status}`);
        }
        const projectData = await projectResponse.json();

        // Cargar datos de contenido general para navegación
        const contentResponse = await fetch(`../assets/data/content-${language}.json?v=2.2.0`);
        if (!contentResponse.ok) {
            throw new Error(`HTTP error! status: ${contentResponse.status}`);
        }
        contentData = await contentResponse.json();

        console.log('Project content loaded successfully');
        isLoaded = true;
        hideLoadingPlaceholders();
        updateProjectPageContent(projectData, language);
        updateLanguageSelector();
    } catch (error) {
        console.error('Error loading project content:', error);
        // Fallback al español si hay error
        if (language !== 'es') {
            console.log('Falling back to Spanish...');
            loadProjectContent('es');
        }
    }
}

/**
 * Actualiza el contenido de la página de proyecto
 * @param {Object} projectData - Datos del proyecto
 * @param {string} language - Idioma actual
 */
function updateProjectPageContent(projectData, language) {
    console.log('Updating project page content...');
    try {
        const project = projectData.project;

        // Actualizar metadatos
        updateProjectMeta(project, language);

        // Actualizar navegación
        updateProjectNavigation(language);

        // Actualizar contenido del proyecto
        updateProjectHero(project, language);
        updateProjectOverview(project, language);
        updateProjectMethodology(project, language);
        updateProjectTechnologies(project, language);
        updateProjectResults(project, language);
        updateProjectDocumentation(project, language);
        updateProjectFeatures(project, language);

        console.log('Project page content updated successfully');
    } catch (error) {
        console.error('Error updating project page content:', error);
    }
}

/**
 * Actualiza los metadatos de la página de proyecto
 */
function updateProjectMeta(project, language) {
    // Títulos y descripciones
    const pageTitle = document.getElementById('page-title');
    const pageDescription = document.getElementById('page-description');
    const ogTitle = document.getElementById('og-title');
    const ogDescription = document.getElementById('og-description');
    const twitterTitle = document.getElementById('twitter-title');
    const twitterDescription = document.getElementById('twitter-description');

    const title = language === 'en' ?
        'Neural Network Pipeline for Petrophysical Analysis' :
        project.title;
    const description = language === 'en' ?
        'Advanced Machine Learning pipeline for petrophysical analysis and prediction from well logs, with optimized neural networks and rigorous validation.' :
        project.subtitle;

    if (pageTitle) pageTitle.textContent = title;
    if (pageDescription) pageDescription.setAttribute('content', description);
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDescription) ogDescription.setAttribute('content', description);
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    if (twitterDescription) twitterDescription.setAttribute('content', description);

    // Actualizar idioma del documento
    document.documentElement.lang = language;
    document.title = title;
}

/**
 * Actualiza la navegación de la página de proyecto
 */
function updateProjectNavigation(language) {
    if (!contentData.navigation) return;

    const nav = contentData.navigation;
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes('#about')) {
            link.textContent = language === 'en' ? 'Home' : 'Inicio';
        } else if (href.includes('#projects')) {
            link.textContent = nav.projects;
        } else if (href.includes('#skills')) {
            link.textContent = nav.skills;
        }
    });

    // Actualizar botón de CV
    const navCvButton = document.querySelector('.btn-nav-cv');
    if (navCvButton) {
        const cvFile = language === 'es' ? '../cv/carlos_esquivel_cv_es.pdf' : '../cv/carlos_esquivel_cv_en.pdf';
        navCvButton.href = cvFile;
    }

    // Actualizar botón de tema
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', language === 'en' ? 'Toggle theme' : 'Cambiar tema');
    }
}

/**
 * Actualiza la sección hero del proyecto
 */
function updateProjectHero(project, language) {
    // Botón de regreso
    const backText = document.getElementById('back-text');
    if (backText) {
        backText.textContent = language === 'en' ? 'Back to Projects' : 'Volver a Proyectos';
    }

    // Título y subtítulo
    const projectTitle = document.getElementById('project-title');
    const projectSubtitle = document.getElementById('project-subtitle');

    if (projectTitle) {
        projectTitle.textContent = language === 'en' ?
            'Neural Network Pipeline for Petrophysical Analysis' :
            project.title;
    }

    if (projectSubtitle) {
        projectSubtitle.textContent = language === 'en' ?
            'Advanced Machine Learning pipeline for petrophysical analysis and prediction from well logs, with optimized neural networks and rigorous validation.' :
            project.subtitle;
    }

    // Metadatos del proyecto
    const projectPeriod = document.getElementById('project-period');
    const projectCategory = document.getElementById('project-category');
    const projectStatus = document.getElementById('project-status');

    if (projectPeriod) projectPeriod.textContent = project.period;
    if (projectCategory) {
        projectCategory.textContent = language === 'en' ?
            'Machine Learning & Petrophysics' :
            project.category;
    }
    if (projectStatus) {
        projectStatus.textContent = language === 'en' ? 'Completed' : project.status;
    }

    // Enlaces de acción
    const githubLink = document.getElementById('github-link');
    const githubText = document.getElementById('github-text');
    const docsLink = document.getElementById('docs-link');
    const docsText = document.getElementById('docs-text');

    if (githubLink) {
        githubLink.href = project.github_url;
        githubLink.onclick = function (e) {
            e.preventDefault();
            window.open(project.github_url, '_blank');
        };
    }
    if (githubText) {
        githubText.textContent = language === 'en' ? 'View on GitHub' : 'Ver en GitHub';
    }

    if (docsLink) {
        docsLink.href = project.documentation_url;
        docsLink.onclick = function (e) {
            e.preventDefault();
            window.open(project.documentation_url, '_blank');
        };
    }
    if (docsText) {
        docsText.textContent = language === 'en' ? 'Documentation' : 'Documentación';
    }
}

/**
 * Actualiza la sección de resumen del proyecto
 */
function updateProjectOverview(project, language) {
    const overviewTitle = document.getElementById('overview-title');
    const overviewSubtitle = document.getElementById('overview-subtitle');

    if (overviewTitle) {
        overviewTitle.textContent = language === 'en' ? 'Project Overview' : 'Resumen del Proyecto';
    }

    if (overviewSubtitle) {
        overviewSubtitle.textContent = language === 'en' ?
            'Complete solution to automate petrophysical analysis through artificial intelligence' :
            'Solución completa para automatizar el análisis petrofísico mediante inteligencia artificial';
    }

    // Actualizar tarjetas técnicas usando key_features del JSON
    if (project.key_features && project.key_features.length >= 4) {
        project.key_features.forEach((feature, index) => {
            const titleId = `feature-${index + 1}-title`;
            const descId = `feature-${index + 1}-desc`;
            const titleElement = document.getElementById(titleId);
            const descElement = document.getElementById(descId);

            if (titleElement) titleElement.textContent = feature.title;
            if (descElement) descElement.textContent = feature.description;
        });
    }
}

/**
 * Actualiza la sección de metodología del proyecto
 */
function updateProjectMethodology(project, language) {
    const methodologyTitle = document.getElementById('methodology-title');
    const methodologySubtitle = document.getElementById('methodology-subtitle');

    if (methodologyTitle) {
        methodologyTitle.textContent = language === 'en' ? 'Pipeline Methodology' : 'Metodología del Pipeline';
    }

    if (methodologySubtitle) {
        methodologySubtitle.textContent = language === 'en' ?
            'Complete 8-step pipeline from raw data to production models' :
            'Pipeline completo de 8 pasos desde datos crudos hasta modelos de producción';
    }

    // Actualizar pasos del pipeline usando datos del JSON
    if (project.pipeline_steps) {
        project.pipeline_steps.forEach((step, index) => {
            const titleId = `step-${index + 1}-title`;
            const descId = `step-${index + 1}-desc`;
            const titleElement = document.getElementById(titleId);
            const descElement = document.getElementById(descId);

            if (titleElement) titleElement.textContent = step.title;
            if (descElement) descElement.textContent = step.description;
        });
    }
}

/**
 * Actualiza la sección de tecnologías del proyecto
 */
function updateProjectTechnologies(project, language) {
    const techTitle = document.getElementById('tech-title');
    const techSubtitle = document.getElementById('tech-subtitle');

    if (techTitle) {
        techTitle.textContent = language === 'en' ? 'Technology Stack' : 'Stack Tecnológico';
    }
    if (techSubtitle) {
        techSubtitle.textContent = language === 'en' ?
            'Cutting-edge technologies for maximum performance and scalability' :
            'Tecnologías de vanguardia para máximo rendimiento y escalabilidad';
    }

    // Actualizar elementos de tecnología usando datos del JSON
    if (project.technologies) {
        project.technologies.forEach((tech, index) => {
            const nameId = `tech-${index + 1}-name`;
            const descId = `tech-${index + 1}-desc`;
            const nameElement = document.getElementById(nameId);
            const descElement = document.getElementById(descId);

            if (nameElement) nameElement.textContent = tech.name;
            if (descElement) descElement.textContent = tech.description;
        });
    }
}

/**
 * Actualiza la sección de resultados del proyecto
 */
function updateProjectResults(project, language) {
    const resultsTitle = document.getElementById('results-title');
    const resultsSubtitle = document.getElementById('results-subtitle');

    if (resultsTitle) {
        resultsTitle.textContent = language === 'en' ? 'Results & Metrics' : 'Resultados y Métricas';
    }
    if (resultsSubtitle) {
        resultsSubtitle.textContent = language === 'en' ?
            'Quantifiable achievements of the machine learning pipeline' :
            'Logros cuantificables del pipeline de machine learning';
    }

    // Actualizar tarjetas de resultados usando datos del JSON
    if (project.results) {
        project.results.forEach((result, index) => {
            const numberId = `result-${index + 1}-number`;
            const labelId = `result-${index + 1}-label`;
            const descId = `result-${index + 1}-desc`;
            const numberElement = document.getElementById(numberId);
            const labelElement = document.getElementById(labelId);
            const descElement = document.getElementById(descId);

            if (numberElement) numberElement.textContent = result.number;
            if (labelElement) labelElement.textContent = result.label;
            if (descElement) descElement.textContent = result.description;
        });
    }
}

/**
 * Actualiza la sección de documentación del proyecto
 */
function updateProjectDocumentation(project, language) {
    const docsTitle = document.getElementById('docs-title');
    const docsSubtitle = document.getElementById('docs-subtitle');

    if (docsTitle) {
        docsTitle.textContent = language === 'en' ? 'Technical Documentation' : 'Documentación Técnica';
    }
    if (docsSubtitle) {
        docsSubtitle.textContent = language === 'en' ?
            'Complete documentation of each pipeline phase' :
            'Documentación completa de cada fase del pipeline';
    }

    // Actualizar enlaces de documentación usando datos del JSON
    const docLinks = document.querySelectorAll('.doc-link');
    if (project.documentation) {
        project.documentation.forEach((doc, index) => {
            if (docLinks[index]) {
                const title = docLinks[index].querySelector('h4');
                const description = docLinks[index].querySelector('p');
                if (title) title.textContent = doc.title;
                if (description) description.textContent = doc.description;
                docLinks[index].href = doc.url;
            }
        });
    }
}

/**
 * Actualiza la sección de características principales del proyecto
 */
function updateProjectFeatures(project, language) {
    const featuresTitle = document.getElementById('features-title');
    const featuresSubtitle = document.getElementById('features-subtitle');

    if (featuresTitle) {
        featuresTitle.textContent = language === 'en' ? 'Key Features' : 'Características Principales';
    }
    if (featuresSubtitle) {
        featuresSubtitle.textContent = language === 'en' ?
            'Advanced functionalities of the machine learning pipeline' :
            'Funcionalidades avanzadas del pipeline de machine learning';
    }

    // Actualizar características principales usando datos del JSON
    if (project.key_features && project.key_features.length >= 4) {
        project.key_features.forEach((feature, index) => {
            const titleId = `key-feature-${index + 1}-title`;
            const descId = `key-feature-${index + 1}-desc`;
            const titleElement = document.getElementById(titleId);
            const descElement = document.getElementById(descId);

            if (titleElement) titleElement.textContent = feature.title;
            if (descElement) descElement.textContent = feature.description;
        });
    }
}

/**
 * Inicializa el toggle del sidebar
 */
function initializeSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle && sidebar) {
        // Cargar estado guardado del sidebar
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
        }

        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('collapsed');

            // Guardar estado en localStorage
            const collapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', collapsed);
        });
    }
}