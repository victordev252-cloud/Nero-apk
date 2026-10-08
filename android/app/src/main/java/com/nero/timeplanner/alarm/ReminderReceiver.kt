package com.nero.timeplanner.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.nero.timeplanner.notification.NotificationHelper

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val title = intent.getStringExtra("TITLE") ?: "NERO Reminder"
        val body = intent.getStringExtra("BODY") ?: "You have an upcoming event."
        val reminderId = intent.getStringExtra("REMINDER_ID") ?: "0"

        NotificationHelper.showNotification(context, reminderId.hashCode(), title, body)
    }
}
