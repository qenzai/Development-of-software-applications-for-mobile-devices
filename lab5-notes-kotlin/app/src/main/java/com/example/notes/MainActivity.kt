package com.example.notes

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.recyclerview.widget.ItemTouchHelper
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.notes.databinding.ActivityMainBinding
import com.google.android.material.snackbar.Snackbar

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var db: NotesDbHelper
    private lateinit var adapter: NoteAdapter

    private var query = ""
    private var sort = SortOrder.DATE

    // після повернення з екрану редагування оновлюємо список
    private val editLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { refresh() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = NotesDbHelper(this)
        adapter = NoteAdapter { note -> openEditor(note.id) }

        binding.recycler.layoutManager = LinearLayoutManager(this)
        binding.recycler.adapter = adapter
        binding.fab.setOnClickListener { openEditor(null) }

        setupSwipeToDelete()
        refresh()
    }

    private fun openEditor(id: Long?) {
        val intent = Intent(this, EditNoteActivity::class.java)
        if (id != null) intent.putExtra(EditNoteActivity.EXTRA_ID, id)
        editLauncher.launch(intent)
    }

    private fun refresh() {
        val notes = db.getAll(query, sort)
        adapter.submit(notes)
        binding.emptyView.visibility = if (notes.isEmpty()) View.VISIBLE else View.GONE
        binding.emptyView.setText(
            if (query.isBlank()) R.string.empty_notes else R.string.empty_search
        )
        supportActionBar?.subtitle = getString(R.string.notes_count, db.count())
    }

    private fun setupSwipeToDelete() {
        val callback = object : ItemTouchHelper.SimpleCallback(
            0, ItemTouchHelper.LEFT or ItemTouchHelper.RIGHT
        ) {
            override fun onMove(
                rv: RecyclerView, vh: RecyclerView.ViewHolder, target: RecyclerView.ViewHolder
            ) = false

            override fun onSwiped(vh: RecyclerView.ViewHolder, direction: Int) {
                val note = adapter.getAt(vh.bindingAdapterPosition)
                db.delete(note.id)
                refresh()
                Snackbar.make(binding.root, R.string.note_deleted, Snackbar.LENGTH_LONG)
                    .setAction(R.string.undo) {
                        db.insert(note.copy(id = 0))
                        refresh()
                    }
                    .show()
            }
        }
        ItemTouchHelper(callback).attachToRecyclerView(binding.recycler)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_main, menu)
        val searchView = menu.findItem(R.id.action_search).actionView as SearchView
        searchView.queryHint = getString(R.string.search_hint)
        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(text: String?) = false
            override fun onQueryTextChange(text: String?): Boolean {
                query = text.orEmpty()
                refresh()
                return true
            }
        })
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.sort_date -> sort = SortOrder.DATE
            R.id.sort_title -> sort = SortOrder.TITLE
            else -> return super.onOptionsItemSelected(item)
        }
        item.isChecked = true
        refresh()
        return true
    }
}
