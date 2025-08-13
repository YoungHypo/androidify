## Androidify Monorepo

An Androidify project that includes implementations for both iOS and React Native (Expo). It generates personalized Android robot images from text or image descriptions and enables preview and saving on mobile devices.

### Repository Structure
```
androidify/
  └─ apps/
       ├─ androidify-ios/       # iOS native (SwiftUI + Firebase AI Logic)
       └─ androidify-ts/        # React Native (Expo Router + TypeScript)
```

### Subprojects
- iOS (SwiftUI): Native implementation that integrates Firebase AI Logic, uses Gemini for content validation and prompt refinement, and Imagen for robot image generation.
    - [iOS project README](apps/androidify-ios/README.md)

- React Native (Expo): Cross-platform implementation (iOS/Android/Web) using Expo Router and TypeScript, leveraging the Generative API (Gemini + Imagen) for generation.
    - [React Native project README](apps/androidify-ts/README.md)

### AI Generation Flow (Overview)
- Text → Prompt enhancement → Imagen generation
- Image → Gemini validation (policy and suitability) → Gemini subject description extraction → Prompt enhancement → Imagen generation