package com.example.rnjava;
import android.media.MediaPlayer;

import android.os.Handler;
import android.os.Looper;
import androidx.annotation.NonNull;
import android.media.AudioAttributes;  
import android.net.Uri;      

import java.net.URI;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AudioModule extends ReactContextBaseJavaModule {
    
    private MediaPlayer player;
    private final ReactApplicationContext ctx;

    public AudioModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ctx = reactContext;
    }

    // Send events from Java → JS via DeviceEventEmitter
    private void sendEvent(String eventName, WritableMap params) {
        ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    // Lazy init: create MediaPlayer with default audio (R.raw.sample) if none exists
    private void ensurePlayer() {
        if (player == null) {
            player = MediaPlayer.create(ctx, R.raw.sample); // Default audio
        }
    }

    // Play audio from URI: reset player, set data source, prepare async, start on ready
    //@ReactMethod exposes Java methods to JS (Makes it callable from JS)
    //Promise is used for async operations to return results or errors back to JS

    // 3. Java receives URI string
    @ReactMethod
    public void playUri(String uriString, Promise promise) {
        try {
            Uri uri = Uri.parse(uriString);

            if (player != null) {
                player.reset();
                player.release();
                player = null;
            }
            player = new MediaPlayer();
            player.setAudioAttributes(
                new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .build()
            );
            player.setDataSource(getReactApplicationContext(), uri);
            // 4. When ready, start and resolve promise
            player.setOnPreparedListener(mp -> {
                mp.start();
                promise.resolve(true);  // Returns boolean value to JS
            });
            player.setOnCompletionListener(mp -> { 
                cleanupPlayer("ended");
            });
            player.prepareAsync();
        } catch (Exception e) {
            promise.reject("E_PLAY_URI", e);  
        }
    }

    // Stop player, release resources, notify JS of state change
    private void cleanupPlayer(String state) {
        if (player != null) {
            try {
            player.stop();
            } catch (Exception ignored) {}
            player.release();
            player = null;
        }
        WritableMap m = Arguments.createMap();
        m.putString("state", state);
        sendEvent("AudioState", m);
    }

    @ReactMethod
    public void start(Promise promise) {
        try {
            ensurePlayer();
            if (player != null && !player.isPlaying())
                player.start();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("E_PLAY", e);
        }
    }

    
    @ReactMethod
    public void pause(Promise promise) {
        try {
            if (player != null)
                player.pause();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("E_PAUSE", e);
        }
    }

    @ReactMethod
    public void stop(Promise promise) {
        try {
            if (player != null) {
                try {
                    player.stop();
                }
                catch (Exception ignored) {}
                player.release();
                player = null;
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("E_STOP", e);
        }

    }

    @ReactMethod
    public void getDuration(Promise promise) {
        try {
            ensurePlayer();
            if (player == null) {
                promise.resolve(0);
                return;
            }
            promise.resolve(player.getDuration());
        }
        catch (Exception e) {
            promise.reject("E_DURATION", e);
        }
    }

    @ReactMethod
    public void play(Promise promise) {
        start(promise);
    }

    @ReactMethod
    public void getCurrentPosition(Promise promise) {
        try {
            ensurePlayer();
            if (player == null) {
                promise.resolve(0);
                return;
            }
            promise.resolve(player.getCurrentPosition());
        }
        catch (Exception e) {
            promise.reject("E_POS", e);
        }
    }

    @ReactMethod
    public void seekTo(int ms, Promise promise) {
        try {
            if (player != null) {
                player.seekTo(ms);
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("E_SEEK", e);
        }
    }

    public String getName() {
        return "AudioModule";
    }

}
