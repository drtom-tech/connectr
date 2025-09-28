# Deployment Guide for Connectr

## 🚀 Deployment Options

Since this is a React Native/Expo app, here are your deployment options:

### **Option 1: Expo Application Services (EAS) - Recommended**

This is the official way to deploy Expo apps to app stores and as web apps.

#### Steps:

1. **Create Expo account** (if you don't have one):
   ```bash
   npx expo register
   ```

2. **Login to Expo**:
   ```bash
   npx expo login
   ```

3. **Configure EAS**:
   ```bash
   npx eas build:configure
   ```

4. **Build for Web** (to deploy to a web URL):
   ```bash
   npx eas build --platform web
   ```

5. **Build for Mobile**:
   ```bash
   npx eas build --platform all
   ```

6. **Deploy to Expo Go** (for testing):
   ```bash
   npx expo publish
   ```

### **Option 2: Web Deployment (Alternative)**

If you want to deploy as a web app that can be accessed via browser:

1. **Build for web**:
   ```bash
   npx expo export --platform web
   ```

2. **Deploy the `dist` folder** to:
   - **Vercel**: `vercel --prod`
   - **Netlify**: Upload the `dist` folder to Netlify
   - **GitHub Pages**: Push to gh-pages branch

### **Option 3: Mobile App Stores**

For iOS App Store and Google Play Store:

1. **Build for production**:
   ```bash
   npx eas build --platform ios --profile production
   npx eas build --platform android --profile production
   ```

2. **Submit to stores**:
   ```bash
   npx eas submit --platform ios
   npx eas submit --platform android
   ```

## 🌐 **Quick Web Deployment to Netlify**

If you specifically want to use Netlify for a web version:

### Step 1: Build for Web
```bash
npx expo export --platform web
```

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up/login with your account
3. Drag and drop the `dist` folder from your project
4. Or connect your GitHub repo and set build command: `npx expo export --platform web`

### Step 3: Configure Firebase for Web
Make sure your Firebase project allows web access and update the configuration.

## 📱 **Testing Your Deployment**

### For Web:
- Your app will be available at a Netlify URL (like `https://your-app-name.netlify.app`)
- Users can access it in any web browser
- Mobile browsers will work, but it's not a native app

### For Mobile:
- **Expo Go**: Share the Expo URL with users
- **App Stores**: Users download from iOS App Store or Google Play Store

## ⚠️ **Important Notes**

1. **Firebase Configuration**: Make sure your Firebase project is set up for web deployment
2. **Environment Variables**: Don't commit sensitive Firebase keys to public repos
3. **Domain Configuration**: Update Firebase authorized domains for your deployment URL
4. **Performance**: Web version may not perform as well as native mobile apps

## 🔧 **Pre-Deployment Checklist**

- [ ] Firebase project configured
- [ ] Security rules set up
- [ ] App tested locally
- [ ] Firebase config updated for production
- [ ] Environment variables secured
- [ ] App icons and splash screens configured

## 🆘 **Need Help?**

- [Expo Deployment Docs](https://docs.expo.dev/distribution/introduction/)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)

---

**Recommendation**: Start with Expo's web deployment (`npx expo export --platform web`) and then upload to Netlify for the quickest web deployment.

