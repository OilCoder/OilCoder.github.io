/**
 * @file project.js
 * @brief Handles dynamic content loading, theme toggle, and language switching for project detail pages
 * @author Carlos Esquivel
 */

(function () {
  let currentLanguage = 'es';
  let projectData = {};

  /**
   * Initialize the project page.
   */
  async function init() {
    await loadProjectData();
    initializeTheme();
    initializeLanguageSelector();
    renderProjectContent();
  }

  /**
   * Load project data JSON files for both languages.
   * Reads the project slug from the data-project attribute on the body tag.
   */
  async function loadProjectData() {
    const slug = document.body.dataset.project || 'kansas';
    try {
      const [esRes, enRes] = await Promise.all([
        fetch(`../assets/data/project-${slug}-es.json`),
        fetch(`../assets/data/project-${slug}-en.json`)
      ]);
      projectData.es = await esRes.json();
      projectData.en = await enRes.json();
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  }

  /**
   * Initialize theme from localStorage and set up toggle.
   */
  function initializeTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeIcon) {
      themeIcon.textContent = saved === 'dark' ? '☀️' : '🌙';
    }

    if (themeToggle && themeIcon) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', next);
      });
    }
  }

  /**
   * Initialize the language button selector.
   */
  function initializeLanguageSelector() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang !== currentLanguage) {
          currentLanguage = lang;
          document.querySelectorAll('.lang-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.lang === lang);
          });
          renderProjectContent();
        }
      });
    });
  }

  /**
   * Localized label helper.
   * @param {string} es - Spanish text
   * @param {string} en - English text
   * @returns {string}
   */
  function t(es, en) {
    return currentLanguage === 'es' ? es : en;
  }

  /**
   * Render all project content from the loaded JSON data.
   */
  function renderProjectContent() {
    const data = projectData[currentLanguage];
    if (!data || !data.project) return;

    const p = data.project;

    // SEO meta tags
    setTextById('page-title', p.title);
    setAttrById('page-description', 'content', p.subtitle);
    setAttrById('og-title', 'content', p.title);
    setAttrById('og-description', 'content', p.subtitle);
    setAttrById('twitter-title', 'content', p.title);
    setAttrById('twitter-description', 'content', p.subtitle);

    // Navigation menu
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
      const links = navMenu.querySelectorAll('a');
      if (links[0]) links[0].textContent = t('Inicio', 'Home');
      if (links[1]) links[1].textContent = t('Proyectos', 'Projects');
    }

    // Hero section
    setTextById('back-text', t('Volver a Proyectos', 'Back to Projects'));
    setTextById('project-title', p.title);
    setTextById('project-subtitle', p.subtitle);
    setTextById('project-period', p.period);
    setTextById('project-category', p.category);
    setTextById('project-status', p.status);

    // Action buttons
    const githubLink = document.getElementById('github-link');
    if (githubLink) {
      githubLink.href = p.github_url || '#';
      githubLink.style.display = p.github_url ? '' : 'none';
      setTextById('github-text', t('Ver en GitHub', 'View on GitHub'));
    }

    const docsLink = document.getElementById('docs-link');
    if (docsLink) {
      docsLink.href = p.documentation_url || '#';
      docsLink.style.display = p.documentation_url ? '' : 'none';
      setTextById('docs-text', t('Documentación', 'Documentation'));
    }

    // Overview section
    setTextById('overview-title', t('Visión General', 'Overview'));
    setTextById('overview-subtitle', p.description);

    // Overview feature cards (dynamic)
    const overviewGrid = document.getElementById('overview-grid');
    if (overviewGrid && p.key_features) {
      overviewGrid.innerHTML = p.key_features.map(feat => `
        <div class="tech-card">
          <i class="tech-card-icon ${feat.icon}"></i>
          <h3 class="tech-card-title">${feat.title}</h3>
          <p class="tech-card-description">${feat.description}</p>
        </div>
      `).join('');
    }

    // Methodology
    setTextById('methodology-title', t('Metodología', 'Methodology'));
    const stepsCount = p.pipeline_steps ? p.pipeline_steps.length : 0;
    setTextById('methodology-subtitle', t(
      `Pipeline de ${stepsCount} pasos desde datos crudos hasta producción.`,
      `${stepsCount}-step pipeline from raw data to production.`
    ));

    const pipelineGrid = document.getElementById('pipeline-grid');
    if (pipelineGrid && p.pipeline_steps) {
      const steps = p.pipeline_steps;
      const rows = [];

      // Split steps into rows of 3
      for (let i = 0; i < steps.length; i += 3) {
        rows.push(steps.slice(i, i + 3));
      }

      let html = '';
      rows.forEach((row, rowIndex) => {
        const isReversed = rowIndex % 2 === 1;
        const displayRow = isReversed ? [...row].reverse() : row;
        const rowClass = isReversed ? 'pipeline-row pipeline-row-reverse' : 'pipeline-row';

        const arrowIcon = isReversed ? 'fa-arrow-left' : 'fa-arrow-right';

        html += `<div class="${rowClass}">`;
        displayRow.forEach((step, stepIndex) => {
          html += `
            <div class="pipeline-step">
              <div class="pipeline-step-number">${step.number}</div>
              <h4 class="pipeline-step-title">${step.title}</h4>
              <p class="pipeline-step-description">${step.description}</p>
            </div>
          `;
          // Add horizontal arrow between steps (not after the last one in the row)
          if (stepIndex < displayRow.length - 1) {
            html += `<div class="pipeline-h-arrow"><i class="fas ${arrowIcon}"></i></div>`;
          }
        });
        html += '</div>';

        // Add connector between rows
        if (rowIndex < rows.length - 1) {
          const side = isReversed ? 'left' : 'right';
          html += `
            <div class="pipeline-connector">
              <div class="pipeline-connector-arrow ${side}">
                <i class="fas fa-arrow-down"></i>
              </div>
            </div>
          `;
        }
      });

      pipelineGrid.innerHTML = html;
    }

    // Technology stack
    setTextById('tech-title', t('Stack Tecnológico', 'Technology Stack'));
    setTextById('tech-subtitle', t(
      'Tecnologías principales utilizadas en el proyecto.',
      'Core technologies used in the project.'
    ));

    const techGrid = document.getElementById('tech-grid');
    if (techGrid && p.technologies) {
      techGrid.innerHTML = p.technologies.map(tech => {
        const iconHtml = tech.icon_img
          ? `<img class="tech-item-logo" src="${tech.icon_img}" alt="${tech.name}" />`
          : `<i class="tech-item-icon ${tech.icon}"></i>`;
        return `
          <div class="tech-item">
            ${iconHtml}
            <div class="tech-item-info">
              <h4>${tech.name}</h4>
              <p>${tech.description}</p>
            </div>
          </div>
        `;
      }).join('');
    }

    // Results
    setTextById('results-title', t('Resultados', 'Results'));
    setTextById('results-subtitle', t('Métricas clave del proyecto.', 'Key project metrics.'));

    const resultsGrid = document.getElementById('results-grid');
    if (resultsGrid && p.results) {
      resultsGrid.innerHTML = p.results.map(result => `
        <div class="result-card">
          <span class="result-number">${result.number}</span>
          <h4 class="result-label">${result.label}</h4>
          <p class="result-description">${result.description}</p>
        </div>
      `).join('');
    }

    // Documentation (optional)
    const docsSection = document.getElementById('docs-section');
    if (docsSection) {
      if (p.documentation && p.documentation.length > 0) {
        docsSection.style.display = '';
        setTextById('docs-section-title', t('Documentación', 'Documentation'));
        setTextById('docs-section-subtitle', t(
          'Documentación técnica detallada del proyecto.',
          'Detailed technical documentation of the project.'
        ));

        const docsGrid = document.getElementById('docs-grid');
        if (docsGrid) {
          docsGrid.innerHTML = p.documentation.map(doc => `
            <a href="${doc.url}" target="_blank" class="doc-link">
              <i class="doc-icon ${doc.icon}"></i>
              <div class="doc-info">
                <h4>${doc.title}</h4>
                <p>${doc.description}</p>
              </div>
            </a>
          `).join('');
        }
      } else {
        docsSection.style.display = 'none';
      }
    }

    // Footer
    setTextById('footer-text', t(
      '© 2025 Carlos Andrés Esquivel Plazas. Todos los derechos reservados.',
      '© 2025 Carlos Andrés Esquivel Plazas. All rights reserved.'
    ));

    // CV link
    const cvLink = document.querySelector('.btn-nav-cv');
    if (cvLink) {
      cvLink.href = t('../cv/carlos_esquivel_cv_es.pdf', '../cv/carlos_esquivel_cv_en.pdf');
    }
  }

  /**
   * Set text content of an element by ID.
   * @param {string} id - Element ID
   * @param {string} text - Text content to set
   */
  function setTextById(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  /**
   * Set an attribute on an element by ID.
   * @param {string} id - Element ID
   * @param {string} attr - Attribute name
   * @param {string} value - Attribute value
   */
  function setAttrById(id, attr, value) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, value);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
