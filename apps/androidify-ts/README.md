## Androidify React Native (Expo) 🤖

An Androidify app built with React Native (Expo Router + TypeScript). It generates Android robot images from text descriptions and optionally supports uploading images from the local gallery.

### Key Features
- Text-to-Image (AI): Powered by Google Generative Language API (Imagen preview model)
- Image upload assisted description: validate image → extract character description → generate robot
- Material Design 3 theme: aligned with the Android version’s colors, corner radii, typography, and motion
- Modern animations: Reanimated entrances, spring scaling, slide-in, and subtle pulsing
- Result actions: save to gallery, jump back to create again

## Environment Variables and Running
1) Set the API key:
```bash
cp env.example .env
# Edit .env:
# EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```
2) Install and start:
```bash
npm install
npx expo start
```

## License and Acknowledgments
- Thanks to: the original Android app, Google Gemini, and the React Native/Expo community