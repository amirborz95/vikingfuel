# Viking Fuel - Premium Supplements E-commerce Site

A modern Next.js 15 application built with TypeScript and Tailwind CSS for selling premium supplements.

## 🚀 Features

- **Next.js 15** - Latest version with improved performance and features
- **React 19** - Latest React version with enhanced capabilities
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **E-commerce functionality** - Shopping cart, product catalog, checkout
- **Responsive design** - Mobile-first approach
- **SEO optimized** - Server-side rendering and meta tags

## 🛠️ Development Workflow

### For Development (Next.js)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run export       # Generate static HTML files
```

### For Single HTML File Deployment (Hostup)
```bash
npm run deploy       # Export + Update single index.html + deploy package
# OR manually:
npm run export       # Generate static files
npm run update-html  # Update single index.html + deploy package
```

**After making changes:**
1. Make your changes in the Next.js code
2. Run `npm run deploy`
3. Upload the contents of the `deploy/` folder to Hostup

> The `deploy/` folder includes `index.html`, `_next/`, `assets/`, and all exported static files needed for the live site.

## 📁 Project Structure

```
vikingfuel/
├── index.html           # Single HTML file for Hostup deployment
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable UI components
│   └── styles/         # Global styles and configurations
├── out/                # Generated static files (after export)
├── update-html.js      # Script to update single HTML file
├── package.json        # Project dependencies and scripts
└── README.md          # This file
```

## 🚀 Deployment to Hostup

### Option 1: Single HTML File (Recommended)
1. **Develop in Next.js** using `npm run dev`
2. **Generate single HTML** with `npm run deploy`
3. **Upload `index.html`** to Hostup's public directory
4. **Your domain `vikingfuel.se` works immediately**

### Option 2: Full Static Export
1. **Upload entire `out/` folder** to Hostup
2. **Hostup serves all static files**

## 🔧 Available Scripts

- `npm run dev` - Start development server (http://localhost:4028)
- `npm run build` - Build for production
- `npm run export` - Generate static HTML export
- `npm run update-html` - Update single index.html from export
- `npm run deploy` - Complete workflow: export + update HTML
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checking

## 📝 Making Changes

**Workflow for updating your live site:**

1. **Make changes** in your Next.js code (edit files in `src/`)
2. **Test locally** with `npm run dev`
3. **Generate updated HTML** with `npm run deploy`
4. **Upload new `index.html`** to Hostup
5. **Site is live!** 🎉

This keeps your development environment powerful while deploying a simple, fast single HTML file.