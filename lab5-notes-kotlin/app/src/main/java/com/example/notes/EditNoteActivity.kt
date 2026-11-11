package com.example.notes

import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.example.notes.databinding.ActivityEditNoteBinding

class EditNoteActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_ID = "note_id"
    }

    private lateinit var binding: ActivityEditNoteBinding
    private lateinit var db: NotesDbHelper

    private var note: Note? = null
    private var color = NoteColors.ALL[0]
    private var pinned = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditNoteBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        db = NotesDbHelper(this)

        val id = intent.getLongExtra(EXTRA_ID, -1)
        if (id != -1L) {
            note = db.getById(id)
            note?.let {
                binding.editTitle.setText(it.title)
                binding.editContent.setText(it.content)
                color = it.color
                pinned = it.pinned
            }
        }
        title = getString(if (note == null) R.string.new_note else R.string.edit_note)

        if (savedInstanceState != null) {
            color = savedInstanceState.getInt("color", color)
            pinned = savedInstanceState.getBoolean("pinned", pinned)
        }

        buildColorPicker()
        applyColor()

        // при натисканні "Назад" нотатка зберігається автоматично
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                saveAndClose()
            }
        })
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putInt("color", color)
        outState.putBoolean("pinned", pinned)
    }

    private fun buildColorPicker() {
        val size = (36 * resources.displayMetrics.density).toInt()
        val margin = (6 * resources.displayMetrics.density).toInt()
        binding.colorPicker.removeAllViews()
        val selected = color
        for (c in NoteColors.ALL) {
            val v = View(this)
            v.layoutParams = LinearLayout.LayoutParams(size, size).apply {
                setMargins(margin, margin, margin, margin)
            }
            v.background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(c)
                setStroke(if (c == selected) 6 else 2, if (c == selected) Color.BLACK else Color.LTGRAY)
            }
            v.setOnClickListener {
                color = c
                buildColorPicker()
                applyColor()
            }
            binding.colorPicker.addView(v)
        }
    }

    private fun applyColor() {
        binding.root.setBackgroundColor(color)
    }

    private fun saveAndClose() {
        val title = binding.editTitle.text.toString().trim()
        val content = binding.editContent.text.toString().trim()

        if (title.isEmpty() && content.isEmpty()) {
            // порожню нотатку не зберігаємо
            note?.let { db.delete(it.id) }
            finish()
            return
        }

        val existing = note
        if (existing == null) {
            db.insert(Note(title = title, content = content, color = color, pinned = pinned))
        } else {
            val changed = existing.title != title || existing.content != content ||
                existing.color != color || existing.pinned != pinned
            if (changed) {
                db.update(
                    existing.copy(
                        title = title, content = content, color = color,
                        pinned = pinned, updatedAt = System.currentTimeMillis()
                    )
                )
            }
        }
        setResult(RESULT_OK)
        finish()
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_edit, menu)
        updatePinIcon(menu.findItem(R.id.action_pin))
        menu.findItem(R.id.action_delete).isVisible = note != null
        return true
    }

    private fun updatePinIcon(item: MenuItem) {
        item.setIcon(if (pinned) android.R.drawable.star_big_on else android.R.drawable.star_big_off)
        item.title = getString(if (pinned) R.string.unpin else R.string.pin)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> saveAndClose()
            R.id.action_pin -> {
                pinned = !pinned
                updatePinIcon(item)
                Toast.makeText(
                    this,
                    if (pinned) R.string.pinned_msg else R.string.unpinned_msg,
                    Toast.LENGTH_SHORT
                ).show()
            }
            R.id.action_share -> share()
            R.id.action_delete -> confirmDelete()
            else -> return super.onOptionsItemSelected(item)
        }
        return true
    }

    private fun share() {
        val text = binding.editTitle.text.toString() + "\n\n" + binding.editContent.text.toString()
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, text.trim())
        }
        startActivity(Intent.createChooser(intent, getString(R.string.share)))
    }

    private fun confirmDelete() {
        AlertDialog.Builder(this)
            .setTitle(R.string.delete_title)
            .setMessage(R.string.delete_message)
            .setPositiveButton(R.string.delete) { _, _ ->
                note?.let { db.delete(it.id) }
                setResult(RESULT_OK)
                finish()
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }
}
