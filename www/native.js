(function () {
  var cap = window.Capacitor;
  if (!cap || !cap.isNativePlatform || !cap.isNativePlatform()) return;

  var WAKE_ID = 4001;
  var WORKOUT_ID = 5001;
  var CHANNEL = 'form-alarms';

  function ln() {
    return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
  }

  async function ensurePermission() {
    var plugin = ln();
    if (!plugin) return false;
    var status = await plugin.checkPermissions();
    if (status.display !== 'granted') status = await plugin.requestPermissions();
    if (status.display !== 'granted') {
      alert('Notification permission is required. Enable notifications for FORM in Android Settings.');
      return false;
    }
    return true;
  }

  async function ensureChannel() {
    try {
      await ln().createChannel({
        id: CHANNEL,
        name: 'FORM alarms',
        description: 'Daily wake-up and workout reminders',
        importance: 5,
        visibility: 1,
        vibration: true
      });
    } catch (e) {}
  }

  async function openExactAlarmSettings() {
    try {
      var plugin = ln();
      if (!plugin.checkExactNotificationSetting) return;
      var setting = await plugin.checkExactNotificationSetting();
      if (setting.exact_alarm !== 'granted' && plugin.changeExactNotificationSetting) {
        await plugin.changeExactNotificationSetting();
      }
    } catch (e) {}
  }

  async function scheduleDaily(id, hour, title, body) {
    var plugin = ln();
    if (!plugin) {
      alert('Native notification plugin is not ready.');
      return false;
    }
    if (!(await ensurePermission())) return false;
    await ensureChannel();
    try {
      await plugin.cancel({ notifications: [{ id: id }] });
    } catch (e) {}
    try {
      await plugin.schedule({
        notifications: [{
          id: id,
          title: title,
          body: body,
          channelId: CHANNEL,
          schedule: {
            on: { hour: hour, minute: 0 },
            repeats: true,
            allowWhileIdle: true
          }
        }]
      });
      return true;
    } catch (e) {
      await openExactAlarmSettings();
      alert('Could not schedule the alarm: ' + (e && e.message ? e.message : e));
      return false;
    }
  }

  function hook(id, handler) {
    var el = document.getElementById(id);
    if (el) el.onclick = handler;
  }

  hook('phoneAlarm', async function () {
    if (await scheduleDaily(WAKE_ID, 4, 'FORM · Wake-up', 'Good morning. Your workout is planned for 5:00 AM.')) {
      alert('Daily wake-up alarm scheduled for 4:00 AM, even when FORM is closed.');
    }
  });

  hook('setWakeAlarm', async function () {
    if (await scheduleDaily(WAKE_ID, 4, 'FORM · Wake-up', 'Good morning. Your workout is planned for 5:00 AM.')) {
      alert('Daily wake-up alarm scheduled for 4:00 AM, even when FORM is closed.');
    }
  });

  hook('setWorkoutAlarm', async function () {
    if (await scheduleDaily(WORKOUT_ID, 5, 'FORM · Workout time', 'Your planned workout is ready. Open FORM and start today.')) {
      alert('Daily workout reminder scheduled for 5:00 AM, even when FORM is closed.');
    }
  });

  hook('allowNotifications', async function () {
    if (await ensurePermission()) {
      await ensureChannel();
      alert('Notifications are allowed for FORM.');
    }
  });

  hook('testAlarm', async function () {
    try { beep(); } catch (e) {}
    var plugin = ln();
    if (!plugin) return;
    if (!(await ensurePermission())) return;
    await ensureChannel();
    try {
      await plugin.schedule({
        notifications: [{
          id: 9001,
          title: 'FORM · Test alarm',
          body: 'Native notification and sound are working.',
          channelId: CHANNEL
        }]
      });
    } catch (e) {
      alert('Test notification failed: ' + (e && e.message ? e.message : e));
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) return;
    try {
      var current = dayKey();
      if (window.activeDay !== current) {
        window.activeDay = current;
        renderHome();
        show('home');
      } else {
        live();
        checkWake();
        checkWorkoutAlarm();
      }
    } catch (e) {}
  });
})();
