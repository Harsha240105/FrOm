'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const release = process.argv.slice(2).includes('--release');
const args = [release ? 'assembleRelease' : 'assembleDebug'];
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
