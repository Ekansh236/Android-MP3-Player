import { NativeModules } from 'react-native';

type AudioModuleType = {
  play(): Promise<boolean>;
  pause(): Promise<boolean>;
  stop(): Promise<boolean>;
  getDuration(): Promise<number>;
  getCurrentPosition(): Promise<number>;
  seekTo(ms: number): Promise<boolean>;
};

const { AudioModule } = NativeModules as { AudioModule: AudioModuleType };

// Optional safety check (nice during setup)
if (!AudioModule) {
  throw new Error(
    'AudioModule not found. Did you register AudioPackage in MainApplication.kt and rebuild the app?'
  );
}

export default AudioModule;
