import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AudioModule from './src/native/AudioModule'; // 👈 your JS bridge wrapper

import {NativeModules} from 'react-native';
console.log('NativeModules:', Object.keys(NativeModules));
console.log('AudioModule:', NativeModules.AudioModule);

export default function App() {
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Get duration when the app starts
  useEffect(() => {
    AudioModule.getDuration()
      .then(setDur)
      .catch((e) => console.warn('getDuration error:', e));
  }, []);

  // Poll current position while playing
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (playing) {
      timer = setInterval(async () => {
        try {
          const current = await AudioModule.getCurrentPosition();
          setPos(current);
        } catch {
          setPos(0);
        }
      }, 500);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playing]);

  const play = async () => {
    await AudioModule.play();
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
