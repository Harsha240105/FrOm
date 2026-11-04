'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const release = process.argv.slice(2).includes('--release');
const clientId = String(process.env.FORM_SPOTIFY_CLIENT_ID || '').trim();
const allowUnconfigured = String(process.env.FORM_ALLOW_UNCONFIGURED_SPOTIFY || '').toLowerCase() === 'true';
if (!/^[0-9a-fA-F]{32}$/.test(clientId) && (!allowUnconfigured || release)) {
  console.error('A valid FORM_SPOTIFY_CLIENT_ID is required. Set it in this shell before building.');
  process.exit(1);
}
console.log(`Spotify Client ID supplied: ${/^[0-9a-fA-F]{32}$/.test(clientId) ? 'yes' : 'no (explicit debug-disabled mode)'}`);

const args = [release ? 'assembleRelease' : 'assembleDebug'];
if (clientId) args.push(`-PFORM_SPOTIFY_CLIENT_ID=${clientId}`);
if (!clientId && allowUnconfigured) args.push('-PFORM_ALLOW_UNCONFIGURED_SPOTIFY=true');
const isWindows = process.platform === 'win32';
const command = isWindows ? 'gradlew.bat' : 'bash';
const commandArgs = isWindows ? args : ['./gradlew', ...args];
const result = spawnSync(command, commandArgs, {
  cwd: path.resolve(__dirname, '..', 'android'),
  stdio: 'inherit',
  shell: isWindows
});
if (result.error) {
  console.error(`Android build could not start: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status === null ? 1 : result.status);
