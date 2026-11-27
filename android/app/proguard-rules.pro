# FORM release rules

# Keep the Capacitor bridge and annotations used through reflection.
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep class com.capacitorjs.plugins.** { *; }
-keep class com.harsha.form.** { *; }
-keepattributes *Annotation*, JavascriptInterface

# WebView JavaScript interfaces.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# AndroidX WebKit and appcompat keep their own consumer rules.
-dontwarn org.apache.cordova.**
