'use strict';

const assert = require('assert');
const fs = require('fs');

const plugin = fs.readFileSync(
  'android/app/src/main/java/com/harsha/form/SpotifyPlugin.java',
  'utf8'
);
const app = fs.readFileSync('www/app.js', 'utf8');

assert(plugin.includes('"/me/player/devices"'), 'device discovery endpoint is required');
assert(plugin.includes('candidate.active'), 'active devices must be preferred');
assert(plugin.includes('candidate.restricted'), 'restricted devices must be excluded');
assert(plugin.includes('String targetPath = path + "?device_id="'), 'controls must target a device');
assert(plugin.includes('context_uri'), 'playlist playback must use context_uri');
assert(plugin.includes('"no_device"'), 'missing devices need a distinct status');
assert(plugin.includes('"restricted_device"'), 'restricted devices need a distinct status');
assert(plugin.includes('SpotifyApiException'), 'Spotify API errors must be represented safely');
assert(!plugin.includes('Log.d(TAG, accessToken)'), 'access tokens must not be logged');
assert(app.includes('deviceAvailable'), 'UI must expose device availability separately');
assert(app.includes('No active playback'), 'UI must not label missing playback as disconnected');
assert(app.includes('restricted_device'), 'UI must explain restricted-device failures');

console.log('Spotify playback contract tests passed.');
