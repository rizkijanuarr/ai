# 🎨 FRONTEND DOCUMENTATION

## 📋 Overview

Frontend simple dan modern untuk AI Website Classifier dengan **reusable components** dan **clean architecture**.

---

## 🏗️ Struktur Frontend

```
frontend/
├── static/
│   ├── style.css          # Reusable CSS components
│   └── app.js             # JavaScript logic
└── templates/
    └── index.html         # Main HTML template
```

---

## 🎨 Reusable Components

### **1. Card Component**

```html
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Title</h2>
        <p class="card-subtitle">Subtitle</p>
    </div>
    <div class="card-body">
        <!-- Content -->
    </div>
    <div class="card-footer">
        <!-- Footer -->
    </div>
</div>
```

**CSS Classes:**

- `.card` - Main container
- `.card-header` - Header section
- `.card-title` - Title text
- `.card-subtitle` - Subtitle text
- `.card-body` - Body content
- `.card-footer` - Footer section

---

### **2. Button Component**

```html
<!-- Primary Button -->
<button class="btn btn-primary">Primary</button>

<!-- Success Button -->
<button class="btn btn-success">Success</button>

<!-- Danger Button -->
<button class="btn btn-danger">Danger</button>

<!-- Outline Button -->
<button class="btn btn-outline">Outline</button>

<!-- Disabled Button -->
<button class="btn btn-primary" disabled>Disabled</button>
```

**CSS Classes:**

- `.btn` - Base button
- `.btn-primary` - Primary style (gradient purple)
- `.btn-success` - Success style (gradient green)
- `.btn-danger` - Danger style (gradient red)
- `.btn-outline` - Outline style (transparent with border)

---

### **3. Input Component**

```html
<div class="input-group">
    <label class="input-label" for="input1">Label</label>
    <input 
        type="text" 
        id="input1" 
        class="input-field" 
        placeholder="Placeholder"
    >
</div>
```

**CSS Classes:**

- `.input-group` - Container
- `.input-label` - Label text
- `.input-field` - Input field

---

### **4. Badge Component**

```html
<!-- Success Badge -->
<span class="badge badge-success">✅ Legal</span>

<!-- Danger Badge -->
<span class="badge badge-danger">❌ Ilegal</span>

<!-- Warning Badge -->
<span class="badge badge-warning">⚠️ Warning</span>
```

**JavaScript Function:**

```javascript
createBadge('Legal', 'success')
// Returns: <span class="badge badge-success">✅ Legal</span>
```

---

### **5. Loading Component**

```html
<span class="loading"></span>
```

**Usage in Button:**

```html
<button class="btn btn-primary">
    <span class="loading"></span> Loading...
</button>
```

---

### **6. Alert Component**

```html
<!-- Success Alert -->
<div class="alert alert-success">
    <span>✅</span>
    <span>Success message</span>
</div>

<!-- Danger Alert -->
<div class="alert alert-danger">
    <span>❌</span>
    <span>Error message</span>
</div>

<!-- Warning Alert -->
<div class="alert alert-warning">
    <span>⚠️</span>
    <span>Warning message</span>
</div>
```

**JavaScript Function:**

```javascript
createAlert('Success!', 'success')
showAlert('Error occurred', 'danger')
```

---

## 🎨 Design System

### **Colors**

```css
--primary: #6366f1        /* Purple */
--primary-dark: #4f46e5   /* Dark Purple */
--success: #10b981        /* Green */
--danger: #ef4444         /* Red */
--warning: #f59e0b        /* Orange */
--dark: #1f2937           /* Dark Gray */
--light: #f9fafb          /* Light Gray */
--gray: #6b7280           /* Gray */
```

### **Gradients**

```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
--gradient-danger: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
```

### **Spacing**

```css
--spacing-xs: 0.5rem   /* 8px */
--spacing-sm: 1rem     /* 16px */
--spacing-md: 1.5rem   /* 24px */
--spacing-lg: 2rem     /* 32px */
--spacing-xl: 3rem     /* 48px */
```

### **Border Radius**

