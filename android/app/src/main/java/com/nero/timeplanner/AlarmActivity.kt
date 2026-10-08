package com.nero.timeplanner

import android.os.Bundle
import android.os.Vibrator
import android.os.VibrationEffect
import android.os.Build
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class AlarmActivity : AppCompatActivity() {

    private var vibrator: Vibrator? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_alarm)

        val alarmTitle = intent.getStringExtra("ALARM_TITLE") ?: "NERO Alarm"
        
        val tvTitle = findViewById<TextView>(R.id.tvAlarmTitle)
        val tvTime = findViewById<TextView>(R.id.tvAlarmTime)
        val btnStop = findViewById<Button>(R.id.btnStop)
        val btnSnooze = findViewById<Button>(R.id.btnSnooze)

        tvTitle.text = alarmTitle
        tvTime.text = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())

        vibrator = getSystemService(VIBRATOR_SERVICE) as Vibrator
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator?.vibrate(VibrationEffect.createWaveForm(longArrayOf(0, 500, 500), 0))
        } else {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(longArrayOf(0, 500, 500), 0)
        }

        btnStop.setOnClickListener {
            vibrator?.cancel()
            finish()
        }

        btnSnooze.setOnClickListener {
            vibrator?.cancel()
            // Snooze for 10 minutes logic
            finish()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        vibrator?.cancel()
    }
}
