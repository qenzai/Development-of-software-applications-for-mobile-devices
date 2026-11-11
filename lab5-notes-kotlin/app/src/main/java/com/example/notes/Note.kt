package com.example.notes

data class Note(
    val id: Long = 0,
    val title: String,
    val content: String,
    val color: Int,
    val pinned: Boolean = false,
    val updatedAt: Long = System.currentTimeMillis(),
)

enum class SortOrder { DATE, TITLE }

object NoteColors {
    // кольори карток нотаток
    val ALL = intArrayOf(
        0xFFFFFFFF.toInt(), // білий
        0xFFFFF59D.toInt(), // жовтий
        0xFFA5D6A7.toInt(), // зелений
        0xFF90CAF9.toInt(), // блакитний
        0xFFF48FB1.toInt(), // рожевий
        0xFFFFCC80.toInt(), // помаранчевий
        0xFFCE93D8.toInt(), // фіолетовий
    )
}
