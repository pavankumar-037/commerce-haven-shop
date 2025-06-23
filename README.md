
# StyleHub - Modern Fashion E-commerce Platform

A modern, responsive e-commerce platform built with React, TypeScript, and Tailwind CSS, featuring a comprehensive admin panel and user-friendly shopping experience.

## 🚀 Features

### User Features
- **Modern Shopping Interface**: Clean, Gen-Z friendly design with gradient backgrounds
- **Product Catalog**: Browse products by categories (Men, Women, Kids, Accessories)
- **Advanced Search**: Filter products by category and search by keywords
- **Product Details**: Comprehensive product pages with images, reviews, and specifications
- **Shopping Cart**: Add products to cart with quantity management
- **Combo Offers**: Special bundle deals and promotional offers
- **Order Tracking**: Track your orders in real-time
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Optimized for all devices

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **Offer Management**: Create and manage combo offers and promotions
- **Coupon System**: Create discount coupons and promotional codes
- **Customer Messages**: Handle customer inquiries and support
- **Analytics Dashboard**: Track sales, orders, and customer data
- **Settings Management**: Configure site settings and preferences

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI, Radix UI
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Hooks, Context API
- **Charts**: Recharts
- **Backend**: Supabase (Database, Authentication, Storage)
- **Build Tool**: Vite
- **Package Manager**: Bun

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stylehub
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials and other environment variables.

4. **Start the development server**
   ```bash
   bun run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/UI components
│   ├── AdminSidebar.tsx
│   ├── ComboOffers.tsx
│   ├── ProductForm.tsx
│   └── ReviewSystem.tsx
├── hooks/              # Custom React hooks
│   ├── useCart.ts
│   ├── useCoupons.ts
│   └── use-toast.ts
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Auth.tsx
│   └── admin/          # Admin pages
├── integrations/       # External service integrations
│   └── supabase/
├── lib/               # Utility functions
└── styles/            # CSS and styling files
```

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful purple-to-pink gradients throughout the interface
- **Smooth Animations**: Fade-in effects, hover animations, and transitions
- **Modern Cards**: Glass-morphism effects and shadow depth
- **Responsive Grid**: Adaptive product grids for all screen sizes
- **Custom Carousel**: Auto-sliding hero banner with manual controls
- **Interactive Elements**: Hover effects and button animations

## 🛒 Key Functionality

### Shopping Experience
- Product browsing with category filters
- Advanced search functionality
- Product detail pages with image galleries
- Shopping cart with quantity management
- Secure checkout process
- Order tracking and history

### Admin Panel
- Comprehensive dashboard with analytics
- Product management (CRUD operations)
- Order management and fulfillment
- Customer communication system
- Promotional tools (offers, coupons)
- System settings and configuration

## 🚀 Deployment

### Build for Production
```bash
bun run build
```

### Preview Production Build
```bash
bun run preview
```

### Deploy to Vercel/Netlify
The built files in the `dist` directory can be deployed to any static hosting service.

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Admin Access
Default admin credentials (change in production):
- Username: admin
- Password: admin123

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Mobile phones (320px and up)
- Tablets (768px and up)
- Desktop (1024px and up)
- Large screens (1280px and up)

## 🎯 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Social media login
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

---

**StyleHub** - Your Modern Fashion Destination 🛍️
