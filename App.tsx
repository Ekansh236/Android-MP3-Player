import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AudioModule from '/Users/ekanshahuja/Android-App/RnJavaPlayer/android/app/src/native/AudioModule.ts';

function ms(ms: number) {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export default function App() {
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    AudioModule.getDuration().then(setDur).catch(() => setDur(0));
    return () => { if (timer.current) clearInterval(timer.current); AudioModule.stop().catch(()=>{}); };
  }, []);

  const startPolling = () => {
    if (timer.current) return;
    timer.current = setInterval(async () => {
      const p = await AudioModule.getCurrentPosition().catch(()=>0);
      setPos(p);
    }, 300);
  };

  const stopPolling = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };

  const onPlay = async () => { await AudioModule.play(); setPlaying(true); startPolling(); };
  const onPause = async () => { await AudioModule.pause(); setPlaying(false); };
  const onStop = async () => { await AudioModule.stop(); setPlaying(false); stopPolling(); setPos(0); };

  return (
    <SafeAreaView style={s.c}>
      <Text style={s.title}>Sample Track</Text>
      <Text style={s.sub}>res/raw/sample.mp3</Text>

      <View style={s.row}>
        <TouchableOpacity onPress={onPlay} style={[s.btn, playing && s.active]}><Text style={s.bt}>{playing?'Playing':'Play'}</Text></TouchableOpacity>
        <TouchableOpacity onPress={onPause} style={s.btn}><Text style={s.bt}>Pause</Text></TouchableOpacity>
        <TouchableOpacity onPress={onStop} style={s.btn}><Text style={s.bt}>Stop</Text></TouchableOpacity>
      </View>

      <Text style={s.time}>{ms(pos)} / {ms(dur)}</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  c:{flex:1,justifyContent:'center',alignItems:'center',gap:16,backgroundColor:'#0b1220'},
  title:{color:'#fff',fontSize:22,fontWeight:'700'},
  sub:{color:'#9fb0cf'},
  row:{flexDirection:'row',gap:12},
  btn:{backgroundColor:'#1e2a44',paddingVertical:12,paddingHorizontal:16,borderRadius:12},
  active:{backgroundColor:'#2e6ee6'},
  bt:{color:'#fff',fontWeight:'600'},
  time:{color:'#fff'}
});
