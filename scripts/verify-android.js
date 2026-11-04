'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const variant = process.env.FORM_APK_VARIANT || 'release';
const apk = process.env.FORM_APK_PATH || path.join(root, 'android', 'app', 'build', 'outputs', 'apk', variant, 'app-release.apk');
const expectedId = String(process.env.FORM_SPOTIFY_CLIENT_ID || '').trim();
if (!/^[0-9a-fA-F]{32}$/.test(expectedId)) throw new Error('FORM_SPOTIFY_CLIENT_ID must be set to verify the APK.');
if (!fs.existsSync(apk)) throw new Error(`APK not found: ${apk}`);

function sdkTool(name) {
  const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk');
  const buildTools = path.join(sdk, 'build-tools');
  const versions = fs.existsSync(buildTools) ? fs.readdirSync(buildTools).sort().reverse() : [];
  for (const version of versions) {
    const names = process.platform === 'win32' ? [`${name}.exe`, `${name}.bat`] : [name];
    for (const candidateName of names) {
      const candidate = path.join(buildTools, version, candidateName);
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  throw new Error(`${name} was not found in the Android SDK.`);
}
function run(tool, args) {
  return execFileSync(tool, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32' && tool.endsWith('.bat')
  });
}

const aapt = sdkTool('aapt');
const resources = run(aapt, ['dump', '--values', 'resources', apk]);
const resourceMatches = [...resources.matchAll(/resource 0x[0-9a-f]+ com\.harsha\.form:string\/spotify_client_id:[\s\S]*?\(string8\) "([^"]*)"/g)];
const resourceMatch = resourceMatches[resourceMatches.length - 1];
if (!resourceMatch || resourceMatch[1] !== expectedId) throw new Error('Compiled spotify_client_id does not match the supplied Client ID.');
const badging = run(aapt, ['dump', 'badging', apk]);
if (!/package: name='com\.harsha\.form' versionCode='9' versionName='7\.0'/.test(badging)) {
  throw new Error('APK package identity or version is incorrect.');
}
const apksigner = sdkTool('apksigner');
const signature = run(apksigner, ['verify', '--verbose', apk]);
if (!/Verifies\s*\r?\n/.test(signature)
    || !/Verified using v1 scheme.*: true/.test(signature)
    || !/Verified using v2 scheme.*: true/.test(signature)) {
  throw new Error('APK signature verification failed.');
}
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update(fs.readFileSync(apk)).digest('hex').toUpperCase();
console.log(`APK verified: ${path.relative(root, apk)}`);
console.log('Compiled Spotify resource: valid');
console.log('Package/version: com.harsha.form 7.0 (9)');
console.log('Signature: verified');
console.log(`SHA-256: ${hash}`);
