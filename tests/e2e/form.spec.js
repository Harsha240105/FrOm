const { test, expect } = require('@playwright/test');
const { openApp, completeRepExercise, capture, expectNoErrors, readStorage, STORE, PROFILE, ACTIVE } = require('./helpers');

const TUESDAY = '2026-11-24';
const MONDAY = '2026-11-23';

test('localhost server is reachable', async ({ request, baseURL }) => {
  const response = await request.get(`${baseURL}/`);
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain('<title>FORM</title>');
});

test('fresh profile opens Home with monochrome defaults and creates no record', async ({ page }) => {
  const log = await openApp(page, '2026-11-29T09:00:00', false);
  const profile = await readStorage(page, PROFILE);
  const db = await readStorage(page, STORE);
  expect(profile.scheduleVersion).toBe(4);
  expect(profile.theme).toBe('dark');
  expect(profile.soundOn).toBe(true);
  expect(db).toBe(null);
  await expect(page.locator('#startToday')).toHaveText('START TODAY');
  await capture(page, 'fresh-profile');
  await expectNoErrors(log);
});

test('Monday is rest only, fixed week repeats, and navigation is five monochrome tabs', async ({ page }) => {
  const log = await openApp(page, `${MONDAY}T09:00:00`);
  await expect(page.locator('#planName')).toHaveText('Rest and recovery');
  await expect(page.locator('#countdown')).toHaveText('MONDAY · REST DAY');
  await expect(page.locator('#startToday')).toHaveText('VIEW REST DAY');

  const clock = await page.locator('#liveClock').innerText();
  expect(clock).toMatch(/^\d{1,2}:\d{2}\s?(AM|PM)$/i);
  expect(clock.match(/(AM|PM)/gi)).toHaveLength(1);
  const pill = await page.locator('#openStreak').evaluate(el => ({ whiteSpace: getComputedStyle(el).whiteSpace, lineHeight: getComputedStyle(el).lineHeight }));
  expect(pill.whiteSpace).toBe('nowrap');

  const nav = await page.locator('#bottomNav [data-nav-view]').evaluateAll(buttons => buttons.map(button => button.dataset.navView));
  expect(nav).toEqual(['routine', 'streak', 'home', 'progress', 'settings']);
  expect(await page.locator('[data-nav-view="workout"]').count()).toBe(0);
  expect(await page.locator('[data-nav-view="more"]').count()).toBe(0);

  await page.locator('[data-nav-view="routine"]').click();
  await expect(page.locator('#routineStage')).toHaveText('FIXED WEEK · MONDAY REST');
  await expect(page.locator('#routineList')).toContainText('Standing hip hinge');
  await expect(page.locator('#routineList')).toContainText('Incline push-up');
  const body = (await page.locator('body').innerText()).toLowerCase();
  expect(body.includes('spotify')).toBe(false);
  expect(body.includes('local music')).toBe(false);
  expect(body.includes('make-up')).toBe(false);
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport).toContain('viewport-fit=cover');
  expect(viewport).not.toContain('maximum-scale');
  await capture(page, 'monday-rest-and-plan');
  await expectNoErrors(log);
});

test('completing two exercises leads to the next unfinished exercise', async ({ page }) => {
  const log = await openApp(page, `${TUESDAY}T09:00:00`);
  await page.locator('#startToday').click();
  await completeRepExercise(page, 'Chair-assisted squat');
  await completeRepExercise(page, 'Incline push-up');
  await expect(page.locator('#focusName')).toHaveText('Standing hip hinge');
  await page.locator('#backToWorkout').click();
  await expect(page.locator('[data-id="squat"] button')).toHaveText('COMPLETED');
  await expect(page.locator('[data-id="inclinepush"] button')).toHaveText('COMPLETED');
  await expect(page.locator('[data-id="hinge"] button')).toHaveText('CONTINUE');
  const db = await readStorage(page, STORE);
  expect(db[TUESDAY].done).toEqual(['squat', 'inclinepush']);
  await capture(page, 'two-exercises-complete');
  await expectNoErrors(log);
});

