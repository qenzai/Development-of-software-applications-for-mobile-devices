using System.Collections.ObjectModel;
using System.Globalization;
using System.Windows.Input;
using ExpenseTracker.Models;
using ExpenseTracker.Services;

namespace ExpenseTracker.ViewModels;

public class StatsViewModel : BaseViewModel
{
    private const string BudgetKey = "monthly_budget";
    private readonly ExpenseStore _store;
    private DateTime _month = new(DateTime.Today.Year, DateTime.Today.Month, 1);

    public StatsViewModel(ExpenseStore store)
    {
        _store = store;
        _store.Changed += (_, _) => Recalculate();

        PrevMonthCommand = new Command(() => ChangeMonth(-1));
        NextMonthCommand = new Command(() => ChangeMonth(1));
        SetBudgetCommand = new Command(async () => await SetBudgetAsync());

        _budget = (decimal)Preferences.Default.Get(BudgetKey, 10000.0);
    }

    public ObservableCollection<CategoryStat> ByCategory { get; } = new();

    public ICommand PrevMonthCommand { get; }
    public ICommand NextMonthCommand { get; }
    public ICommand SetBudgetCommand { get; }

    public string MonthTitle
    {
        get
        {
            var text = _month.ToString("LLLL yyyy", CultureInfo.CurrentCulture);
            return char.ToUpper(text[0]) + text[1..];
        }
    }

    private decimal _budget;

    private string _totalText = "";
    public string TotalText { get => _totalText; set => SetProperty(ref _totalText, value); }

    private string _budgetText = "";
    public string BudgetText { get => _budgetText; set => SetProperty(ref _budgetText, value); }

    private double _budgetProgress;
    public double BudgetProgress { get => _budgetProgress; set => SetProperty(ref _budgetProgress, value); }

    private Color _budgetColor = Colors.Green;
    public Color BudgetColor { get => _budgetColor; set => SetProperty(ref _budgetColor, value); }

    private string _averageText = "";
    public string AverageText { get => _averageText; set => SetProperty(ref _averageText, value); }

    private string _countText = "";
    public string CountText { get => _countText; set => SetProperty(ref _countText, value); }

    private string _biggestText = "";
    public string BiggestText { get => _biggestText; set => SetProperty(ref _biggestText, value); }

    private bool _hasData;
    public bool HasData { get => _hasData; set => SetProperty(ref _hasData, value); }

    public async Task LoadAsync()
    {
        await _store.LoadAsync();
        Recalculate();
    }

    private void ChangeMonth(int delta)
    {
        _month = _month.AddMonths(delta);
        OnPropertyChanged(nameof(MonthTitle));
        Recalculate();
    }

    private void Recalculate()
    {
        var items = _store.ForMonth(_month.Year, _month.Month).ToList();
        var total = items.Sum(e => e.Amount);

        TotalText = $"{total:N2} ₴";
        CountText = $"{items.Count}";
        HasData = items.Count > 0;

        // середнє за день: для поточного місяця ділимо на кількість днів, що вже минули
        var isCurrent = _month.Year == DateTime.Today.Year && _month.Month == DateTime.Today.Month;
        var days = isCurrent ? DateTime.Today.Day : DateTime.DaysInMonth(_month.Year, _month.Month);
        AverageText = $"{(days > 0 ? total / days : 0):N2} ₴";

        var biggest = items.OrderByDescending(e => e.Amount).FirstOrDefault();
        BiggestText = biggest == null ? "—" : $"{biggest.Title} ({biggest.Amount:N2} ₴)";

        // бюджет
        var ratio = _budget > 0 ? (double)(total / _budget) : 0;
        BudgetProgress = Math.Min(ratio, 1);
        BudgetColor = ratio < 0.75 ? Color.FromArgb("#2E7D32")
                    : ratio < 1 ? Color.FromArgb("#FFA000")
                    : Color.FromArgb("#D32F2F");
        var left = _budget - total;
        BudgetText = left >= 0
            ? $"Залишок {left:N2} ₴ з {_budget:N2} ₴"
            : $"Перевищено на {-left:N2} ₴ (бюджет {_budget:N2} ₴)";

        // по категоріях
        ByCategory.Clear();
        var groups = items
            .GroupBy(e => e.Category)
            .Select(g => new { Info = Categories.Get(g.Key), Sum = g.Sum(e => e.Amount) })
            .OrderByDescending(g => g.Sum);
        foreach (var g in groups)
        {
            ByCategory.Add(new CategoryStat
            {
                Name = g.Info.Name,
                Icon = g.Info.Icon,
                Color = Color.FromArgb(g.Info.ColorHex),
                Amount = g.Sum,
                Share = total > 0 ? (double)(g.Sum / total) : 0,
            });
        }
    }

    private async Task SetBudgetAsync()
    {
        var result = await CurrentPage.DisplayPromptAsync("Місячний бюджет", "Введіть суму в гривнях:",
            "Зберегти", "Скасувати", initialValue: _budget.ToString("0"), keyboard: Keyboard.Numeric);
        if (result == null) return;

        if (decimal.TryParse(result.Replace(',', '.'), NumberStyles.Number, CultureInfo.InvariantCulture, out var value)
            && value > 0)
        {
            _budget = value;
            Preferences.Default.Set(BudgetKey, (double)value);
            Recalculate();
        }
        else
        {
            await CurrentPage.DisplayAlertAsync("Помилка", "Некоректна сума", "OK");
        }
    }
}
