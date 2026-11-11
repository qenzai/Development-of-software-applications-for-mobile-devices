package com.example.notes

import android.text.format.DateFormat
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.notes.databinding.ItemNoteBinding
import java.util.Date

class NoteAdapter(
    private val onClick: (Note) -> Unit,
) : RecyclerView.Adapter<NoteAdapter.Holder>() {

    private val items = mutableListOf<Note>()

    fun submit(list: List<Note>) {
        items.clear()
        items.addAll(list)
        notifyDataSetChanged()
    }

    fun getAt(position: Int): Note = items[position]

    class Holder(val binding: ItemNoteBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): Holder {
        val binding = ItemNoteBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return Holder(binding)
    }

    override fun getItemCount() = items.size

    override fun onBindViewHolder(holder: Holder, position: Int) {
        val note = items[position]
        val b = holder.binding
        val ctx = b.root.context
        b.card.setCardBackgroundColor(note.color)
        b.title.text = note.title.ifBlank { ctx.getString(R.string.no_title) }
        b.content.text = note.content
        b.content.visibility = if (note.content.isBlank()) View.GONE else View.VISIBLE
        b.pin.visibility = if (note.pinned) View.VISIBLE else View.GONE
        val date = Date(note.updatedAt)
        b.date.text = "${DateFormat.getDateFormat(ctx).format(date)} ${DateFormat.getTimeFormat(ctx).format(date)}"
        b.root.setOnClickListener { onClick(note) }
    }
}