test('card Continue, Home Continue, refresh, and repeated clicks keep one session', async ({ page }) => {
  const startedAt = `${TUESDAY}T08:00:00`;
  const doneEvent = {
    startedAt,
    endedAt: startedAt,
    setsCompleted: 1,
    setLogs: [{ set: 1, startedAt, endedAt: startedAt, reps: 8, seconds: 0 }]
  };
  const db = {
    [TUESDAY]: {
      sessionId: 'session-1',
      sessionStart: startedAt,
      sessionEnd: null,
      done: ['squat'],
      events: { squat: doneEvent },
      status: 'in-progress',
      planSnapshot: { title: 'Full-body strength + core', time: 'Any time', mins: 34, ids: ['squat', 'inclinepush', 'hinge', 'bridge', 'lunge', 'plank', 'deadbug'], stage: 1 }
    }
  };
  const active = {
    id: 'inclinepush',
    sessionId: 'session-1',
    exerciseId: 'inclinepush',
    day: TUESDAY,
    weekStart: MONDAY,
    planKey: 'fixed-week',
    positionIndex: 1,
    mode: 'exercise',
    status: 'in-progress',
    startedAt,
    updatedAt: Date.parse(startedAt),
    at: Date.parse(startedAt)
  };
  const log = await openApp(page, `${TUESDAY}T09:00:00`, true, { db, active });
  await expect(page.locator('#startToday')).toHaveText('CONTINUE WORKOUT');
  await page.locator('#startToday').click();
  await expect(page.locator('#focusName')).toHaveText('Incline push-up');
  let savedActive = await readStorage(page, ACTIVE);
  expect(savedActive.sessionId).toBe('session-1');
  expect(savedActive.exerciseId).toBe('inclinepush');

  await page.locator('#backToWorkout').click();
  await page.locator('[data-nav-view="home"]').click();
  await page.locator('#startToday').click();
  await expect(page.locator('#focusName')).toHaveText('Incline push-up');

  await page.locator('#backToWorkout').click();
  await page.locator('[data-nav-view="home"]').click();
  await page.locator('#startToday').click();
  await expect(page.locator('#focusName')).toHaveText('Incline push-up');

  await page.reload();
  await expect(page.locator('#focusName')).toHaveText('Incline push-up');

  await completeRepExercise(page, 'Incline push-up');
  await expect(page.locator('#focusName')).toHaveText('Standing hip hinge');
  await page.locator('#backToWorkout').click();
  await expect(page.locator('[data-id="hinge"] button')).toHaveText('CONTINUE');
  await page.locator('[data-id="hinge"] button').click();
  await expect(page.locator('#focusName')).toHaveText('Standing hip hinge');

  const finalDb = await readStorage(page, STORE);
  const finalActive = await readStorage(page, ACTIVE);
  expect(finalDb[TUESDAY].sessionStart).toBe(startedAt);
  expect(finalDb[TUESDAY].sessionId).toBe('session-1');
  expect(finalActive.exerciseId).toBe('hinge');
  expect(finalActive.sessionId).toBe('session-1');
  await capture(page, 'continue-session');
  await expectNoErrors(log);
});

test('Settings holds moved sections, canonical reference, theme, and sound controls', async ({ page }) => {
  const log = await openApp(page, `${TUESDAY}T09:00:00`);
  await page.locator('[data-nav-view="settings"]').click();
  await expect(page.locator('#settingsRecovery')).toBeVisible();
  await expect(page.locator('#settingsNutrition')).toBeVisible();
  await expect(page.locator('#settingsVault')).toBeVisible();
  await expect(page.locator('#settingsBackup')).toBeVisible();
  await expect(page.locator('#settingsAbout')).toBeVisible();
  await expect(page.locator('#settingsExerciseReference')).toContainText('Full-body strength + core');
  await expect(page.locator('#settingsExerciseReference')).toContainText('Chair-assisted squat');

  await page.locator('#themeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  let profile = await readStorage(page, PROFILE);
  expect(profile.theme).toBe('light');

  await page.locator('#soundToggle').click();
  profile = await readStorage(page, PROFILE);
  expect(profile.soundOn).toBe(false);
  await capture(page, 'settings-light-mode');
  await expectNoErrors(log);
});
