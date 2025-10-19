package com.example.rnjava;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class AudioPackage implements ReactPackage {
    @Override public List<NativeModule> createNativeModules(ReactApplicationContext rc) {
        List<NativeModule> list = new ArrayList<>();
        list.add(new AudioModule(rc));
        return list;
    }
    @Override public List<ViewManager> createViewManagers(ReactApplicationContext rc) {
        return Collections.emptyList();
    }
}
