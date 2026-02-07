# Somnath Darshan Flow - Temple Management System

A comprehensive digital solution for managing temple operations, including crowd monitoring, darshan (temple visit) queue management, advanced analytics, and multi-language support. Built with React and modern web technologies.

## Project Overview

Divya Setu (Divine Bridge) is an intelligent temple management system designed to enhance the visitor experience and streamline administrative operations. The system provides real-time crowd monitoring, queue management, emergency alerts, emergency response protocols, and detailed analytics for temple operations.

### Key Features

- **Real-time Crowd Dashboard**: Monitor visitor counts and crowd density in real-time
- **Queue Management System**: Efficient darshan queue management with estimated wait times
- **Detailed Booking Form**: Streamlined visitor registration and booking process
- **Emergency Alert System**: Quick emergency response protocols for critical situations
- **Temple Map Navigation**: Interactive maps for visitor guidance
- **Analytics Dashboard**: Comprehensive visitor and operational analytics
- **Multi-Language Support**: Support for 7 languages (English, Hindi, Gujarati, Marathi, Tamil, Telugu, Bengali)
- **Admin Panel**: Secure administration dashboard for temple staff
- **Mobile Responsive**: Fully responsive design for all device sizes

## Technology Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **JavaScript/JSX** - Dynamic and flexible coding
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful icon library

### Backend & Database

- **Supabase** - PostgreSQL database and authentication
- **React Query** - Server state management

### Development Tools

- **ESLint** - Code quality and linting
- **Vite SWC** - Fast JavaScript compilation
- **PostCSS** - CSS transformation
- **npm** - Node package manager

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/avi4rag/Temple-Management.git

# Step 2: Navigate to the project directory.
cd Temple-Management

# Step 3: Install the necessary dependencies.
npm ci

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

The application will start on `http://localhost:8080` by default.

### Environment Configuration

Copy `.env.example` to create a `.env.local` file in the root directory:

```sh
cp .env.example .env.local
```

Configure your environment variables as needed:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── pages/              # Main page components
│   ├── Index.jsx       # Home page
│   ├── AdminLogin.jsx  # Admin login page
│   ├── AdminDashboard.jsx
│   ├── CrowdMonitor.jsx
│   ├── AnalyticsDashboard.jsx
│   └── NotFound.jsx
├── components/         # Reusable components
│   ├── Navigation.jsx  # Main navigation bar
│   ├── HeroSection.jsx
│   ├── CrowdDashboard.jsx
│   ├── QueueSystem.jsx
│   ├── DetailedBookingForm.jsx
│   ├── EmergencyAlert.jsx
│   ├── TempleMap.jsx
│   ├── Analytics.jsx
│   ├── ServicesInfo.jsx
│   ├── Footer.jsx
│   └── ui/            # UI component library
├── contexts/          # React Context for state management
│   └── LanguageContext.jsx
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
└── integrations/      # Third-party integrations
	└── supabase/      # Supabase client
```

## Available Scripts

### Development

```bash
npm run dev
```

Starts the development server with hot module replacement.

### Build

```bash
npm run build
```

Builds the project for production with optimizations.

### Preview

```bash
npm run preview
```

Locally preview the production build.

### Lint

```bash
npm run lint
```

Run ESLint to check code quality.

## Multi-Language Support

The application supports 7 languages with automatic locale persistence using browser localStorage:

- **English** (en)
- **Hindi** (hi) - हिंदी
- **Gujarati** (gu) - ગુજરાતી
- **Marathi** (mr) - मराठी
- **Tamil** (ta) - தமிழ்
- **Telugu** (te) - తెలుగు
- **Bengali** (bn) - বাংলা

Language selection is managed through the `LanguageContext` and persists across page navigation and browser sessions.

## Key Components

### Navigation

Multi-screen responsive navigation with language selector dropdown and section routing.

### Crowd Dashboard

Real-time visualization of:

- Total current visitors
- Average visitor metrics
- Peak hours analysis
- Crowd density indicators

### Queue System

- FIFO queue management
- Estimated wait times
- Queue status tracking
- Booking integration

### Admin Dashboard

Secure administrative interface for:

- System configuration
- Staff management
- Event scheduling
- Report generation

### Analytics Dashboard

Comprehensive analytics including:

- Visitor trends
- Peak hour analysis
- Revenue tracking
- Operational metrics

## API Integration

The application integrates with Supabase for:

- Real-time database operations
- User authentication
- Data persistence
- API endpoints

## Styling

The project uses **Tailwind CSS** with custom theme configuration:

- Sacred gradient themes
- Temple-inspired color palette
- Responsive breakpoints
- Custom shadows and animations

## Accessibility

Built with accessibility in mind:

- Radix UI primitives ensure WCAG compliance
- Keyboard navigation support
- Screen reader compatible
- Semantic HTML structure
- ARIA labels and attributes

## Performance

- **Vite** provides fast module replacement and optimized builds
- **React Query** handles efficient server state management
- **Code splitting** for optimal bundle sizes
- **Lazy loading** for images and components

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## Development Guidelines

- Use functional components and hooks
- Follow React best practices
- Maintain consistent code style with ESLint
- Keep components modular and reusable
- Write meaningful commit messages

## Security

- Environment variables for sensitive data
- Supabase authentication for secure access
- Input validation on all forms
- CORS properly configured
- No sensitive data in version control

## Deployment

### Building for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

The project can be deployed to any platform that supports Node.js applications (Netlify, GitHub Pages, AWS, etc.).

## Troubleshooting

### Blank Screen Issue

- Ensure `main.jsx` entry point is correctly configured in `index.html`
- Check browser console for errors
- Verify Supabase configuration

### Language Not Persisting

- Check browser localStorage is enabled
- Clear browser cache and reload
- Verify LanguageContext is properly wrapping the app

### Dropdown Menu Issues

- Ensure Radix UI dropdown-menu component is properly imported
- Check that Portal rendering isn't blocked by CSS
- Verify z-index conflicts with navbar

## Performance Tips

- Use React DevTools Profiler to identify slow components
- Implement code splitting for large components
- Optimize images and assets
- Monitor bundle size with `npm run build`

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)
- [ ] SMS notifications
- [ ] QR code based entry
- [ ] AI-powered crowd prediction
- [ ] Video streaming integration
- [ ] Multi-temple support

## License

This project is proprietary and confidential. All rights reserved.

## Support

For issues, questions, or suggestions:

- Create an issue in the repository
- Contact the development team
- Check existing documentation

## Credits

Built with:

- React and Vite
- Radix UI and shadcn/ui
- Supabase
- Tailwind CSS
- Lucide Icons

---

**Last Updated**: February 2026
**Status**: Active Development
