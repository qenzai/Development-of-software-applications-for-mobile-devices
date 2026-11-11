package com.example.notes

import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

/** Робота з локальною базою SQLite */
class NotesDbHelper(context: Context) :
    SQLiteOpenHelper(context, DB_NAME, null, DB_VERSION) {

    companion object {
        private const val DB_NAME = "notes.db"
        private const val DB_VERSION = 1
        private const val TABLE = "notes"
        private const val COL_ID = "_id"
        private const val COL_TITLE = "title"
        private const val COL_CONTENT = "content"
        private const val COL_COLOR = "color"
        private const val COL_PINNED = "pinned"
        private const val COL_UPDATED = "updated_at"
    }

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(
            """CREATE TABLE $TABLE (
                $COL_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                $COL_TITLE TEXT NOT NULL,
                $COL_CONTENT TEXT NOT NULL,
                $COL_COLOR INTEGER NOT NULL,
                $COL_PINNED INTEGER NOT NULL DEFAULT 0,
                $COL_UPDATED INTEGER NOT NULL
            )"""
        )
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE")
        onCreate(db)
    }

    private fun Note.toValues() = ContentValues().apply {
        put(COL_TITLE, title)
        put(COL_CONTENT, content)
        put(COL_COLOR, color)
        put(COL_PINNED, if (pinned) 1 else 0)
        put(COL_UPDATED, updatedAt)
    }

    private fun Cursor.toNote() = Note(
        id = getLong(getColumnIndexOrThrow(COL_ID)),
        title = getString(getColumnIndexOrThrow(COL_TITLE)),
        content = getString(getColumnIndexOrThrow(COL_CONTENT)),
        color = getInt(getColumnIndexOrThrow(COL_COLOR)),
        pinned = getInt(getColumnIndexOrThrow(COL_PINNED)) == 1,
        updatedAt = getLong(getColumnIndexOrThrow(COL_UPDATED)),
    )

    fun insert(note: Note): Long = writableDatabase.insert(TABLE, null, note.toValues())

    fun update(note: Note) {
        writableDatabase.update(TABLE, note.toValues(), "$COL_ID = ?", arrayOf(note.id.toString()))
    }

    fun delete(id: Long) {
        writableDatabase.delete(TABLE, "$COL_ID = ?", arrayOf(id.toString()))
    }

    fun getById(id: Long): Note? =
        readableDatabase.query(TABLE, null, "$COL_ID = ?", arrayOf(id.toString()), null, null, null)
            .use { c -> if (c.moveToFirst()) c.toNote() else null }

    /** Список нотаток з пошуком; закріплені завжди зверху */
    fun getAll(query: String = "", sort: SortOrder = SortOrder.DATE): List<Note> {
        val order = when (sort) {
            SortOrder.DATE -> "$COL_PINNED DESC, $COL_UPDATED DESC"
            SortOrder.TITLE -> "$COL_PINNED DESC, $COL_TITLE COLLATE NOCASE ASC"
        }
        val selection: String?
        val args: Array<String>?
        if (query.isBlank()) {
            selection = null
            args = null
        } else {
            selection = "$COL_TITLE LIKE ? OR $COL_CONTENT LIKE ?"
            args = arrayOf("%$query%", "%$query%")
        }
        val result = mutableListOf<Note>()
        readableDatabase.query(TABLE, null, selection, args, null, null, order).use { c ->
            while (c.moveToNext()) result.add(c.toNote())
        }
        return result
    }

    fun count(): Int =
        readableDatabase.rawQuery("SELECT COUNT(*) FROM $TABLE", null).use { c ->
            c.moveToFirst()
            c.getInt(0)
        }
}
