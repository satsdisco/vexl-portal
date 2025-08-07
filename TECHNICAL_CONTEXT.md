# Technical Context & Continuation Guide
*For continuing development of Vexl Ambassador Portal*

## 🔧 Current Technical Stack

```json
{
  "framework": "Next.js 15.4.6",
  "ui": "React 18",
  "styling": "Tailwind CSS + Custom CSS",
  "animations": "Framer Motion",
  "backend": "Strapi 5.21.0 (on Railway, currently disconnected)",
  "deployment": "Vercel",
  "typescript": "5.x",
  "pwa": "Custom service worker"
}
```

## 🏗️ Architecture Decisions

### Frontend Architecture
- **Pages Router:** Using Next.js app directory
- **Client Components:** Most components are 'use client' for interactivity
- **State Management:** localStorage + React hooks (no Redux/Zustand)
- **Data Fetching:** Currently hardcoded, prepared for API integration

### Component Philosophy
- **Composition over Configuration:** Small, reusable components
- **Inline Editing:** Click-to-edit pattern in builder
- **Full-Screen Sections:** Not slides, but adaptive viewport sections

## 📦 Key Components Reference

### 1. Presentation Builder (`/app/admin/builder/page.tsx`)
```typescript
// Current section templates available:
const sectionTemplates = {
  trustComparison,    // Trust vs ratings comparison
  privacySection,     // Privacy explanation
  howItWorks,         // 4-step process
  networkVisualization, // Interactive network
  phoneMockup,        // Phone with screenshots
  statsSection        // Metrics display
}

// To add new section:
// 1. Add to sectionTemplates object
// 2. Add rendering logic in renderSectionPreview()
// 3. Create interactive component if needed
```

### 2. Phone Mockup Component
```typescript
// Usage:
<PolishedPhoneMockup
  screenshots={[]}        // Array of image URLs/base64
  title="Title"          
  description="Desc"
  showNotification={true}
  notificationText="New offer"
  animate={true}
/>
```

### 3. Network Visualization
```typescript
// Interactive canvas-based network
// Uses physics simulation for node movement
// Responds to mouse interaction
// Customizable via props:
<NetworkVisualization 
  interactive={true}
  showLabels={false}
/>
```

## 🔌 API Endpoints (Strapi - Currently Disconnected)

```javascript
// Backend is configured but not working
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

// Prepared endpoints:
POST   /api/auth/local          // Login
POST   /api/auth/local/register // Register
GET    /api/workshops           // Get workshops
POST   /api/workshops           // Create workshop
PUT    /api/workshops/:id       // Update workshop
DELETE /api/workshops/:id       // Delete workshop
```

## 💾 Data Storage Strategy

### Current (Temporary)
```javascript
// Using localStorage for:
- User token: localStorage.getItem('token')
- User stats: localStorage.getItem('userStats')
- Presentations: localStorage.getItem('vexl-presentations')
- User name: localStorage.getItem('userName')
```

### Target Architecture
```javascript
// Should migrate to:
- PostgreSQL via Strapi for user data
- Strapi Media Library for images
- Redis for session management
- CDN for static assets
```

## 🎨 Styling System

### Brand Variables (`/lib/vexl-brand-manual.ts`)
```typescript
vexlBrand.colors.primary.yellow  // #FCEE0A
vexlBrand.colors.gray[900]       // Dark backgrounds
vexlBrand.spacing.md             // 1.5rem
vexlBrand.animation.duration.base // 300ms
```

### Component Styling Pattern
```tsx
// Inline styles for brand colors
style={{ 
  backgroundColor: vexlBrand.colors.primary.yellow,
  borderColor: vexlBrand.colors.gray[800]
}}

// Tailwind for utilities
className="rounded-lg p-6 hover:scale-105"
```

## 🚨 Critical Issues to Fix

### 1. Strapi Connection
```bash
# Current error: CORS/403 on registration
# Fix needed in:
# 1. backend/config/middlewares.js
# 2. backend/src/extensions/users-permissions/strapi-server.js

# Temporary workaround:
# Using demo@vexl.it bypass in /app/login/page.tsx
```

### 2. Image Storage
```javascript
// Currently base64 in localStorage (bad for performance)
// Need to implement:
// - Upload to Strapi/S3
// - Return URLs instead of base64
// - Add image optimization
```

