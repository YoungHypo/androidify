# Androidify React Native (Expo)

<div align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%2FAndroid%2FWeb-blue.svg" alt="Platform">
  <img src="https://img.shields.io/badge/TypeScript-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/Expo-black.svg" alt="Expo">
</div>

## 📱 Project Overview

Androidify (React Native + Expo Router + TypeScript) lets users create personalized Android robots from text prompts and uploaded photos.

## ✨ Key Features

- 🤖 **AI-Driven Image Generation** — Text-to-image via Google Generative API (Imagen preview)
- 🖼️ **Image-Assisted Prompting** — Validate uploaded image → extract subject description → generate Android robot
- 💾 **Result Actions** — Save to gallery, create again

## 🎤 Demo
### HomeScreen
<p>
  <img width="380" alt="simulator_screenshot_8FA857E6-1BCE-418D-9B44-AC9D3B37B23E" src="https://github.com/user-attachments/assets/046ef8e0-bcb7-49f6-a33c-d7f7833182df" />
  <img width="380" alt="simulator_screenshot_16E903CA-EFCA-44A5-9E1B-CA8ADEC4A045" src="https://github.com/user-attachments/assets/88f63fe0-5b2e-45f7-992f-9d5e94563ea7" />

</p>

### Text to Bot

<p>
  <img width="380" alt="simulator_screenshot_68AAF3AB-A535-4113-957C-F144438077AB" src="https://github.com/user-attachments/assets/1850191b-d5a6-43ab-b68a-7a6359bdb234" />
  <img width="380" alt="simulator_screenshot_8D77429D-0597-4BD9-A491-B4E18DAF2D6A" src="https://github.com/user-attachments/assets/eea77613-a62f-4460-8497-fff715af060e" />
</p>

### Image to Bot

<p>
  <img width="380" alt="simulator_screenshot_D921B849-BB60-42DF-B981-3B8BB8488A6B" src="https://github.com/user-attachments/assets/c86ed63a-d53e-41d3-a20f-8c11e2530bd9" />
  <img width="380" alt="simulator_screenshot_F8F174BE-E28D-48BD-A80E-6678F3EAB21C" src="https://github.com/user-attachments/assets/0658d720-0860-4d8a-b99e-84ab1ec615a1" />
</p>


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
