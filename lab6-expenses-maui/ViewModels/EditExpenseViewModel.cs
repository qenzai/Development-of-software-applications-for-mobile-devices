using System.Globalization;
using System.Windows.Input;
using ExpenseTracker.Models;
using ExpenseTracker.Services;

namespace ExpenseTracker.ViewModels;

/// <summary>
/// Додавання нової або редагування існуючої витрати.
/// Отримує параметр навігації id (якщо редагуємо).
/// </summary>
public class EditExpenseViewModel : BaseViewModel, IQueryAttributable
{
    private readonly ExpenseStore _store;
    private Expense? _editing;

    public EditExpenseViewModel(ExpenseStore store)
    {
        _store = store;
        SaveCommand = new Command(async () => await SaveAsync());
        DeleteCommand = new Command(async () => await DeleteAsync());
        PickCategoryCommand = new Command<string>(name => SelectedCategory = name);
    }

    public IReadOnlyList<CategoryInfo> CategoryList => Categories.All;

    public ICommand SaveCommand { get; }
    public ICommand DeleteCommand { get; }
    public ICommand PickCategoryCommand { get; }

    private string _pageTitle = "Нова витрата";
    public string PageTitle { get => _pageTitle; set => SetProperty(ref _pageTitle, value); }

    private string _title = "";
    public string Title { get => _title; set => SetProperty(ref _title, value); }

    private string _amountText = "";
    public string AmountText { get => _amountText; set => SetProperty(ref _amountText, value); }

    private string _selectedCategory = Categories.Food.Name;
    public string SelectedCategory
    {
        get => _selectedCategory;
        set
        {
            if (SetProperty(ref _selectedCategory, value))
                OnPropertyChanged(nameof(SelectedCategoryText));
        }
    }
    public string SelectedCategoryText => $"{Categories.Get(SelectedCategory).Icon} {SelectedCategory}";

    private DateTime _date = DateTime.Today;
    public DateTime Date { get => _date; set => SetProperty(ref _date, value); }

    private string _note = "";
    public string Note { get => _note; set => SetProperty(ref _note, value); }

    private bool _isEditing;
    public bool IsEditing { get => _isEditing; set => SetProperty(ref _isEditing, value); }

    public DateTime MaxDate => DateTime.Today;

    public void ApplyQueryAttributes(IDictionary<string, object> query)
    {
        if (query.TryGetValue("id", out var raw) && Guid.TryParse(raw?.ToString(), out var id))
        {
            _editing = _store.Find(id);
            if (_editing != null)
            {
                IsEditing = true;
                PageTitle = "Редагування";
                Title = _editing.Title;
                AmountText = _editing.Amount.ToString("0.##", CultureInfo.CurrentCulture);
                SelectedCategory = _editing.Category;
                Date = _editing.Date;
                Note = _editing.Note;
            }
        }
    }

    private static bool TryParseAmount(string text, out decimal amount)
    {
        // приймаємо і кому, і крапку
        var normalized = text.Trim().Replace(" ", "").Replace(',', '.');
        return decimal.TryParse(normalized, NumberStyles.Number, CultureInfo.InvariantCulture, out amount);
    }

    private async Task SaveAsync()
    {
        if (string.IsNullOrWhiteSpace(Title))
        {
            await CurrentPage.DisplayAlertAsync("Помилка", "Введіть назву витрати", "OK");
            return;
        }
        if (!TryParseAmount(AmountText, out var amount) || amount <= 0)
        {
            await CurrentPage.DisplayAlertAsync("Помилка", "Введіть коректну суму (більше 0)", "OK");
            return;
        }
        if (amount > 10_000_000)
        {
            await CurrentPage.DisplayAlertAsync("Помилка", "Занадто велика сума", "OK");
            return;
        }

        var expense = new Expense
        {
            Id = _editing?.Id ?? Guid.NewGuid(),
            Title = Title.Trim(),
            Amount = Math.Round(amount, 2),
            Category = SelectedCategory,
            Date = Date.Date,
            Note = Note.Trim(),
        };
        await _store.AddOrUpdateAsync(expense);
        await Shell.Current.GoToAsync("..");
    }

    private async Task DeleteAsync()
    {
        if (_editing == null) return;
        var ok = await CurrentPage.DisplayAlertAsync("Видалення", "Видалити цю витрату?", "Видалити", "Скасувати");
        if (!ok) return;
        await _store.DeleteAsync(_editing);
        await Shell.Current.GoToAsync("..");
    }
}
