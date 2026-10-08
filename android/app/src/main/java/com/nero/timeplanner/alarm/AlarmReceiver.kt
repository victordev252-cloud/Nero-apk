package com.nero.timeplanner.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.nero.timeplanner.AlarmActivity

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val alarmId = intent.getStringExtra("ALARM_ID") ?: ""
        val alarmTitle = intent.getStringExtra("ALARM_TITLE") ?: "NERO Alarm"

        val fullScreenIntent = Intent(context, AlarmActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("ALARM_ID", alarmId)
            putExtra("ALARM_TITLE", alarmTitle)
        }
        context.startActivity(fullScreenIntent)
    }
}
