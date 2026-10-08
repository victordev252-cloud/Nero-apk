package com.nero.timeplanner.bridge

import android.content.Context
import android.webkit.JavascriptInterface
import com.nero.timeplanner.alarm.AlarmScheduler
import com.nero.timeplanner.db.DatabaseHelper
import org.json.JSONObject

class NeroBridge(private val context: Context, private val db: DatabaseHelper) {

    @JavascriptInterface
    fun executeQuery(sql: String, argsJson: String?): String {
        return try {
            val args = if (!argsJson.isNullOrEmpty() && argsJson != "null") {
                val jsonArr = org.json.JSONArray(argsJson)
                Array(jsonArr.length()) { i -> jsonArr.getString(i) }
            } else null
            db.queryJson(sql, args)
        } catch (e: Exception) {
            e.printStackTrace()
            "[]"
        }
    }

    @JavascriptInterface
    fun executeUpdate(sql: String, argsJson: String?): Boolean {
        return try {
            val args = if (!argsJson.isNullOrEmpty() && argsJson != "null") {
                val jsonArr = org.json.JSONArray(argsJson)
                Array(jsonArr.length()) { i -> jsonArr.get(i) }
            } else null
            db.executeSql(sql, args)
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    @JavascriptInterface
    fun scheduleNativeAlarm(id: String, timeMillis: Long, title: String) {
        AlarmScheduler.scheduleAlarm(context, id, timeMillis, title)
    }

    @JavascriptInterface
    fun scheduleNativeReminder(id: String, timeMillis: Long, title: String, body: String) {
        AlarmScheduler.scheduleReminder(context, id, timeMillis, title, body)
    }

    @JavascriptInterface
    fun cancelNativeSchedule(id: String) {
        AlarmScheduler.cancelSchedule(context, id)
    }

    @JavascriptInterface
    fun getDeviceInfo(): String {
        val obj = JSONObject()
        obj.put("platform", "Android")
        obj.put("version", "3.1.0")
        obj.put("sdk", android.os.Build.VERSION.SDK_INT)
        return obj.toString()
    }
}
