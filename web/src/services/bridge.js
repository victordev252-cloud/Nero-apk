// Local fallback memory db for web browser preview testing
class LocalFallbackDB {
  constructor() {
    this.tasks = [
      { id: 't1', title: 'Complete Project Blueprint', description: 'Finalize NERO v3.1 Kotlin code', due_date: '2026-10-08', due_time: '16:00', priority: 'HIGH', category_id: 'cat_1', completed: 0, reminder_minutes: 15, repeat_type: 'NONE' },
      { id: 't2', title: 'Evening Workout', description: '30 mins Cardio', due_date: '2026-10-08', due_time: '18:30', priority: 'MEDIUM', category_id: 'cat_6', completed: 1, reminder_minutes: 10, repeat_type: 'DAILY' }
    ];
    this.appointments = [
      { id: 'a1', title: 'Doctor Appointment', description: 'Routine checkup', start_time: '2026-10-10 16:00', end_time: '2026-10-10 17:00', location: 'City Clinic', category_id: 'cat_4', priority: 'URGENT', status: 'UPCOMING' }
    ];
    this.alarms = [
      { id: 'al1', title: 'Morning Wakeup', time: '06:30', repeat_days: '1,2,3,4,5', enabled: 1 }
    ];
    this.goals = [
      { id: 'g1', title: 'Read 20 pages', category_id: 'cat_2', target: 20, progress: 14, deadline: '2026-10-31', period: 'DAILY', status: 'ACTIVE' }
    ];
    this.categories = [
      { id: 'cat_1', name: 'Work', color: '#7C5CFC', icon: 'briefcase' },
      { id: 'cat_2', name: 'Study', color: '#3B82F6', icon: 'book' },
      { id: 'cat_3', name: 'Personal', color: '#10B981', icon: 'user' },
      { id: 'cat_4', name: 'Health', color: '#EF4444', icon: 'heart' },
      { id: 'cat_5', name: 'Family', color: '#F59E0B', icon: 'home' },
      { id: 'cat_6', name: 'Exercise', color: '#8B5CF6', icon: 'activity' }
    ];
    this.notifications = [
      { id: 'n1', title: 'Meeting Reminder', body: 'Team sync in 15 mins', type: 'REMINDER', timestamp: '2026-10-08 10:15', read: 0 }
    ];
    this.settings = { user_name: 'Victor', theme: 'dark', language: 'en' };
  }

  query(sql) {
    const lower = sql.toLowerCase();
    if (lower.includes('from tasks')) return this.tasks;
    if (lower.includes('from appointments')) return this.appointments;
    if (lower.includes('from alarms')) return this.alarms;
    if (lower.includes('from goals')) return this.goals;
    if (lower.includes('from categories')) return this.categories;
    if (lower.includes('from notifications')) return this.notifications;
    if (lower.includes('from settings')) return [this.settings];
    return [];
  }
}

const fallbackDB = new LocalFallbackDB();

export const bridge = {
  isNative: () => typeof window.NeroAndroid !== 'undefined',

  query: (sql, args = null) => {
    if (bridge.isNative()) {
      const res = window.NeroAndroid.executeQuery(sql, JSON.stringify(args));
      return JSON.parse(res);
    }
    return fallbackDB.query(sql);
  },

  execute: (sql, args = null) => {
    if (bridge.isNative()) {
      return window.NeroAndroid.executeUpdate(sql, JSON.stringify(args));
    }
    return true;
  },

  scheduleAlarm: (id, timeMillis, title) => {
    if (bridge.isNative()) {
      window.NeroAndroid.scheduleNativeAlarm(id, timeMillis, title);
    } else {
      console.log(`[Web Fallback] Alarm scheduled: ${title} at ${new Date(timeMillis)}`);
    }
  },

  scheduleReminder: (id, timeMillis, title, body) => {
    if (bridge.isNative()) {
      window.NeroAndroid.scheduleNativeReminder(id, timeMillis, title, body);
    } else {
      console.log(`[Web Fallback] Reminder scheduled: ${title} - ${body}`);
    }
  },

  cancelSchedule: (id) => {
    if (bridge.isNative()) {
      window.NeroAndroid.cancelNativeSchedule(id);
    }
  }
};
