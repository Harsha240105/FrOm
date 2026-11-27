const fs = require('fs');
const path = require('path');
const { expect } = require('@playwright/test');

const STORE = 'FORM_MONOCHROME_LOG_V1';
const PROFILE = 'FORM_PROFILE_V1';
const ACTIVE = 'FORM_ACTIVE_V1';

async function openApp(page, dateIso, seeded = true, data = {}) {
  const errors = [];
  const failed = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('requestfailed', request => {
    failed.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`);
  });
  await page.clock.install({ time: new Date(dateIso) });
  if (seeded) {
    const profile = {
      dayOne: '2026-11-23',
      v2Start: '2026-11-23',
      stage: 1,
      stageStartedAt: '2026-11-23',
      stageHistory: [{ stage: 1, startedAt: '2026-11-23' }],
      makeup: {},
      weightKg: 72,
      weightHistory: {},
      heightCm: 175,
      wristCm: 17,
      bodyTypeSex: 'male',
      bodyType: null,
      waterGoal: 2000,
      proteinGoal: 60,
      fixedStartDate: '2026-11-23',
      scheduleVersion: 3,
      ...(data.profile || {})
    };
    await page.addInitScript(({ store, profileKey, activeKey, profileData, dbData, activeData }) => {
      localStorage.setItem(profileKey, JSON.stringify(profileData));
      localStorage.setItem(store, JSON.stringify(dbData));
      if (activeData) localStorage.setItem(activeKey, JSON.stringify(activeData));
    }, { store: STORE, profileKey: PROFILE, activeKey: ACTIVE, profileData: profile, dbData: data.db || {}, activeData: data.active || null });
  }
  await page.goto('/');
  await expect(page.locator('.view.active')).toBeVisible();
  if (data.active) {
    await page.locator('[data-nav-view="home"]').click();
    await expect(page.locator('#home')).toHaveClass(/active/);
  } else {
    await expect(page.locator('#home')).toHaveClass(/active/);
  }
  return { errors, failed };
}

async function completeRepExercise(page, name) {
  await expect(page.locator('#focusName')).toHaveText(name);
  const text = await page.locator('#repValue').textContent();
  const target = Number(text.split('/')[1].trim());
  for (let i = 0; i < target; i += 1) await page.locator('#repPlus').click();
  await page.locator('#exerciseAction').click();
  await expect(page.locator('#restPanel')).toBeVisible();
  await page.locator('#skipRest').click();
  await page.locator('#continueAfterRest').click();
}

async function capture(page, name) {
  const dir = path.resolve('test-results', 'screenshots');
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true });
}

async function expectNoErrors(log) {
  expect(log.errors).toEqual([]);
  expect(log.failed).toEqual([]);
}

async function readStorage(page, key) {
  return page.evaluate(storageKey => JSON.parse(localStorage.getItem(storageKey) || 'null'), key);
}

module.exports = { openApp, completeRepExercise, capture, expectNoErrors, readStorage, STORE, PROFILE, ACTIVE };
