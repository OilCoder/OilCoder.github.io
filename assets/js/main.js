/**
 * @file main.js
 * @brief Script principal para el sitio web de Carlos Andrés Esquivel
 * @author Carlos Andrés Esquivel
 * @date 2024-01-15
 */

// Variables globales
let currentLanguage = 'es';
let contentData = {};

// Inicialización del sitio
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing site...');
    initializeLanguage();
    loadContent(currentLanguage);
    initializeLanguageSelector();
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
        const response = await fetch(`assets/data/content-${language}.json?v=2.0.0`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        contentData = await response.json();
        console.log('Content loaded successfully:', contentData);
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
    const languagesTitle = document.querySelector('.languages h3');
    if (languagesTitle) languagesTitle.textContent = education.languages.title;

    const languageItems = document.querySelectorAll('.language-item');
    education.languages.items.forEach((lang, index) => {
        if (languageItems[index]) {
            const langName = languageItems[index].querySelector('span:first-child');
            const level = languageItems[index].querySelector('.level');

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