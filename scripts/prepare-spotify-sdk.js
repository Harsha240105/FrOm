'use strict';

const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const path = require('path');

const fileName = 'spotify-app-remote-release-0.8.0.aar';
const destination = path.resolve(__dirname, '..', 'android', 'app', 'libs', fileName);
const url = 'https://github.com/spotify/android-sdk/releases/download/v0.8.0-appremote_v2.1.0-auth/' + fileName;
const expectedSha256 = 'B5A6DD880EAF01F63A871CBA9EF7AF77C341F8A94FFC8FDF2E9021F9A9D4C198';

function checksum(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function download(target) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        return downloadTo(response.headers.location, target).then(resolve, reject);
      }
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Spotify SDK download failed with HTTP ${response.statusCode}.`));
        return;
      }
      const output = fs.createWriteStream(target);
      response.pipe(output);
      output.on('finish', () => output.close(resolve));
      output.on('error', reject);
    });
    request.on('error', reject);
  });
}

function downloadTo(location, target) {
  return new Promise((resolve, reject) => {
    https.get(location, response => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Spotify SDK download failed with HTTP ${response.statusCode}.`));
        return;
      }
      const output = fs.createWriteStream(target);
      response.pipe(output);
      output.on('finish', () => output.close(resolve));
      output.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (!fs.existsSync(destination) || checksum(destination) !== expectedSha256) {
    const temporary = `${destination}.download`;
    try {
      await download(temporary);
      if (checksum(temporary) !== expectedSha256) {
        throw new Error('Downloaded Spotify SDK checksum does not match the pinned official artifact.');
      }
      fs.renameSync(temporary, destination);
    } finally {
      if (fs.existsSync(temporary)) fs.rmSync(temporary);
    }
  }
  if (checksum(destination) !== expectedSha256) {
    throw new Error('Spotify App Remote SDK is missing or has an unexpected checksum.');
  }
  console.log('Spotify App Remote SDK verified: official v0.8.0 artifact');
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
