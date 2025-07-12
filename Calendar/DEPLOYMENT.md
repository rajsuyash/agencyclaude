# Deployment Guide

This guide walks you through deploying the Calendar App to Render.

## Prerequisites

1. A GitHub account
2. A Render account (free tier available)
3. Your code repository pushed to GitHub

## Deployment Steps

### 1. Prepare Your Repository

1. Ensure all code is committed and pushed to GitHub:
```bash
git add .
git commit -m "Initial calendar app implementation"
git push origin main
```

### 2. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `calendar-app` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose your preferred plan)

### 3. Environment Variables

The app doesn't require any environment variables for basic functionality, but you can add them if needed:

- `NODE_ENV=production` (automatically set by Render)

### 4. Custom Domain (Optional)

1. In your Render service dashboard, go to "Settings"
2. Under "Custom Domain", add your domain
3. Follow Render's instructions to configure your DNS

## Configuration Files

The repository includes these deployment configuration files:

- `render.yaml` - Render service configuration
- `package.json` - Build and start scripts
- `.gitignore` - Files to exclude from deployment

## Build Output

The production build will be approximately:
- Main page: ~14.6 kB
- First Load JS: ~102 kB
- Total bundle size: Well optimized for fast loading

## Features Available After Deployment

✅ **Fully Functional Calendar**
- Month, Week, and Day views
- Event creation, editing, and deletion
- Responsive design for all devices
- Dark/Light mode toggle
- Apple-inspired design

✅ **Performance Optimized**
- Static generation where possible
- Optimized images and assets
- Fast loading times

✅ **Mobile Friendly**
- Touch-optimized interface
- Mobile sidebar navigation
- Responsive layout

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors: `npm run typecheck`
- Verify ESLint passes: `npm run lint`

### App Doesn't Load
- Check Render service logs
- Verify the start command is correct
- Ensure port binding is correct (Render handles this automatically)

## Support

If you encounter issues:
1. Check the Render service logs
2. Verify your build runs locally: `npm run build && npm start`
3. Review this deployment guide
4. Contact support if needed