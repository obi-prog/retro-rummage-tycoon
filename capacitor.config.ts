import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0feac41fb0f34fb68609c857212b75d2',
  appName: 'retro-rummage-tycoon',
  webDir: 'dist',
  server: {
    url: 'https://0feac41f-b0f3-4fb6-8609-c857212b75d2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    },
    StatusBar: {
      style: 'dark'
    }
  }
};

export default config;