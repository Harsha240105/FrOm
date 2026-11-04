package com.harsha.form;

import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.net.Uri;
import android.os.Build;
import android.util.Base64;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "Spotify")
public class SpotifyPlugin extends Plugin {

    private static final String TAG = "FORM_Spotify";
    private static final String REDIRECT_URI = "formspotify://callback";
    private static final String AUTHORIZE_URI = "https://accounts.spotify.com/authorize";
    private static final String TOKEN_URI = "https://accounts.spotify.com/api/token";
    private static final String API_URI = "https://api.spotify.com/v1";
    private static final String SCOPES = "user-read-playback-state user-modify-playback-state";
    private static SpotifyPlugin activePlugin;

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private String accessToken = "";
    private long tokenExpiresAt;
    private String pendingState = "";
    private String codeVerifier = "";
    private PluginCall pendingConnectCall;
    private boolean playing;
    private String track = "";
    private String artist = "";

    @Override
    public void load() {
        super.load();
        activePlugin = this;
    }

    private String clientId() {
        try {
            String value = getContext().getString(R.string.spotify_client_id);
            String trimmed = value == null ? "" : value.trim();
            return trimmed.matches("[0-9a-fA-F]{32}") ? trimmed : "";
        } catch (Exception e) {
            return "";
        }
    }

