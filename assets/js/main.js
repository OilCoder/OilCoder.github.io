/**
 * @file main.js
 * @brief Dynamic content loading and language switching functionality
 * @author Carlos Esquivel
 * @date 2025-01-26
 */

class PortfolioApp {
    constructor() {
        this.currentLang = 'es';
        this.content = {};
        this.svgIcons = {}; // Cache for SVG icons
        this.init();
    }

    async init() {
        await this.loadContent();
        await this.loadSVGIcons();
        this.renderContent();
        this.setupEventListeners();
        this.setupScrollSpy();
        this.scrollToHash();
    }

    /**
     * Scroll to the URL hash target after dynamic content has loaded.
     */
    scrollToHash() {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }

    async loadContent() {
        try {
            // Load both language files
            const [esResponse, enResponse] = await Promise.all([
                fetch('assets/data/content-es.json'),
                fetch('assets/data/content-en.json')
            ]);

            this.content.es = await esResponse.json();
            this.content.en = await enResponse.json();
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    async loadSVGIcons() {
        const icons = {
            'linkedin': 'assets/icons/linkedin-color-svgrepo-com.svg',
            'github': 'assets/icons/github-color-svgrepo-com.svg',
            'download': 'assets/icons/floppy-disk-svgrepo-com (1).svg',
            'email': 'assets/icons/gmail-icon-logo-svgrepo-com.svg',
            'phone': 'assets/icons/telephone-call-svgrepo-com.svg',
            'education': 'assets/icons/cap-education-hat-svgrepo-com.svg',
            'experience': 'assets/icons/business-briefcase-svgrepo-com.svg',
            'projects': 'assets/icons/space-shuttle-svgrepo-com.svg',
            'user': 'assets/icons/man-user-svgrepo-com.svg',
            'skills': 'assets/icons/target-svgrepo-com.svg'
        };

        for (const [key, path] of Object.entries(icons)) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    this.svgIcons[key] = await response.text();
                }
            } catch (error) {
                console.warn(`Failed to load icon: ${path}`);
            }
        }
    }

    getSVGIcon(iconType) {
        return this.svgIcons[iconType] || '';
    }

    setupEventListeners() {
        // Language toggle buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            });
        });

        // Theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');

        if (themeToggle && themeIcon) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute('data-theme', newTheme);
                themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';

                // Save theme preference
                localStorage.setItem('theme', newTheme);
            });
        }

        // Load saved theme on page load
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }

        // Initial sidebar toggle setup
        this.setupSidebarToggle();

        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    setupSidebarToggle() {
        // Remove existing listeners to avoid duplicates
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            // Clone node to remove all event listeners
            const newToggle = sidebarToggle.cloneNode(true);
            sidebarToggle.parentNode.replaceChild(newToggle, sidebarToggle);
        }

        // Setup sidebar toggle functionality
        const newSidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        const toggleIcon = document.getElementById('toggle-icon');

        if (newSidebarToggle && sidebar && mainContent && toggleIcon) {
            newSidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('sidebar-collapsed');
                toggleIcon.textContent = sidebar.classList.contains('collapsed') ? '→' : '☰';

                // Force reposition the toggle button
                if (sidebar.classList.contains('collapsed')) {
                    newSidebarToggle.style.left = '50px';
                } else {
                    newSidebarToggle.style.left = '330px';
                }
            });
        }
    }

    switchLanguage(lang) {
        if (lang === this.currentLang) return;

        this.currentLang = lang;

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;
        document.documentElement.dataset.lang = lang;

        // Re-render content
        this.renderContent();
    }

    renderContent() {
        const data = this.content[this.currentLang];
        if (!data) return;

        // Update meta information
        document.title = data.meta.title;

        // Update all elements with data-content attributes
        document.querySelectorAll('[data-content]').forEach(element => {
            const path = element.dataset.content;
            const value = this.getNestedValue(data, path);
            if (value) {
                element.innerHTML = value;
            }
        });

        // Render dynamic sections
        this.renderSidebar(data);
        this.renderAbout(data);
        this.renderEducation(data);
        this.renderProjects(data);
        this.renderExperience(data);
        this.renderSkills(data);
        this.renderContactInfo(data);
    }

    renderSidebar(data) {
        // Contact Details - Only icon + value with custom SVG icons
        const contactDetails = document.getElementById('sidebar-contact-details');
        if (contactDetails && data.sidebar.contact.items) {
            contactDetails.innerHTML = data.sidebar.contact.items.map(item => {
                let iconHtml = '';
                if (item.type === 'linkedin') {
                    iconHtml = `<span class="icon-svg">${this.getSVGIcon('linkedin')}</span>`;
                } else if (item.type === 'github') {
                    iconHtml = `<span class="icon-svg">${this.getSVGIcon('github')}</span>`;
                } else if (item.type === 'email') {
                    iconHtml = `<span class="icon-svg">${this.getSVGIcon('email')}</span>`;
                } else if (item.type === 'phone') {
                    iconHtml = `<span class="icon-svg">${this.getSVGIcon('phone')}</span>`;
                } else {
                    iconHtml = `<span class="icon">${item.icon}</span>`;
                }

                return `
                    <div class="contact-item">
                        ${iconHtml}
                        <div class="contact-info">
                            ${item.link ?
                        `<a href="${item.link}" ${item.type === 'linkedin' || item.type === 'github' ? 'target="_blank"' : ''}>${item.value}</a>` :
                        `<span class="value">${item.value}</span>`
                    }
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Resume Download - Single Dynamic Button with custom icon
        const resumeDownloads = document.getElementById('sidebar-resume-downloads');
        if (resumeDownloads && data.sidebar.resume.download) {
            const download = data.sidebar.resume.download;
            resumeDownloads.innerHTML = `
                <button class="resume-btn" data-file="cv/${download.file}">
                    <span class="icon-svg">${this.getSVGIcon('download')}</span>
                    <span>${download.label}</span>
                </button>
            `;

            // Add click event listener for download
            const resumeBtn = resumeDownloads.querySelector('.resume-btn');
            if (resumeBtn) {
                resumeBtn.addEventListener('click', () => {
                    const fileUrl = resumeBtn.getAttribute('data-file');
                    window.open(fileUrl, '_blank');
                });
            }
        }

        // Navigation Links
        const navigation = document.getElementById('sidebar-navigation');
        if (navigation && data.sidebar.navigation.items) {
            navigation.innerHTML = data.sidebar.navigation.items.map(item => `
                <li>
                    <a href="${item.target}" data-target="${item.target}">
                        <span class="nav-icon">${this.getSVGIcon(item.icon)}</span>
                        <span>${item.label}</span>
                    </a>
                </li>
            `).join('');
        }

        // Add smooth scrolling and active state management for navigation
        this.setupNavigationScrolling();

        // Re-setup sidebar toggle after content changes
        this.setupSidebarToggle();
    }

    renderProjects(data) {
        const container = document.getElementById('projects-container');
        if (!container || !data.projects) return;

        container.innerHTML = data.projects.items.map(project => `
            <article class="project-article">
                <h3>
                    ${project.demo ?
                `<a href="${project.demo}">${project.title}</a>` :
                project.title
            }
                </h3>
                <p class="project-date">${project.period}</p>
                <p>${project.description}</p>
                ${project.achievements ? `
                    <ul class="project-achievements">
                        ${project.achievements.map(achievement => `<li><strong>${achievement}</strong></li>`).join('')}
                    </ul>
                ` : ''}
            </article>
        `).join('');
    }

    renderExperience(data) {
        const container = document.getElementById('experience-container');
        if (!container || !data.experience) return;

        const items = data.experience.items;
        const initialCount = 3;
        const moreLabel = this.currentLang === 'es' ? 'Ver más experiencia' : 'See more experience';
        const lessLabel = this.currentLang === 'es' ? 'Ver menos' : 'See less';

        const renderItem = (exp) => `
            <article class="experience-article">
                <h3>${exp.position}</h3>
                <p class="company-name">${exp.company}</p>
                <p class="experience-date">${exp.period}</p>
                <p>${exp.responsibilities[0]}</p>
            </article>
        `;

        const visibleHtml = items.slice(0, initialCount).map(renderItem).join('');
        const hiddenHtml = items.length > initialCount
            ? `<div class="experience-hidden" style="display:none;">
                 ${items.slice(initialCount).map(renderItem).join('')}
               </div>
               <button class="expand-btn" id="expand-experience">${moreLabel}</button>`
            : '';

        container.innerHTML = visibleHtml + hiddenHtml;

        const btn = document.getElementById('expand-experience');
        if (btn) {
            btn.addEventListener('click', () => {
                const hidden = container.querySelector('.experience-hidden');
                const isVisible = hidden.style.display !== 'none';
                hidden.style.display = isVisible ? 'none' : 'block';
                btn.textContent = isVisible ? moreLabel : lessLabel;
            });
        }
    }

    renderSkills(data) {
        const container = document.getElementById('tech-grid');
        if (!container || !data.skills) return;

        // Show all categories except soft skills
        const relevantCategories = data.skills.categories.filter(cat =>
            !cat.title.includes('Soft Skills') &&
            !cat.title.includes('Habilidades Blandas')
        );

        container.innerHTML = relevantCategories.map(category => `
            <div class="tech-category">
                <h4>${category.title}</h4>
                <div class="tech-items-grid">
                    ${category.items.map(item => {
                        const iconHtml = item.icon_img
                            ? `<img class="tech-item-logo" src="${item.icon_img}" alt="${item.name}" />`
                            : `<i class="tech-item-fa ${item.icon || ''}"></i>`;
                        return `
                            <div class="tech-skill-item">
                                ${iconHtml}
                                <span>${item.name}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    }

    renderContactInfo(data) {
        const container = document.getElementById('contact-info');
        if (!container || !data.hero) return;

        const phoneLabel = this.currentLang === 'es' ? 'Teléfono' : 'Phone';
        const emailLabel = this.currentLang === 'es' ? 'Email' : 'Email';
        const locationLabel = this.currentLang === 'es' ? 'Ubicación' : 'Location';

        container.innerHTML = `
            <p>📞 <strong>${phoneLabel}:</strong> ${data.hero.contact.phone}</p>
            <p>📧 <strong>${emailLabel}:</strong> <a href="mailto:${data.hero.contact.email}">${data.hero.contact.email}</a></p>
            <p>📍 <strong>${locationLabel}:</strong> ${data.hero.contact.location}</p>
        `;
    }

    getTechDescription(categoryTitle) {
        const descriptions = {
            'es': {
                'Lenguajes de Programación': 'Para desarrollo de modelos predictivos y análisis de datos complejos.',
                'Frameworks para IA y Análisis de Datos': 'Para desarrollo de modelos de machine learning y deep learning.',
                'Software y Herramientas Técnicas': 'Herramientas especializadas para análisis petrofísico y caracterización de reservorios.'
            },
            'en': {
                'Programming Languages': 'For predictive model development and complex data analysis.',
                'ML / Data Analysis Frameworks': 'For machine learning and deep learning model development.',
                'Technical Tools': 'Specialized tools for petrophysical analysis and reservoir characterization.'
            }
        };

        const langDescriptions = descriptions[this.currentLang] || descriptions['es'];
        return langDescriptions[categoryTitle] || 'Advanced tools for petroleum engineering and AI applications.';
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    setupNavigationScrolling() {
        // Add click handlers for navigation links
        document.querySelectorAll('.sidebar-navigation a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Remove active class from all navigation links
                    document.querySelectorAll('.sidebar-navigation a').forEach(navLink => {
                        navLink.classList.remove('active');
                    });

                    // Add active class to clicked link
                    link.classList.add('active');

                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll spy functionality
        this.setupScrollSpy();
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.sidebar-navigation a');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = `#${entry.target.id}`;

                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));

                    // Add active class to corresponding link
                    const activeLink = document.querySelector(`.sidebar-navigation a[href="${targetId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    renderAbout(data) {
        const container = document.getElementById('about-highlights');
        if (!container || !data.about || !data.about.highlights) return;

        container.innerHTML = data.about.highlights.map(highlight => `
            <div class="highlight-item">
                <i class="icon ${highlight.icon}"></i>
                <h4>${highlight.title}</h4>
                <p>${highlight.description}</p>
            </div>
        `).join('');
    }

    renderEducation(data) {
        // Render education items
        const educationContainer = document.getElementById('education-container');
        if (educationContainer && data.education && data.education.items) {
            educationContainer.innerHTML = data.education.items.map(item => {
                const iconHtml = item.icon_img
                    ? `<img class="education-icon" src="${item.icon_img}" alt="${item.institution}" />`
                    : item.icon
                        ? `<i class="education-icon-fa ${item.icon}"></i>`
                        : '';
                return `
                    <div class="education-item">
                        <div class="education-header">
                            ${iconHtml}
                            <div>
                                <h4>${item.degree}</h4>
                                <div class="institution">${item.institution}</div>
                            </div>
                        </div>
                        <div class="details">${item.details}</div>
                    </div>
                `;
            }).join('');
        }

        // Render languages
        const languagesContainer = document.getElementById('languages-container');
        if (languagesContainer && data.education && data.education.languages) {
            languagesContainer.innerHTML = `
                <h4>${data.education.languages.title}</h4>
                <div class="languages-grid">
                    ${data.education.languages.items.map(lang => `
                        <div class="language-item">
                            <div class="language">${lang.language}</div>
                            <div class="level">${lang.level}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});