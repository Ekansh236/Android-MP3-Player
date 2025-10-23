import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import AudioModule from './src/native/AudioModule'; 
import { pick } from '@react-native-documents/picker';
import {NativeModules} from 'react-native';

console.log('NativeModules:', Object.keys(NativeModules));
console.log('AudioModule:', NativeModules.AudioModule);

export default function App() {
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<{ name: string; uri: string } | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);

  // Update duration when selected track changes
  useEffect(() => {
    if (selected?.uri) {
      // Duration will be fetched when play is pressed
      setDur(0);
    }
  }, [selected]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (playing && !isSeeking) {
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
  }, [playing, isSeeking]);



  const play = async () => {
    try {
      if (selected?.uri) {
        await AudioModule.playUri(selected.uri);
      } else {
        await AudioModule.play();
      }
      setPlaying(true);

      // Get duration after playback starts
      setTimeout(async () => {
        try {
          const newDur = await AudioModule.getDuration();
          setDur(newDur);
        } catch (e) {
          console.warn('getDuration error:', e);
        }
      }, 1000);
    } catch (error) {
      console.error('Play error:', error);
    }
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

  const onSliderStart = () => {
    setIsSeeking(true);
  };

  const onSliderChange = (value: number) => {
    setPos(value);
  };

  const onSliderComplete = async (value: number) => {
    try {
      await AudioModule.seekTo(Math.floor(value));
      setIsSeeking(false);
    } catch (e) {
      console.warn('Seek error:', e);
      setIsSeeking(false);
    }
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

      {selected && (
        <Text style={styles.trackName}>{selected.name}</Text>
      )}

      <View style={styles.sliderContainer}>
        <Text style={styles.time}>{formatTime(pos)}</Text>
        
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={dur || 1}
          value={pos}
          onSlidingStart={onSliderStart}
          onValueChange={onSliderChange}
          onSlidingComplete={onSliderComplete}
          minimumTrackTintColor="#2e6ee6"
          maximumTrackTintColor="#555"
          thumbTintColor="#2e6ee6"
        />
        
        <Text style={styles.time}>{formatTime(dur)}</Text>
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#111',
    paddingHorizontal: 20,
  },
  title: { 
    color: '#fff', 
    fontSize: 22, 
    marginBottom: 10,
  },
  trackName: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
  },
  sliderContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  time: {
    color: '#fff',
    fontSize: 14,
    minWidth: 45,
  },
  row: { 
    flexDirection: 'row', 
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: { 
    backgroundColor: '#2e6ee6', 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 8,
  },
  text: { 
    color: '#fff', 
    fontWeight: '600',
  },
});
