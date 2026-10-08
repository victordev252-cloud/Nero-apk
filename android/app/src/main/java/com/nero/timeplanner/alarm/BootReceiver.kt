package com.nero.timeplanner.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.nero.timeplanner.db.DatabaseHelper
import org.json.JSONArray
import java.text.SimpleDateFormat
import java.util.Locale

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == Intent.ACTION_MY_PACKAGE_REPLACED) {
            
            val db = DatabaseHelper(context)
            val nowMillis = System.currentTimeMillis()
            val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault())

            // Reschedule active alarms
            val alarmsJson = db.queryJson("SELECT * FROM alarms WHERE enabled = 1")
            val alarms = JSONArray(alarmsJson)
            for (i in 0 until alarms.length()) {
                val alarm = alarms.getJSONObject(i)
                val id = alarm.getString("id")
                val title = alarm.getString("title")
                val time = alarm.getString("time") // HH:mm
                
                val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(nowMillis)
                val dateStr = "$todayStr $time"
                var alarmTimeMillis = sdf.parse(dateStr)?.time ?: continue
                if (alarmTimeMillis < nowMillis) {
                    alarmTimeMillis += 86400000L // Next day
                }
                AlarmScheduler.scheduleAlarm(context, id, alarmTimeMillis, title)
            }
        }
    }
}
