# Calendar App

A beautiful calendar application inspired by Apple design principles, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 📅 **Multiple Views**: Month, Week, and Day views
- 🎨 **Apple-Inspired Design**: Clean, modern interface following Apple's design principles
- 📱 **Responsive**: Fully responsive design optimized for mobile and desktop
- 🌙 **Dark Mode**: Toggle between light and dark themes
- ✨ **Event Management**: Create, edit, and delete events with ease
- 🎯 **Color-Coded Events**: Organize events with customizable colors
- 📍 **Location Support**: Add locations to your events
- ⏰ **All-Day Events**: Support for both timed and all-day events
- 🔍 **Quick Navigation**: Easy navigation between dates and views

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Apple-inspired theme
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **State Management**: React hooks with custom calendar logic
- **Deployment**: Render

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd calendar-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Design Principles

This application follows Apple's four core design principles:

1. **Clarity** - Clean typography with system fonts and clear visual hierarchy
2. **Deference** - Minimal interface that focuses on content
3. **Depth** - Subtle shadows, blurs, and layering effects
4. **Consistency** - Uniform design language throughout the application

## Deployment

This app is configured for deployment on Render. The `render.yaml` file contains the deployment configuration.

To deploy:

1. Connect your GitHub repository to Render
2. The app will automatically deploy using the configuration in `render.yaml`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