```css
--radius-sm: 0.5rem    /* 8px */
--radius-md: 1rem      /* 16px */
--radius-lg: 1.5rem    /* 24px */
```

### **Shadows**

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

---

## 📱 Responsive Design

**Breakpoints:**

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Optimizations:**

- Smaller font sizes
- Reduced padding
- Single column layout
- Touch-friendly buttons (min 44px height)

---

## 🔧 JavaScript Functions

### **Component Functions**

```javascript
// Create Alert
createAlert(message, type)
// Example: createAlert('Success!', 'success')

// Show Alert
showAlert(message, type)
// Example: showAlert('Error occurred', 'danger')

// Clear Alert
clearAlert()

// Create Badge
createBadge(label, type)
// Example: createBadge('Legal', 'success')

// Set Loading State
setLoading(isLoading)
// Example: setLoading(true)

// Show/Hide Result
showResult()
hideResult()

// Reset Form
resetForm()
```

### **API Functions**

```javascript
// Analyze URL
await analyzeUrl(url)
// Example: await analyzeUrl('https://example.com')

// Display Result
displayResult(data)
```

### **Utility Functions**

```javascript
// Format Probability
formatProbability(0.85)
// Returns: "85.0%"

// Truncate URL
truncateUrl('https://very-long-url.com/path', 40)
// Returns: "https://very-long-url.com/path..."

// Truncate Text
truncateText('Long text here...', 200)

// Validate URL
isValidUrl('https://example.com')
// Returns: true/false
```

---

## 🚀 Usage

### **Access Frontend**

```
http://localhost:5002/
```

### **API Endpoint**

```
POST http://localhost:5002/api/v1/scrape
```

### **Swagger UI**

```
http://localhost:5002/apidocs
```

---

## 🎯 Features

✅ **Modern UI** - Glassmorphism, gradients, animations  
✅ **Reusable Components** - Modular & maintainable  
✅ **Responsive** - Mobile-friendly design  
✅ **Form Validation** - URL validation  
✅ **Loading States** - Visual feedback  
✅ **Error Handling** - User-friendly error messages  
✅ **Auto-hide Alerts** - Alerts disappear after 5 seconds  
✅ **Smooth Animations** - Transitions & hover effects  

---

## 📊 Component Reusability

```
Card Component
├── Used in: Main form, Result section, Info section
├── Variants: With header, with footer, simple
└── Reusable: ✅

Button Component
├── Used in: Submit button, Reset button
├── Variants: Primary, Success, Danger, Outline
└── Reusable: ✅

Input Component
├── Used in: URL input
├── Variants: Text, URL, Email
└── Reusable: ✅

Badge Component
├── Used in: Status display
├── Variants: Success, Danger, Warning
└── Reusable: ✅

Alert Component
├── Used in: Error/Success messages
├── Variants: Success, Danger, Warning
└── Reusable: ✅

Loading Component
├── Used in: Button loading state
├── Variants: Inline spinner
└── Reusable: ✅
```

---

## 🎨 Customization

### **Change Primary Color**

```css
:root {
  --primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #color1, #color2);
}
```

### **Change Font**

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

```css
body {
  font-family: 'Your Font', sans-serif;
}
```

### **Add New Component**

1. Add CSS in `style.css`
2. Add HTML structure in `index.html`
3. Add JavaScript function in `app.js` (if needed)

---

## 🐛 Troubleshooting

**Problem: Styles not loading**

```
Solution: Clear browser cache (Ctrl+Shift+R)
```

**Problem: API not working**

```
Solution: Check if backend server is running on port 5002
```

**Problem: CORS error**

```
Solution: Backend already has CORS enabled via flask-cors
```

---

## 📈 Future Improvements

- [ ] Dark mode toggle
- [ ] Multiple URL batch analysis
- [ ] Export results to CSV/PDF
- [ ] History of analyzed URLs
- [ ] Real-time analysis progress
- [ ] Charts/graphs for statistics

---

**Last Updated**: 2025-12-14  
**Version**: 1.0.0  
**Author**: Tugas Akhir Team
