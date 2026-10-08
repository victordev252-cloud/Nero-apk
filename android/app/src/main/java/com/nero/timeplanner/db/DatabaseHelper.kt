package com.nero.timeplanner.db

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import org.json.JSONArray
import org.json.JSONObject

class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "nero.db"
        private const val DATABASE_VERSION = 1
    }

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL("""
            CREATE TABLE settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        """)

        db.execSQL("""
            CREATE TABLE categories (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                color TEXT NOT NULL,
                icon TEXT NOT NULL
            )
        """)

        db.execSQL("""
            CREATE TABLE tasks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                due_date TEXT NOT NULL,
                due_time TEXT,
                priority TEXT NOT NULL DEFAULT 'MEDIUM',
                category_id TEXT,
                completed INTEGER NOT NULL DEFAULT 0,
                reminder_minutes INTEGER DEFAULT 0,
                repeat_type TEXT DEFAULT 'NONE',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        """)

        db.execSQL("""
            CREATE TABLE appointments (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                location TEXT,
                category_id TEXT,
                priority TEXT DEFAULT 'MEDIUM',
                reminder_minutes INTEGER DEFAULT 15,
                repeat_type TEXT DEFAULT 'NONE',
                status TEXT DEFAULT 'UPCOMING',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)

        db.execSQL("""
            CREATE TABLE alarms (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                time TEXT NOT NULL,
                repeat_days TEXT NOT NULL,
                sound TEXT DEFAULT 'DEFAULT',
                vibration INTEGER DEFAULT 1,
                snooze_minutes INTEGER DEFAULT 10,
                enabled INTEGER DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)

        db.execSQL("""
            CREATE TABLE goals (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                category_id TEXT,
                target INTEGER NOT NULL,
                progress INTEGER NOT NULL DEFAULT 0,
                deadline TEXT NOT NULL,
                period TEXT NOT NULL,
                status TEXT DEFAULT 'ACTIVE',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)

        db.execSQL("""
            CREATE TABLE notifications (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                type TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                read INTEGER DEFAULT 0
            )
        """)

        // Prepopulate default settings & categories
        db.execSQL("INSERT INTO settings (key, value) VALUES ('user_name', 'User'), ('theme', 'dark'), ('language', 'en'), ('biometric', 'false')")
        
        val defaultCategories = arrayOf(
            "('cat_1', 'Work', '#7C5CFC', 'briefcase')",
            "('cat_2', 'Study', '#3B82F6', 'book')",
            "('cat_3', 'Personal', '#10B981', 'user')",
            "('cat_4', 'Health', '#EF4444', 'heart')",
            "('cat_5', 'Family', '#F59E0B', 'home')",
            "('cat_6', 'Exercise', '#8B5CF6', 'activity')"
        )
        for (cat in defaultCategories) {
            db.execSQL("INSERT INTO categories (id, name, color, icon) VALUES $cat")
        }
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS settings")
        db.execSQL("DROP TABLE IF EXISTS categories")
        db.execSQL("DROP TABLE IF EXISTS tasks")
        db.execSQL("DROP TABLE IF EXISTS appointments")
        db.execSQL("DROP TABLE IF EXISTS alarms")
        db.execSQL("DROP TABLE IF EXISTS goals")
        db.execSQL("DROP TABLE IF EXISTS notifications")
        onCreate(db)
    }

    fun queryJson(query: String, args: Array<String>? = null): String {
        val db = readableDatabase
        val cursor = db.rawQuery(query, args)
        val array = JSONArray()
        cursor.use { c ->
            val colNames = c.columnNames
            while (c.moveToNext()) {
                val obj = JSONObject()
                for (i in colNames.indices) {
                    when (c.getType(i)) {
                        SQLiteDatabase.FIELD_TYPE_INTEGER -> obj.put(colNames[i], c.getLong(i))
                        SQLiteDatabase.FIELD_TYPE_FLOAT -> obj.put(colNames[i], c.getDouble(i))
                        SQLiteDatabase.FIELD_TYPE_STRING -> obj.put(colNames[i], c.getString(i))
                        SQLiteDatabase.FIELD_TYPE_NULL -> obj.put(colNames[i], JSONObject.NULL)
                        else -> obj.put(colNames[i], c.getString(i))
                    }
                }
                array.put(obj)
            }
        }
        return array.toString()
    }

    fun executeSql(sql: String, bindArgs: Array<Any>? = null): Boolean {
        val db = writableDatabase
        return try {
            if (bindArgs == null) {
                db.execSQL(sql)
            } else {
                db.execSQL(sql, bindArgs)
            }
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}
