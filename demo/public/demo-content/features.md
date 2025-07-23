# Template Features

## Header Design Elements

### Animated Background
The header features a slowly panning panoramic background image with a 60-second animation cycle. This creates an engaging, dynamic feel while remaining subtle and professional.

### Brand Title Styling
Project names are automatically split and styled:
- First word: Clean white text
- Additional words: Gradient rainbow effect with drop shadow
- Fully responsive typography

### Interactive Elements
All header elements include smooth hover animations:
- Version badge with shimmer effect
- Action buttons with lift and glow
- Mobile menu with clean transitions

## Navigation System

### Sidebar Navigation
- Fixed position sidebar with backdrop blur
- Section-based organization
- Active state highlighting
- Mobile-responsive collapse

### Content Rendering
- Full markdown support with syntax highlighting
- Image click-to-expand functionality
- Responsive content layout
- Loading states and animations

## Configuration Options

### Branding Configuration
```typescript
branding: {
  theme: 'your-theme',
  tagline: 'Your project tagline',
  github: 'https://github.com/your/repo',
  npm: 'https://npmjs.com/package/your-package'
}
```

### Version Management
```typescript
version: {
  source: 'manual' | 'env' | 'package.json',
  value?: string,
  envVar?: string
}
```

### Section Organization
Each documentation section can be configured with:
- Unique identifier
- Display title and subtitle
- Markdown file source
- Custom content processing
