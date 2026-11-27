const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 390, height: 844 },
    ...devices['Pixel 5']
  },
  webServer: {
    command: 'node scripts/serve-web.js',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: true,
    timeout: 30000,
    env: { PORT: '4173' }
  },
  projects: [{ name: 'chromium', use: { ...devices['Pixel 5'], browserName: 'chromium' } }]
});
