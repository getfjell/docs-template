# Project Theme Examples

This directory contains examples of how each Fjell project should define its own theme CSS file in their documentation setup.

## How It Works

Instead of the template containing knowledge about each project's branding, each project should:

1. **Create a theme CSS file** in their `docs/` directory
2. **Import it in their documentation setup**
3. **Configure the theme name** in their docs configuration

## Example Setup

### 1. Create Theme File
Create `docs/theme.css` in your project:

```css
/* Your Project Theme */
.brand-your-project {
  --color-accent: #667EEA;
  --color-accent-light: #764BA2;
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-text: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #9f7aea 100%);
}
```

### 2. Import in HTML
Add to your `docs/index.html`:

```html
<link rel="stylesheet" href="/theme.css">
```

### 3. Configure Theme
Set in your docs configuration:

```typescript
branding: {
  theme: 'your-project', // Matches .brand-your-project
  tagline: 'Your project tagline',
  backgroundImage: '/your-background.jpg'
}
```

## Available Variables

Your theme can override these CSS custom properties:

- `--color-accent`: Primary accent color for interactive elements
- `--color-accent-light`: Lighter variant of accent color
- `--gradient-primary`: Gradient used for buttons and badges
- `--gradient-text`: Gradient used for headings and text highlights

## Benefits

- **Decoupled**: Template doesn't contain project-specific knowledge
- **Flexible**: Each project controls its own branding
- **Maintainable**: Theme changes happen in the project, not the template
- **Consistent**: All projects use the same CSS variable system

## Migration

For existing projects using the old theme system, simply:

1. Copy your theme from the examples in this directory
2. Add it to your project's docs
3. Remove dependency on template themes
