# Styling & Design

## Color Palette

The template uses a carefully crafted color system:

- **Primary**: `#2D3748` - Deep charcoal for text
- **Secondary**: `#4A5568` - Medium gray for secondary text
- **Accent**: `#667EEA` - Purple-blue for interactive elements
- **Accent Light**: `#764BA2` - Gradient complement
- **Background**: `#FAFAFA` - Clean off-white background

## Typography

### Font Stack
- **Primary**: Inter, system fonts for body text
- **Display**: SF Pro Display for headings
- **Mono**: SF Mono, Monaco for code

### Text Hierarchy
```css
/* Page titles */
font-size: 2.5rem;
font-weight: 700;
background: linear-gradient(...);

/* Section headings */
font-size: 2rem;
font-weight: 600;
color: var(--color-primary);
```

## Gradients & Effects

### Primary Gradient
```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Text Gradient
```css
--gradient-text: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
```

### Mystery Overlay
```css
--gradient-mystery: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(45, 55, 72, 0.8) 50%, rgba(0, 0, 0, 0.6) 100%);
```

## Animations

### Pan Landscape
The header background slowly pans from center 0% to center 15% over 60 seconds:

```css
@keyframes pan-landscape {
  0% { background-position: center 0%; }
  100% { background-position: center 15%; }
}
```

### Mystery Fade In
Content elements fade in with a subtle upward motion:

```css
@keyframes mystery-fade-in {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Version Badge Shimmer
The version badge includes a subtle shimmer effect on hover.

## Responsive Design

The template includes comprehensive responsive breakpoints:
- **Desktop**: Full sidebar and header layout
- **Tablet**: Collapsible sidebar with overlay
- **Mobile**: Hamburger menu with optimized spacing
