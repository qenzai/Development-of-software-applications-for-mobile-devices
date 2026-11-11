using System.Collections.ObjectModel;
using System.Windows.Input;
using ExpenseTracker.Models;
using ExpenseTracker.Services;
using ExpenseTracker.Views;

namespace ExpenseTracker.ViewModels;

public class ExpensesViewModel : BaseViewModel
{
    private const string AllCategories = "Усі категорії";
    private readonly ExpenseStore _store;

    public ExpensesViewModel(ExpenseStore store)
    {
        _store = store;
        _store.Changed += (_, _) => ApplyFilter();

        CategoryFilters = new List<string> { AllCategories };
        CategoryFilters.AddRange(Categories.Names);
        _selectedFilter = AllCategories;

        AddCommand = new Command(async () => await Shell.Current.GoToAsync(nameof(EditExpensePage)));
        EditCommand = new Command<Expense>(async e =>
            await Shell.Current.GoToAsync($"{nameof(EditExpensePage)}?id={e.Id}"));
        DeleteCommand = new Command<Expense>(async e => await DeleteAsync(e));
    }

    public ObservableCollection<Expense> Filtered { get; } = new();
    public List<string> CategoryFilters { get; }

    public ICommand AddCommand { get; }
    public ICommand EditCommand { get; }
    public ICommand DeleteCommand { get; }

    private string _searchText = "";
    public string SearchText
    {
        get => _searchText;
        set
        {
            if (SetProperty(ref _searchText, value))
                ApplyFilter();
        }
    }

    private string _selectedFilter;
    public string SelectedFilter
    {
        get => _selectedFilter;
        set
        {
            if (SetProperty(ref _selectedFilter, value ?? AllCategories))
                ApplyFilter();
        }
    }

    private string _totalText = "0,00 ₴";
    public string TotalText
    {
        get => _totalText;
        set => SetProperty(ref _totalText, value);
    }

    private string _countText = "";
    public string CountText
    {
        get => _countText;
        set => SetProperty(ref _countText, value);
    }

    private bool _isEmpty = true;
    public bool IsEmpty
    {
        get => _isEmpty;
        set => SetProperty(ref _isEmpty, value);
    }

    public async Task LoadAsync()
    {
        await _store.LoadAsync();
        ApplyFilter();
    }

    private void ApplyFilter()
    {
        IEnumerable<Expense> query = _store.Items;

        if (SelectedFilter != AllCategories)
            query = query.Where(e => e.Category == SelectedFilter);

        if (!string.IsNullOrWhiteSpace(SearchText))
        {
            var text = SearchText.Trim();
            query = query.Where(e =>
                e.Title.Contains(text, StringComparison.CurrentCultureIgnoreCase) ||
                e.Note.Contains(text, StringComparison.CurrentCultureIgnoreCase));
        }

        var list = query.ToList();
        Filtered.Clear();
        foreach (var e in list)
            Filtered.Add(e);

        TotalText = $"{list.Sum(e => e.Amount):N2} ₴";
        CountText = $"Записів: {list.Count}";
        IsEmpty = list.Count == 0;
    }

    private async Task DeleteAsync(Expense expense)
    {
        var ok = await CurrentPage.DisplayAlertAsync("Видалення",
            $"Видалити «{expense.Title}» на {expense.Amount:N2} ₴?", "Видалити", "Скасувати");
        if (ok)
            await _store.DeleteAsync(expense);
    }
}
