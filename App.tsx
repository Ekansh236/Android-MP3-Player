import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AudioModule from './src/native/AudioModule'; // 👈 your JS bridge wrapper
import { pick } from '@react-native-documents/picker';
import {NativeModules} from 'react-native';
console.log('NativeModules:', Object.keys(NativeModules));
console.log('AudioModule:', NativeModules.AudioModule);

// at the top of App.tsx (with other hooks)
type Track = { name: string; uri: string };

export default function App() {
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<{ name: string; uri: string } | null>(null);

  // Update duration when selected track changes
  useEffect(() => {
  // Only fetch duration if we have a selected track
  if (selected?.uri) {
    // You might need a small delay to let the native module load the file
    const timer = setTimeout(() => {
      AudioModule.getDuration()
        .then(setDur)
        .catch((e) => console.warn('getDuration error:', e));
    }, 100);
    
    return () => clearTimeout(timer);
  }
}, [selected]); // ✅ Add dependency

  const play = async () => {
    if (selected?.uri) {
      await AudioModule.playUri(selected.uri);  
    } else {
      await AudioModule.play();                  
    }
    setPlaying(true);
  };

  const pause = async () => {
    await AudioModule.pause();
    setPlaying(false);
  };

  const stop = async () => {
    await AudioModule.stop();
    setPlaying(false);
    setPos(0);
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  const pickFile = async () => {
    try {
      const results = await pick({ type: ['audio/mpeg'] });
      const first = Array.isArray(results) ? results[0] : results;

      if (first?.uri) {
        setSelected({ name: first.name ?? 'audio.mp3', uri: first.uri });
      }
    } catch (error) {
      // User cancelled or error occurred
      console.log('File picker cancelled or error:', error);
      // Don't throw - just return silently when user cancels
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sample MP3 Player</Text>

      <View style={styles.row}>
        <TouchableOpacity onPress={play} style={styles.button}>
          <Text style={styles.text}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={pause} style={styles.button}>
          <Text style={styles.text}>Pause</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={stop} style={styles.button}>
          <Text style={styles.text}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={pickFile} style={styles.button}>
          <Text style={styles.text}>Pick MP3</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.time}>
        {formatTime(pos)} / {formatTime(dur)}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  title: { color: '#fff', fontSize: 22, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12 },
  button: { backgroundColor: '#2e6ee6', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  text: { color: '#fff', fontWeight: '600' },
  time: { color: '#fff', marginTop: 20, fontSize: 18 },
});
