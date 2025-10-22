import { NativeModules } from 'react-native';

type AudioModuleType = {
  play(): Promise<boolean>;
  pause(): Promise<boolean>;
  stop(): Promise<boolean>;
  getDuration(): Promise<number>;
  getCurrentPosition(): Promise<number>;
  seekTo(ms: number): Promise<boolean>;
  playUri(uri: string): Promise<boolean>;

};

const { AudioModule } = NativeModules as { AudioModule: AudioModuleType };

export default AudioModule;

await AudioModule.playUri(selected.uri);

