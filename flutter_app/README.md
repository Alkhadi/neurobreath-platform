# NeuroBreath Mobile App (Flutter)

**Purpose**: Native iOS and Android application for NeuroBreath, providing offline access, push notifications, and device sensor integration.

---

## 📁 Planned Directory Structure

```
flutter_app/
├── lib/
│   ├── main.dart           # App entry point
│   ├── screens/            # UI screens
│   ├── widgets/            # Reusable widgets
│   ├── models/             # Data models
│   ├── services/           # API clients, storage
│   └── theme/              # Design tokens (from /shared)
├── assets/             # App-specific assets
├── test/               # Unit + widget tests
├── pubspec.yaml        # Dependencies
└── README.md           # This file
```

---

## 🎯 Purpose

### **Why Flutter?**
- **Single Codebase**: iOS + Android from one Dart codebase
- **Performance**: Native-level rendering (60 FPS animations)
- **Offline-First**: Built-in SQLite database support
- **Rich UI**: Material Design + Cupertino widgets
- **Sensors**: Easy access to gyroscope, accelerometer (breathing pace detection)

### **Mobile-Specific Features**
1. **Offline Mode**: Download sessions for use without internet
2. **Push Notifications**: Daily practice reminders
3. **Haptic Feedback**: Vibrate on breathing phase transitions
4. **Background Audio**: Continue guided breathing when screen off
5. **Breathing Pace Detection**: Use gyroscope to detect chest movement (experimental)
6. **Widget**: iOS home screen widget showing streak

---

## 🚀 Planned Features (Phase 3 - Q2 2025)

### **Core Functionality** (Parity with Web)
- All 4 breathing techniques (Box, 4-7-8, Coherent, SOS)
- Dyslexia reading training (28+ tools)
- ADHD Deep Dive resources
- Playful Breathing Lab (Breath Ladder, Colour-Path, etc.)
- Progress tracking (synced with web via API)

### **Mobile-Only Features**
- **Camera Integration**: Visual breathing pacer using camera for object tracking (advanced)
- **Watch Integration**: Apple Watch + Wear OS companion apps
- **Siri/Google Assistant**: "Hey Siri, start box breathing"
- **Quick Actions**: 3D Touch shortcuts for favorite techniques

---

## 📦 Technology Stack

### **Framework**
- **Flutter 3.x**: Google's UI toolkit for multi-platform apps
- **Dart 3.x**: Programming language for Flutter

### **State Management**
- **Riverpod**: Modern, type-safe state management
- Alternative: **Bloc** (if team prefers event-driven architecture)

### **Storage**
- **Hive**: Lightweight, fast key-value database (offline progress)
- **Sqflite**: SQLite plugin for complex queries (session history)
- **Shared Preferences**: Simple key-value storage (settings)

### **Networking**
- **Dio**: HTTP client for API requests
- **JSON Serialization**: `json_serializable` package

### **Audio**
- **audioplayers**: Play MP3 guidance files
- **flutter_tts**: Text-to-speech for voice coaching

### **Sensors**
- **sensors_plus**: Access accelerometer, gyroscope
- **camera**: Camera access for visual breathing pacer

### **Notifications**
- **flutter_local_notifications**: Local notifications (reminders)
- **firebase_messaging**: Push notifications (optional, Phase 4)

---

## 🎨 Design System

### **Theme Integration**
- Import design tokens from `/shared/design/tokens.json`
- Generate Flutter theme:

```dart
// lib/theme/app_theme.dart
import 'package:flutter/material.dart';
import 'package:shared/design/tokens.json';

final appTheme = ThemeData(
  primaryColor: Color(0xFF4A90E2), // From tokens.json
  colorScheme: ColorScheme.fromSeed(seedColor: Color(0xFF4A90E2)),
  textTheme: TextTheme(
    bodyLarge: TextStyle(fontSize: 16, fontFamily: 'Inter'),
  ),
);
```

### **Accessibility**
- Semantic labels for screen readers
- Large touch targets (48x48 dp minimum)
- High contrast mode support
- Font scaling (respect system font size settings)

---

## 🛠️ Development Workflow

### **Setup**
```bash
# Install Flutter SDK
flutter doctor    # Verify installation

cd flutter_app
flutter pub get   # Install dependencies
```

### **Run on Emulator**
```bash
# iOS Simulator
open -a Simulator
flutter run

# Android Emulator
flutter emulators --launch <emulator_id>
flutter run
```

### **Run on Physical Device**
```bash
# iOS (requires Xcode + Apple Developer account)
flutter run -d <device_id>

# Android (enable USB debugging)
flutter run -d <device_id>
```

### **Testing**
```bash
flutter test                 # Run unit tests
flutter test integration_test/  # Run integration tests
```

### **Build**
```bash
# iOS (App Store)
flutter build ipa --release

# Android (Google Play)
flutter build appbundle --release
```

---

## 📦 Distribution

### **App Store (iOS)**
- **Requirements**: Apple Developer account ($99/year)
- **Process**: Xcode → Archive → Upload to App Store Connect
- **Review Time**: 1-3 days

### **Google Play (Android)**
- **Requirements**: Google Play Console account ($25 one-time)
- **Process**: Build AAB → Upload to Play Console → Submit for review
- **Review Time**: 1-2 days

---

## 🔄 Synchronization with Web

### **Strategy**
1. **LocalStorage → Hive**: Migrate web's LocalStorage data structure to Hive
2. **API Integration**: Connect to Cloudflare Workers (`/api/user/progress`)
3. **Sync Logic**:
   - **On App Open**: Fetch latest progress from API, merge with local data
   - **On Session Complete**: Save locally, queue for upload
   - **Background Sync**: Upload queued sessions when online
   - **Conflict Resolution**: Last-write-wins (timestamp-based)

### **Data Model** (Shared Schema)
```dart
// lib/models/breathing_session.dart
class BreathingSession {
  final String id;
  final String technique;  // 'box', '4-7-8', 'coherent', 'sos'
  final int duration;      // seconds
  final int breathCount;
  final DateTime timestamp;
  final String voiceMode;  // 'audio', 'tts', 'off'
  final String ambientSound;
  
  // Matches web's localStorage schema
  Map<String, dynamic> toJson() { ... }
  factory BreathingSession.fromJson(Map<String, dynamic> json) { ... }
}
```

---

## 📊 Success Metrics (Phase 3)

### **Adoption**
- 30% of web users download mobile app
- 4.5+ star rating on App Store + Google Play

### **Engagement**
- 60% of mobile users open app 3x/week
- Average session length: 5 minutes

### **Retention**
- Day 7 retention: 40%+
- Day 30 retention: 20%+

---

## 🚧 Status

**Current**: Placeholder directory (no code yet)  
**Timeline**: Q2 2025 (Phase 3)  

**Next Steps**:
1. Initialize Flutter project: `flutter create neurobreath_app`
2. Set up CI/CD (GitHub Actions → Fastlane)
3. Design mobile-specific UI mockups
4. Implement core breathing feature (MVP)
5. Beta testing via TestFlight (iOS) + Internal Testing (Android)
6. Submit to App Store + Google Play

---

## 📚 Resources

- [Flutter Documentation](https://docs.flutter.dev/)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- [Riverpod State Management](https://riverpod.dev/)
- [Flutter Accessibility](https://docs.flutter.dev/development/accessibility-and-localization/accessibility)

---

**Last Updated**: December 25, 2024
