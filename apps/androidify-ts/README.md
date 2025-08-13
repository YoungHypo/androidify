# Androidify React Native (Expo)

<div align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%2FAndroid%2FWeb-blue.svg" alt="Platform">
  <img src="https://img.shields.io/badge/TypeScript-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/Expo-black.svg" alt="Expo">
</div>

## 📱 Project Overview

Androidify (React Native + Expo Router + TypeScript) lets users create personalized Android robots from text prompts and uploaded photos.

### ✨ Key Features

- 🤖 **AI-Driven Image Generation** — Text-to-image via Google Generative API (Imagen preview)
- 🖼️ **Image-Assisted Prompting** — Validate uploaded image → extract subject description → generate Android robot
- 💾 **Result Actions** — Save to gallery, create again

### 🎤 Demo

<!-- TBD: add screenshots or a short video -->

## 🚀 Quick Start

### Installation Steps

1. **Clone the Project**
   ```bash
   git clone https://github.com/YoungHypo/androidify.git
   cd androidify/apps/androidify-ts
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   # Edit .env:
   # EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Install and Start**
   ```bash
   npm install
   npx expo start  # choose i / a / w to run on iOS / Android / Web
   ```

## 🛠 Technical Architecture

### Core Components

```
┌─────────────────────────────────────────┐
│                UI Layer                  │
├───────────────┬───────────────┬─────────┤
│ app/index.tsx │ app/creation  │ results │
│ app/about     │ + components  │         │
└───────────────┴───────────────┴─────────┘
┌─────────────────────────────────────────┐
│              Service Layer              │
├─────────────────────────────────────────┤
│      src/services/geminiService.ts      │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│                 Theme                    │
├─────────────────────────────────────────┤
│          src/theme/* (MD3)              │
└─────────────────────────────────────────┘
```

### AI Generation Process

The app supports two flows: Text Prompt mode and Image Upload mode.

1) Text Prompt → Androidify
```
User Prompt → Prompt Enhancement → Imagen Predict → Save/Display
      ↓               ↓                   ↓            ↓
  Free text     buildAndroidBotPrompt   imagen-4.0   FileSystem
                                   (predict endpoint)
```


2) Image Upload → Androidify
```
Upload → Policy Validation → Subject Description → Prompt Enhancement → Imagen Predict → Save/Display
  ↓            ↓                    ↓                    ↓                 ↓             ↓
 picker   gemini-2.5-flash   extractHumanSubject   buildAndroidBotPrompt  imagen-4.0   FileSystem
                             (generateContent)                            (predict)
```

## 🙏 License and Acknowledgments

- Thanks to the original Androidify app, Google Gemini, and the React Native/Expo community.