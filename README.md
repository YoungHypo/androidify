# Androidify iOS

<div align="center">
  <img src="https://img.shields.io/badge/Platform-iOS-blue.svg" alt="Platform">
  <img src="https://img.shields.io/badge/Swift-5.9+-orange.svg" alt="Swift">
  <img src="https://img.shields.io/badge/iOS-15.0+-green.svg" alt="iOS">
  <img src="https://img.shields.io/badge/Xcode-16.2+-blue.svg" alt="Xcode">
  <img src="https://img.shields.io/badge/Firebase-AI%20Logic-yellow.svg" alt="Firebase">
</div>

## 📱 Project Overview

Androidify iOS is an AI-driven Android robot image generation application that allows users to create personalized Android robots through simple text descriptions. This project is the iOS port of the original Android Androidify app, built using the latest Firebase AI Logic SDK and SwiftUI technology.

### ✨ Key Features

- 🤖 **AI-Driven Image Generation** - Generates high-quality Android robot images using the Google Imagen 3.0 model
- 🎨 **Intelligent Prompt Processing** - Content validation and safety filtering based on the Gemini 2.5 pro model
- 🎯 **Intuitive User Interface** - A modern, responsive interface built with SwiftUI
- 🔒 **Secure and Reliable** - Integrates Firebase App Check to protect API calls

## 🚀 Quick Start

### Installation Steps

1. **Clone the Project**
   ```bash
   git clone https://github.com/YoungHypo/androidify.git
   cd androidify
   ```

2. **Firebase Configuration**
   - Create a new project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable **Firebase AI Logic**
   - Select **Vertex AI Developer API**
   - Download the `GoogleService-Info.plist` file to the project root directory

3. **Dependency Installation**
   
   Add Swift Package dependencies in Xcode:
   ```
   https://github.com/firebase/firebase-ios-sdk
   ```

## 🛠 Technical Architecture

### Core Components

```
┌─────────────────────────────────────────┐
│                UI Layer                  │
├─────────────────┬───────────────────────┤
│ TextCreationView│ GenerationProgressView│
│ ResultsView     │ ContentView           │
└─────────────────┴───────────────────────┘
┌─────────────────────────────────────────┐
│            ViewModel Layer              │
├─────────────────────────────────────────┤
│          CreationViewModel              │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│            Service Layer                │
├─────────────────────────────────────────┤
│             AIService                   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│          Firebase AI Logic              │
├─────────────────┬───────────────────────┤
│  Gemini 2.5 pro │     Imagen 3.0        │
│  (Validation)   │   (Generation)        │
└─────────────────┴───────────────────────┘
```

### AI Generation Process

```
User Input → Content Validation → Prompt Construction → Image Generation → Result Display
    ↓                 ↓                   ↓                     ↓
  Text Box    Gemini Validation   Prompt Template       Imagen Generation
```

## 🙏 Acknowledgments

- **Google** - For providing Firebase AI Logic SDK and Imagen model
- **Original Android Androidify Team** - For design inspiration and concept
