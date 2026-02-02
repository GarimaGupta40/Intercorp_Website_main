# INTERCORP Frontend Corporate Website

## Overview

INTERCORP is a corporate e-commerce website for a nutrition company that operates across three main verticals: Human Nutrition, Animal Nutrition, and Consumer Products. The application is a single-page React application with client-side routing, shopping cart functionality, user authentication, and an admin dashboard for product/order management.

The platform serves as both a marketing website (showcasing company services and expertise) and an e-commerce storefront where customers can browse products, add them to cart, create wishlists, and place orders.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **React 18** with TypeScript for type safety
- **Vite** as the build tool and development server
- **React Router v7** for client-side routing

### Styling
- **Tailwind CSS** for utility-first styling
- Custom responsive design with mobile-first approach
- **Framer Motion** for animations and page transitions

### State Management
- React Context API for global cart and wishlist state (`CartContext`)
- Local Storage for data persistence (cart, wishlist, products, orders, user session)

### Data Layer
- Currently uses JSON files and localStorage for data storage
- Product data stored in `src/data/products.json` with TypeScript helpers in `products.ts`
- Orders, users, and other entities defined in JSON files under `src/data/`
- Supabase JS client is installed but not actively integrated yet

### Authentication
- Simple localStorage-based authentication simulation
- Role-based access control (admin vs regular user)
- Admin users identified by email `admin@intercorp.in`
- Protected routes using component wrappers (`AdminRoute`)

### Routing Structure
- Public pages: Home, About, Contact, Shop, Product Details, Category pages
- Protected pages: Cart, Checkout, Orders, Account, Wishlist (require login)
- Admin pages: Dashboard (requires admin role)

### Component Architecture
- Reusable components in `src/components/` (Navbar, Footer, ProductCard, CTASection, SectionHeader)
- Page components in `src/pages/`
- Icons from **Lucide React** library

### Key Features
1. **E-commerce**: Product catalog, shopping cart, wishlist, checkout flow
2. **Order Management**: Order placement with COD payment, order history
3. **Admin Dashboard**: Product CRUD operations, order status management
4. **Marketing Pages**: Detailed pages for each business vertical (Poultry, Livestock, Aquaculture)

## External Dependencies

### NPM Packages
- `@supabase/supabase-js` - Database client (installed, not yet integrated)
- `framer-motion` - Animation library
- `lucide-react` - Icon library
- `react-router-dom` - Client-side routing

### Development Tools
- TypeScript with strict mode
- ESLint with React Hooks and React Refresh plugins
- PostCSS with Autoprefixer

### Configuration
- Vite dev server configured for Replit (host: 0.0.0.0, port: 5000, HMR on port 443)
- Tailwind configured to scan all source files

### Future Integration Points
- Supabase for backend database and authentication (client already installed)
- Payment gateway integration (currently only COD supported)
- Image upload for product management (currently uses static assets)