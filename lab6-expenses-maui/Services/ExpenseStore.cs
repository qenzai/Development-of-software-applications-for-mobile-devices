using System.Collections.ObjectModel;
using System.Text.Json;
using ExpenseTracker.Models;

namespace ExpenseTracker.Services;

/// <summary>
/// Зберігає витрати у JSON-файлі в папці даних застосунку.
/// </summary>
public class ExpenseStore
{
    private readonly string _path = Path.Combine(FileSystem.AppDataDirectory, "expenses.json");
    private bool _loaded;

    public ObservableCollection<Expense> Items { get; } = new();

    /// <summary>Спрацьовує після будь-якої зміни списку.</summary>
    public event EventHandler? Changed;

    public async Task LoadAsync()
    {
        if (_loaded) return;
        _loaded = true;

        if (!File.Exists(_path))
            return;

        try
        {
            var json = await File.ReadAllTextAsync(_path);
            var list = JsonSerializer.Deserialize<List<Expense>>(json) ?? new();
            foreach (var e in list.OrderByDescending(x => x.Date))
                Items.Add(e);
        }
        catch (JsonException)
        {
            // зіпсований файл — просто починаємо з порожнього списку
        }
        Changed?.Invoke(this, EventArgs.Empty);
    }

    public Expense? Find(Guid id) => Items.FirstOrDefault(x => x.Id == id);

    public async Task AddOrUpdateAsync(Expense expense)
    {
        var existing = Find(expense.Id);
        if (existing != null)
            Items.Remove(existing);

        // вставляємо так, щоб список лишався відсортованим за датою (нові зверху)
        var index = 0;
        while (index < Items.Count && Items[index].Date > expense.Date)
            index++;
        Items.Insert(index, expense);

        await SaveAsync();
    }

    public async Task DeleteAsync(Expense expense)
    {
        Items.Remove(expense);
        await SaveAsync();
    }

    public async Task ClearAsync()
    {
        Items.Clear();
        await SaveAsync();
    }

    private async Task SaveAsync()
    {
        var json = JsonSerializer.Serialize(Items.ToList(), new JsonSerializerOptions { WriteIndented = true });
        await File.WriteAllTextAsync(_path, json);
        Changed?.Invoke(this, EventArgs.Empty);
    }

    public IEnumerable<Expense> ForMonth(int year, int month) =>
        Items.Where(e => e.Date.Year == year && e.Date.Month == month);
}
