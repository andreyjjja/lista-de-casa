export default {
  expo: {
    name: 'Lista de Casa',
    slug: 'lista-de-casa',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.lista-de-casa.app'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.lista-de-casa.app',
      permissions: [
        'INTERNET',
        'ACCESS_NETWORK_STATE'
      ]
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-secure-store'
    ],
    extra: {
      eas: {
        projectId: 'your-project-id'
      }
    }
  }
}; 