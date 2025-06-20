# Projects Directory

This directory contains detailed project pages for the OilCoder portfolio website.

## Structure

```
projects/
├── README.md                           # This documentation
├── petrophysical-analysis.html         # Dynamic multilingual Kansas project page
└── [future-project-pages]              # Additional project pages
```

## Project Pages

### Kansas Project - Petrophysical Analysis with AI

**Dynamic Multilingual Page**: `petrophysical-analysis.html`

Complete project showcase for the Neural Network Pipeline for Petrophysical Analysis, featuring:

- **Project Overview**: Technical summary and key achievements
- **8-Step Pipeline Methodology**: Detailed workflow from raw data to production models
- **Technology Stack**: Python, TensorFlow, RAPIDS, Docker, CUDA, Optuna, etc.
- **Results & Metrics**: Quantifiable project outcomes
- **Technical Documentation**: Links to all 7 technical documents in GitHub
- **Key Features**: Advanced capabilities and functionalities

#### Technical Features

- **Responsive Design**: Mobile-optimized layout
- **SEO Optimization**: Meta tags, Open Graph, Twitter Cards
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Theme Support**: Light/dark mode toggle
- **Dynamic Language Switching**: Real-time Spanish/English content loading
- **Interactive Elements**: Smooth scrolling, loading animations
- **External Links**: Direct access to GitHub repository and documentation

#### Data Sources

Project content is dynamically loaded from JSON files:
- `../assets/data/project-kansas.json` (Spanish content)
- `../assets/data/project-kansas-en.json` (English content)

The page automatically detects user language preference and loads appropriate content without page reload.

## Development Guidelines

### Adding New Projects

1. **Create HTML Pages**: Follow the naming convention `project-name.html` (Spanish) and `project-name-en.html` (English)
2. **Create Data Files**: Add corresponding JSON files in `../assets/data/`
3. **Update Navigation**: Add project links to main portfolio in `content-es.json` and `content-en.json`
4. **Follow Standards**: Maintain consistency with existing project page structure

### Content Structure

Each project page should include:
- Hero section with project title, description, and metadata
- Project overview with key highlights
- Methodology or approach section
- Technology stack
- Results and achievements
- Documentation links
- Key features

### Styling

Project pages use the main stylesheet (`../assets/css/style.css`) with specific classes:
- `.project-hero` - Hero section styling
- `.project-section` - Main content sections
- `.tech-overview` - Technology highlight cards
- `.methodology-pipeline` - Step-by-step process visualization
- `.results-grid` - Achievement metrics display
- `.docs-grid` - Documentation links layout

### Multilingual Support

- Maintain parallel Spanish/English versions
- Use consistent naming conventions
- Update both language versions simultaneously
- Ensure proper language attributes in HTML
- Link between language versions in navigation

## File Naming Conventions

- **HTML Files**: `project-name.html` (Spanish), `project-name-en.html` (English)
- **Data Files**: `project-name.json` (Spanish), `project-name-en.json` (English)
- **Images**: Store in `../assets/images/projects/` with descriptive names

## Quality Assurance

Before publishing new project pages:
1. **Validate HTML**: Use htmlhint for syntax validation
2. **Test Responsiveness**: Verify mobile and desktop layouts
3. **Check Links**: Ensure all external links work correctly
4. **Accessibility**: Test keyboard navigation and screen reader compatibility
5. **Performance**: Optimize images and minimize HTTP requests
6. **SEO**: Verify meta tags and social sharing previews

## Integration with Main Portfolio

Project pages are integrated with the main portfolio through:
- Navigation links in header
- Project cards in main portfolio section
- Language switching functionality
- Consistent theme and styling
- Shared JavaScript functionality

## Future Enhancements

Planned improvements for project pages:
- Dynamic content loading from JSON
- Project filtering and search
- Interactive project galleries
- Performance metrics dashboard
- Automated documentation generation 