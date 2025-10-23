# MP3 Player - React Native

A simple MP3 player app built with React Native and native Android modules using MediaPlayer API.

## Features

- 🎵 Play bundled MP3 file from app resources
- 📁 Pick and play MP3 files from device storage
- ⏯️ Play/Pause/Stop controls
- 🎚️ Interactive slider to seek through audio
- ⏱️ Real-time playback position display
- 📊 Shows current time and total duration

## Screenshots

[Add screenshots here]

## Prerequisites

- Node.js (v14 or higher)
- React Native CLI
- Android Studio with Android SDK
- Java Development Kit (JDK 11 or higher)
- An Android device or emulator

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/RnJavaPlayer.git
cd RnJavaPlayer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install the slider package

```bash
npm install @react-native-community/slider
```

### 4. Install document picker

```bash
npm install @react-native-documents/picker
```

### 5. Run on Android

Make sure you have an Android emulator running or device connected, then:

```bash
npx react-native run-android
```

## How it works

### Native Module (AudioModule.java)
- Uses Android's `MediaPlayer` API for audio playback
- Handles play, pause, stop, seek operations
- Provides methods to get duration and current position
- Supports both bundled resources and file URIs

### React Native Bridge (AudioModule.ts)
- TypeScript interface for the native module
- Exposes native methods to JavaScript

### UI Component (App.tsx)
- React Native UI with playback controls
- Slider for seeking through audio
- File picker integration for selecting MP3s
- Real-time position updates

## Usage

1. **Play bundled audio**: Tap "Play" to play the default sample.mp3
2. **Pick custom audio**: Tap "Pick MP3" to select a file from device storage
3. **Control playback**: Use Play/Pause/Stop buttons
4. **Seek**: Drag the slider to jump to any position
5. **View progress**: See current time and total duration

## Permissions

The app requires storage permissions to pick MP3 files. This is handled automatically by `@react-native-documents/picker`.

## Troubleshooting

### Build fails with "cannot find symbol" errors
Make sure you have all the required imports in `AudioModule.java`:
```java
import android.media.AudioAttributes;
import android.net.Uri;
```

### App crashes when picking files
Ensure `@react-native-documents/picker` is properly installed:
```bash
npm install @react-native-documents/picker
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### Duration shows 0:00
The duration is only available after the audio file is loaded. Try playing the audio first.

### Position not updating
Make sure the `playing` state is set to `true` after calling play.

## Technologies Used

- React Native
- TypeScript
- Android MediaPlayer API
- @react-native-community/slider
- @react-native-documents/picker

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## Acknowledgments

- React Native documentation
- Android MediaPlayer documentation
- Community contributors