### 3. Build Warnings
```bash
# Non-critical but should fix:
# Move themeColor from metadata to viewport export
# In /app/layout.tsx
```

## 🛠️ Development Workflow

### Starting Development
```bash
# 1. Start dev server
npm run dev

# 2. Access at
http://localhost:3000

# 3. Login with
email: demo@vexl.it
password: anything

# 4. Admin dashboard
http://localhost:3000/admin/dashboard

# 5. Presentation builder
http://localhost:3000/admin/builder
```

### Adding New Features

#### New Section Template
1. Add template to `/app/admin/builder/page.tsx`
2. Create component in `/components/interactive/`
3. Add to `renderSectionPreview()` switch
4. Update `sectionTemplates` object

#### New Page
1. Create in `/app/[page-name]/page.tsx`
2. Add navigation in relevant components
3. Apply consistent header/layout
4. Use `vexlBrand` for styling

#### New Interactive Component
1. Create in `/components/interactive/`
2. Use Framer Motion for animations
3. Make responsive with Tailwind
4. Export for use in builder

## 📝 Code Patterns to Follow

### Page Component
```typescript
'use client';

import { vexlBrand } from '@/lib/vexl-brand-manual';
import PolishedLoader from '@/components/PolishedLoader';

export default function PageName() {
  const [isLoading, setIsLoading] = useState(true);
  
  if (isLoading) {
    return <PolishedLoader text="Loading..." fullScreen />;
  }
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b" style={{ 
        borderColor: vexlBrand.colors.gray[800] 
      }}>
        {/* ... */}
      </header>
      
      {/* Content */}
      <main className="p-6">
        {/* ... */}
      </main>
    </div>
  );
}
```

### Interactive Component
```typescript
'use client';

import { motion } from 'framer-motion';
import { vexlBrand } from '@/lib/vexl-brand-manual';

interface ComponentProps {
  // Props
}

export default function Component({ ...props }: ComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="..."
    >
      {/* Content */}
    </motion.div>
  );
}
```

## 🚀 Deployment Process

### Automatic (Recommended)
```bash
# Push to main branch
git add .
git commit -m "feat: description"
git push origin main
# Vercel auto-deploys
```

### Manual
```bash
# Build locally
npm run build

# Deploy to Vercel
vercel --prod

# Check deployment
https://vexl-portal-[hash].vercel.app
```

## 🔑 Environment Variables

### Required for Full Functionality
```env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi.railway.app
NEXT_PUBLIC_STRAPI_TOKEN=your-token
```

### Current Status
- Strapi URL points to Railway deployment
- Authentication is bypassed with demo login
- No environment secrets needed for current functionality

## 📋 Testing Checklist

### Before Deployment
- [ ] Test demo login
- [ ] Create presentation in builder
- [ ] View presentation
- [ ] Check mobile responsiveness
- [ ] Test PWA installation
- [ ] Verify offline page works
- [ ] Check all navigation links

### Browser Testing
- [ ] Chrome/Edge (PWA install)
- [ ] Safari (iOS compatibility)
- [ ] Firefox (general compatibility)
- [ ] Mobile browsers

## 🎯 Immediate Next Tasks

1. **Fix Strapi Connection**
   - Debug CORS configuration
   - Test API endpoints
   - Implement proper auth flow

2. **Complete Interactive Components**
   - Economics calculator
   - Quiz component
   - Clubs showcase
   - Vision map

3. **Polish Existing Features**
   - Fix text overflow in presentations
   - Improve mobile layouts
   - Add keyboard shortcuts
   - Implement auto-save

4. **Add Missing Functionality**
   - Export presentations
   - Share presentations
   - Duplicate presentations
   - Presentation templates

## 🔗 Important Links

- **Live App:** https://vexl-portal-4dnt21hfj-satsdiscos-projects.vercel.app
- **GitHub:** https://github.com/satsdisco/vexl-portal
- **Brand Manual:** https://satoshilabs.visualbook.pro/en/vexl
- **Vercel Dashboard:** https://vercel.com/satsdiscos-projects/vexl-portal
- **Railway (Strapi):** [Check your Railway dashboard]

---

*Use this technical context to continue development. All code patterns and architecture decisions are documented here for consistency.*