---
description: How to deploy the Data Visualization application to Zoho Catalyst
---

# Deployment Workflow for Data Visualization App

This application is deployed on **Zoho Catalyst Serverless Platform**. Follow these steps to deploy updates.

## Prerequisites

1. **Zoho Catalyst CLI** must be installed
   - Check if installed: `catalyst --version`
   - If not installed, install it: `npm install -g zcatalyst-cli`

2. **Catalyst Account** - You must be logged in to Catalyst
   - Check login status: `catalyst status`
   - If not logged in: `catalyst login`

## Deployment Steps

### 1. Build the Production Bundle

First, create an optimized production build of your React application:

```bash
npm run build
```

This will:
- Create a `build` folder with optimized static files
- Minify JavaScript and CSS
- Generate production-ready assets
- Include content hashes in filenames for cache busting

**Expected output**: A `build/` directory containing your compiled application.

### 2. Test the Build Locally (Optional but Recommended)

Before deploying, test the production build locally:

```bash
npx serve -s build -p 3000
```

Then open http://localhost:3000 in your browser to verify everything works correctly.

Press `Ctrl+C` to stop the local server when done testing.

### 3. Deploy to Catalyst

Deploy your application to Catalyst using the CLI:

```bash
catalyst deploy
```

This command will:
- Upload your build files to Catalyst
- Deploy to your Catalyst project
- Provide you with the deployment URL

**Alternative**: If you need to specify a project or environment:

```bash
catalyst deploy --project <project-id>
```

### 4. Verify Deployment

After deployment completes, you'll receive a URL like:
```
https://datavisualization-60030162551.development.catalystserverless.in/app/
```

Open this URL in your browser to verify the deployment was successful.

## Quick Deploy Command

For a quick build and deploy in one go:

```bash
npm run build && catalyst deploy
```

## Troubleshooting

### Issue: "catalyst: command not found"
**Solution**: Install Catalyst CLI globally:
```bash
npm install -g zcatalyst-cli
```

### Issue: "Not logged in"
**Solution**: Login to Catalyst:
```bash
catalyst login
```
Follow the prompts to authenticate with your Zoho account.

### Issue: Build fails
**Solution**: 
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Try building again:
   ```bash
   npm run build
   ```

### Issue: Deployment fails
**Solution**: 
1. Check your Catalyst project status:
   ```bash
   catalyst status
   ```
2. Verify you have the correct permissions for the project
3. Check if there's a `catalyst.json` or similar config file in your project root

## Environment Variables

If your app uses environment variables:

1. Create a `.env.production` file in your project root
2. Add your production environment variables:
   ```
   REACT_APP_API_URL=https://datarecord-backend.onrender.com
   ```
3. Rebuild and redeploy:
   ```bash
   npm run build
   catalyst deploy
   ```

## Rollback

If you need to rollback to a previous version:

```bash
catalyst rollback
```

Or use the Catalyst web console to manage deployments.

## Additional Resources

- [Catalyst Documentation](https://catalyst.zoho.com/help/)
- [Catalyst CLI Reference](https://catalyst.zoho.com/help/cli-reference.html)
- [Create React App Deployment Guide](https://create-react-app.dev/docs/deployment/)
