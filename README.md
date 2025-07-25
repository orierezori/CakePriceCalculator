# Cake Price Calculator

A modular, mobile-optimized web application for calculating custom cake and cupcake prices with order management features.

## 🏗️ Project Structure

### CSS Architecture
```
css/
├── base.css          # Variables, reset, typography, basic layout
├── components.css    # Form elements, inputs, checkboxes
├── layout.css        # Page layout, containers, sections
├── buttons.css       # Button styles and interactions
├── mobile.css        # Mobile-specific responsive styles
└── themes.css        # Dark mode, high contrast, accessibility
```

### JavaScript Architecture
```
js/
├── config.js         # Constants, pricing, API endpoints, element IDs
├── calculator.js     # Price calculation logic and business rules
├── form-handler.js   # Form data management and DOM caching
├── ui-controller.js  # UI visibility and interaction logic
├── summary.js        # Order summary generation (standard & AI)
└── main.js          # Application initialization and event binding
```

## 🚀 Features

### Core Functionality
- **Dynamic pricing calculation** for cakes and cupcakes
- **Responsive form** with conditional field visibility
- **Mobile-optimized UI** with touch-friendly interactions
- **Order summary generation** (standard and AI-powered)
- **Calendar integration** for pickup scheduling
- **Task management** integration with Google Tasks

### Technical Features
- **Modular ES6 architecture** with clear separation of concerns
- **Mobile-first responsive design** with comprehensive media queries
- **Accessibility support** (dark mode, high contrast, reduced motion)
- **Performance optimized** with DOM element caching
- **Error handling** for API calls and user interactions

## 🎨 Design System

### Color Palette
- Primary: `#7c3a46` (Warm brown)
- Background: `#fdf7f0` (Cream)
- Form backgrounds: `#fdeaf0` (Light pink)
- Accent: `#FFBFA0` (Peachy orange)

### Typography
- Font: Arial, sans-serif
- Base size: 16px
- Mobile optimized with larger touch targets

### Spacing
- Base unit: 1rem (16px)
- Consistent spacing scale using CSS custom properties

## 📱 Mobile Optimization

### Touch Targets
- Minimum 48px height for all interactive elements
- Larger checkboxes (24px) for easy selection
- Enhanced button padding for finger-friendly interaction

### Responsive Breakpoints
- `375px`: Extra small phones (portrait)
- `480px`: Small screens optimization
- `500px height`: Landscape phones

### Performance
- Touch-optimized scrolling with `-webkit-overflow-scrolling: touch`
- Reduced motion support for accessibility
- Optimized form interactions with `touch-action: manipulation`

## 🔧 Development

### Prerequisites
- Modern browser with ES6 module support
- Local server for development (due to CORS restrictions with modules)

### File Dependencies
The application uses ES6 modules with the following dependency chain:
```
main.js
├── form-handler.js → config.js
├── ui-controller.js → config.js, form-handler.js
├── calculator.js → config.js
└── summary.js → config.js
```

### Adding New Features
1. **New pricing rules**: Update `config.js` and `calculator.js`
2. **New form fields**: Add to `form-handler.js` and `ui-controller.js`
3. **New UI interactions**: Extend `ui-controller.js`
4. **New summary formats**: Extend `summary.js`

## 🎯 Benefits of This Architecture

### Maintainability
- **Single responsibility** - Each file has one clear purpose
- **Easy debugging** - Issues are isolated to specific modules
- **Clean interfaces** - Clear data flow between components

### Scalability
- **Modular expansion** - New features can be added without affecting existing code
- **Team collaboration** - Multiple developers can work on different modules
- **Code reusability** - Components can be easily extracted and reused

### Performance
- **Cached DOM elements** - Reduced DOM queries for better performance
- **Efficient calculations** - Separated business logic for optimization
- **Progressive loading** - CSS files can be loaded independently

### Developer Experience
- **Clear structure** - Easy to understand and navigate
- **Separation of concerns** - Styling, logic, and data are cleanly separated
- **Modern JavaScript** - ES6 classes and modules for better organization