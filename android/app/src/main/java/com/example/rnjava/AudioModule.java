package com.example.rnjava;
import android.media.MediaPlayer;

import android.os.Handler;
import android.os.Looper;
import androidx.annotation.NonNull;
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

    /**
     * sendEvent
     * ----------
     * Sends an event from Java → JS.
     * JS can subscribe to this using DeviceEventEmitter.
     */
    private void sendEvent(String eventName, WritableMap params) {
        ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private void ensurePlayer() {
        if (player == null) {
            player = MediaPlayer.create(ctx, R.raw.sample); // res/raw/sample.mp3
        }
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
            if (player != null && !player.isPlaying())
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

    public void onHostResume() {

    }

    public void onHostPause() {

    }

    public void onHostDestroy() {

    }
}