    private boolean installed() {
        try {
            return getContext().getPackageManager().getPackageInfo("com.spotify.music", 0) != null;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean connected() {
        return !accessToken.isEmpty() && System.currentTimeMillis() < tokenExpiresAt;
    }

    private JSObject state(String status) {
        JSObject result = new JSObject();
        try {
            android.content.pm.PackageInfo packageInfo = getContext().getPackageManager()
                    .getPackageInfo(getContext().getPackageName(), 0);
            result.put("versionName", packageInfo.versionName);
            result.put("versionCode", Build.VERSION.SDK_INT >= Build.VERSION_CODES.P
                    ? packageInfo.getLongVersionCode() : packageInfo.versionCode);
        } catch (Exception e) {
            result.put("versionName", "");
            result.put("versionCode", 0);
        }
        result.put("buildType", (getContext().getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0 ? "debug" : "release");
        result.put("nativePluginAvailable", true);
        result.put("available", true);
        result.put("configured", !clientId().isEmpty());
        result.put("installed", installed());
        result.put("connected", connected());
        result.put("playing", playing);
        result.put("track", track);
        result.put("artist", artist);
        if (status != null) result.put("status", status);
        return result;
    }

    private void notifyState() {
        notifyListeners("stateChanged", state(null));
    }

    @PluginMethod
    public void getState(PluginCall call) {
        call.resolve(state(null));
    }

    @PluginMethod
    public void connect(PluginCall call) {
        String id = clientId();
        if (id.isEmpty()) {
            call.resolve(state("unconfigured"));
            return;
        }
        if (pendingConnectCall != null) {
            call.resolve(state("connecting"));
            return;
        }
        try {
            SecureRandom random = new SecureRandom();
            byte[] verifierBytes = new byte[32];
            random.nextBytes(verifierBytes);
            codeVerifier = base64Url(verifierBytes);
            pendingState = codeVerifier.substring(0, 24);
            String challenge = base64Url(MessageDigest.getInstance("SHA-256")
                    .digest(codeVerifier.getBytes(StandardCharsets.US_ASCII)));
            Uri authorization = Uri.parse(AUTHORIZE_URI).buildUpon()
                    .appendQueryParameter("client_id", id)
                    .appendQueryParameter("response_type", "code")
                    .appendQueryParameter("redirect_uri", REDIRECT_URI)
                    .appendQueryParameter("scope", SCOPES)
                    .appendQueryParameter("code_challenge_method", "S256")
                    .appendQueryParameter("code_challenge", challenge)
                    .appendQueryParameter("state", pendingState)
                    .build();
            pendingConnectCall = call;
            getActivity().startActivity(new Intent(Intent.ACTION_VIEW, authorization));
        } catch (Exception e) {
            pendingConnectCall = null;
            call.resolve(state("error"));
        }
    }

    public static void handleRedirectIntent(Intent intent) {
        if (activePlugin == null || intent == null) return;
        Uri uri = intent.getData();
        if (uri != null && "formspotify".equals(uri.getScheme())
                && "callback".equals(uri.getHost())) {
            activePlugin.handleRedirect(uri);
        }
    }

    private void handleRedirect(Uri uri) {
        String error = uri.getQueryParameter("error");
        String returnedState = uri.getQueryParameter("state");
        String code = uri.getQueryParameter("code");
        if (error != null || code == null || !pendingState.equals(returnedState)) {
            finishConnect("auth_failed");
            return;
        }
        final String verifier = codeVerifier;
        executor.execute(() -> {
            try {
                JSONObject token = postForm(TOKEN_URI,
                        "grant_type=authorization_code"
                                + "&code=" + encode(code)
                                + "&redirect_uri=" + encode(REDIRECT_URI)
                                + "&client_id=" + encode(clientId())
                                + "&code_verifier=" + encode(verifier));
                String tokenValue = token.optString("access_token", "");
                if (tokenValue.isEmpty()) {
                    finishConnect("auth_failed");
                    return;
                }
                accessToken = tokenValue;
                tokenExpiresAt = System.currentTimeMillis()
                        + (token.optLong("expires_in", 3600) * 1000L) - 30000L;
                finishConnect("connected");
                refreshPlayerState();
            } catch (Exception e) {
                finishConnect("auth_failed");
            }
        });
    }

    private void finishConnect(String status) {
        getActivity().runOnUiThread(() -> {
            PluginCall call = pendingConnectCall;
            pendingConnectCall = null;
            if (call != null) call.resolve(state(status));
            notifyListeners("authResult", state(status));
            notifyState();
        });
    }

    @PluginMethod
    public void disconnect(PluginCall call) {
        accessToken = "";
        tokenExpiresAt = 0;
        playing = false;
        track = "";
        artist = "";
        call.resolve(state("disconnected"));
        notifyState();
    }

    @PluginMethod
    public void play(PluginCall call) {
        String uri = call.getString("uri", "");
        requestPlayer(call, "PUT", "/me/player/play",
                uri == null || uri.trim().isEmpty() ? "{}"
                        : "{\"context_uri\":\"" + jsonEscape(uri.trim()) + "\"}", "playing");
    }

    @PluginMethod
    public void pause(PluginCall call) {
        requestPlayer(call, "PUT", "/me/player/pause", null, "paused");
    }

    @PluginMethod
    public void next(PluginCall call) {
        requestPlayer(call, "POST", "/me/player/next", null, "next");
    }

    @PluginMethod
    public void previous(PluginCall call) {
        requestPlayer(call, "POST", "/me/player/previous", null, "previous");
    }

    private void requestPlayer(PluginCall call, String method, String path, String body, String success) {
        if (!connected()) {
            call.resolve(state("disconnected"));
            return;
        }
        executor.execute(() -> {
            try {
                apiRequest(method, path, body);
                if ("playing".equals(success)) playing = true;
                if ("paused".equals(success)) playing = false;
                refreshPlayerState();
                getActivity().runOnUiThread(() -> call.resolve(state(success)));
            } catch (Exception e) {
                getActivity().runOnUiThread(() -> call.resolve(state(e.getMessage() != null
                        && e.getMessage().contains("401") ? "auth_failed" : "error")));
            }
        });
    }

    private void refreshPlayerState() {
        try {
            JSONObject player = apiRequest("GET", "/me/player", null);
            playing = player.optBoolean("is_playing", false);
            JSONObject item = player.optJSONObject("item");
            if (item != null) {
                track = item.optString("name", "");
                JSONObject artists = item.optJSONArray("artists") == null ? null
                        : item.optJSONArray("artists").optJSONObject(0);
                artist = artists == null ? "" : artists.optString("name", "");
            }
            getActivity().runOnUiThread(this::notifyState);
        } catch (Exception ignored) {
            // A 204 response means there is no active Spotify player.
        }
    }

    private JSONObject apiRequest(String method, String path, String body) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(API_URI + path).openConnection();
        connection.setRequestMethod(method);
        connection.setRequestProperty("Authorization", "Bearer " + accessToken);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setConnectTimeout(15000);
        connection.setReadTimeout(15000);
        if (body != null) {
            connection.setDoOutput(true);
            try (OutputStream output = connection.getOutputStream()) {
                output.write(body.getBytes(StandardCharsets.UTF_8));
            }
        }
        int responseCode = connection.getResponseCode();
        if (responseCode == 204) return new JSONObject();
        String response = read(connection, responseCode >= 400);
        if (responseCode >= 400) throw new Exception(String.valueOf(responseCode));
        return response.isEmpty() ? new JSONObject() : new JSONObject(response);
    }

    private JSONObject postForm(String endpoint, String body) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(endpoint).openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        connection.setDoOutput(true);
        try (OutputStream output = connection.getOutputStream()) {
            output.write(body.getBytes(StandardCharsets.UTF_8));
        }
        int responseCode = connection.getResponseCode();
        String response = read(connection, responseCode >= 400);
        if (responseCode >= 400) throw new Exception(String.valueOf(responseCode));
        return new JSONObject(response);
    }

    private String read(HttpURLConnection connection, boolean error) throws Exception {
        InputStream stream = error ? connection.getErrorStream() : connection.getInputStream();
        if (stream == null) return "";
        StringBuilder result = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) result.append(line);
        }
        return result.toString();
    }

    private static String base64Url(byte[] value) {
        return Base64.encodeToString(value, Base64.NO_WRAP | Base64.URL_SAFE | Base64.NO_PADDING);
    }

    private static String encode(String value) throws Exception {
        return URLEncoder.encode(value, StandardCharsets.UTF_8.name());
    }

    private static String jsonEscape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    @Override
    protected void handleOnDestroy() {
        if (activePlugin == this) activePlugin = null;
        executor.shutdownNow();
        super.handleOnDestroy();
    }
}
