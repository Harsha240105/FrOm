package com.harsha.form;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.spotify.android.appremote.api.ConnectionParams;
import com.spotify.android.appremote.api.Connector;
import com.spotify.android.appremote.api.SpotifyAppRemote;
import com.spotify.android.appremote.api.error.AuthenticationFailedException;
import com.spotify.android.appremote.api.error.CouldNotFindSpotifyApp;
import com.spotify.android.appremote.api.error.NotLoggedInException;
import com.spotify.android.appremote.api.error.SpotifyDisconnectedException;
import com.spotify.protocol.client.Subscription;
import com.spotify.protocol.types.PlayerState;

@CapacitorPlugin(name = "Spotify")
public class SpotifyPlugin extends Plugin {

    private static final String REDIRECT_URI = "formspotify://callback";

    private SpotifyAppRemote remote;
    private Subscription<PlayerState> playerStateSubscription;
    private boolean connecting;
    private boolean playing;
    private String track = "";
    private String artist = "";

    private String clientId() {
        try {
            String value = getContext().getString(R.string.spotify_client_id);
            return value == null ? "" : value.trim();
        } catch (Exception e) {
            return "";
        }
    }

    private boolean installed() {
        try {
            return SpotifyAppRemote.isSpotifyInstalled(getContext());
        } catch (Exception e) {
            return false;
        }
    }

    private JSObject state(String status) {
        JSObject result = new JSObject();
        result.put("available", true);
        result.put("configured", !clientId().isEmpty());
        result.put("installed", installed());
        result.put("connected", remote != null && remote.isConnected());
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
        if (clientId().isEmpty()) {
            call.resolve(state("unconfigured"));
            return;
        }
        if (!installed()) {
            call.resolve(state("not_installed"));
            return;
        }
        if (remote != null && remote.isConnected()) {
            subscribeToPlayerState();
            call.resolve(state("connected"));
            return;
        }
        if (connecting) {
            call.resolve(state("connecting"));
            return;
        }
        connecting = true;
        ConnectionParams params = new ConnectionParams.Builder(clientId())
                .setRedirectUri(REDIRECT_URI)
                .showAuthView(true)
                .build();
        try {
            SpotifyAppRemote.connect(getActivity(), params, new Connector.ConnectionListener() {
                @Override
                public void onConnected(SpotifyAppRemote spotifyAppRemote) {
                    connecting = false;
                    remote = spotifyAppRemote;
                    subscribeToPlayerState();
                    call.resolve(state("connected"));
                    notifyListeners("authResult", state("connected"));
                    notifyState();
                }

                @Override
                public void onFailure(Throwable error) {
                    connecting = false;
                    remote = null;
                    String status = errorStatus(error);
                    call.resolve(state(status));
                    notifyListeners("authResult", state(status));
                    notifyState();
                }
            });
        } catch (Exception e) {
            connecting = false;
            call.resolve(state("error"));
        }
    }

    @PluginMethod
    public void disconnect(PluginCall call) {
        disconnectRemote();
        call.resolve(state("disconnected"));
        notifyState();
    }

    @PluginMethod
    public void play(PluginCall call) {
        if (!hasRemote(call)) return;
        String uri = call.getString("uri", "");
        if (uri != null && !uri.trim().isEmpty()) {
            remote.getPlayerApi().play(uri.trim())
                    .setResultCallback(empty -> {
                        notifyState();
                        call.resolve(state("playing"));
                    })
                    .setErrorCallback(error -> {
                        notifyState();
                        call.resolve(state("error"));
                    });
            return;
        }
        remote.getPlayerApi().resume()
                .setResultCallback(empty -> {
                    notifyState();
                    call.resolve(state("playing"));
                })
                .setErrorCallback(error -> {
                    notifyState();
                    call.resolve(state("error"));
                });
    }

    @PluginMethod
    public void pause(PluginCall call) {
        if (!hasRemote(call)) return;
        remote.getPlayerApi().pause()
                .setResultCallback(empty -> {
                    notifyState();
                    call.resolve(state("paused"));
                })
                .setErrorCallback(error -> {
                    notifyState();
                    call.resolve(state("error"));
                });
    }

    @PluginMethod
    public void next(PluginCall call) {
        if (!hasRemote(call)) return;
        remote.getPlayerApi().skipNext()
                .setResultCallback(empty -> {
                    notifyState();
                    call.resolve(state("next"));
                })
                .setErrorCallback(error -> {
                    notifyState();
                    call.resolve(state("error"));
                });
    }

    @PluginMethod
    public void previous(PluginCall call) {
        if (!hasRemote(call)) return;
        remote.getPlayerApi().skipPrevious()
                .setResultCallback(empty -> {
                    notifyState();
                    call.resolve(state("previous"));
                })
                .setErrorCallback(error -> {
                    notifyState();
                    call.resolve(state("error"));
                });
    }

    private boolean hasRemote(PluginCall call) {
        if (remote != null && remote.isConnected()) return true;
        call.resolve(state("disconnected"));
        return false;
    }

    private void subscribeToPlayerState() {
        if (remote == null) return;
        if (playerStateSubscription != null && !playerStateSubscription.isCanceled()) {
            playerStateSubscription.cancel();
        }
        Subscription<PlayerState> subscription = remote.getPlayerApi().subscribeToPlayerState();
        subscription.setEventCallback(playerState -> {
            updateFromPlayerState(playerState);
            notifyState();
        });
        subscription.setErrorCallback(error -> {
            playing = false;
            notifyState();
        });
        playerStateSubscription = subscription;
    }

    private void updateFromPlayerState(PlayerState playerState) {
        if (playerState == null) return;
        playing = !playerState.isPaused;
        if (playerState.track != null) {
            track = playerState.track.name == null ? "" : playerState.track.name;
            artist = playerState.track.artist == null || playerState.track.artist.name == null
                    ? ""
                    : playerState.track.artist.name;
        } else {
            track = "";
            artist = "";
        }
    }

    private String errorStatus(Throwable error) {
        if (error instanceof CouldNotFindSpotifyApp) return "not_installed";
        if (error instanceof AuthenticationFailedException) return "auth_failed";
        if (error instanceof NotLoggedInException) return "not_logged_in";
        if (error instanceof SpotifyDisconnectedException) return "disconnected";
        return "error";
    }

    private void disconnectRemote() {
        if (playerStateSubscription != null) {
            if (!playerStateSubscription.isCanceled()) playerStateSubscription.cancel();
            playerStateSubscription = null;
        }
        if (remote != null) {
            SpotifyAppRemote.disconnect(remote);
            remote = null;
        }
        connecting = false;
        playing = false;
        track = "";
        artist = "";
    }

    @Override
    protected void handleOnDestroy() {
        disconnectRemote();
        super.handleOnDestroy();
    }
}
