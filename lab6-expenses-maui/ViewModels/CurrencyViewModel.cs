using System.Collections.ObjectModel;
using System.Globalization;
using System.Windows.Input;
using ExpenseTracker.Models;
using ExpenseTracker.Services;

namespace ExpenseTracker.ViewModels;

public class CurrencyViewModel : BaseViewModel
{
    private readonly CurrencyService _currency;
    private readonly ExpenseStore _store;
    private Dictionary<string, decimal>? _rates;
    private string? _ratesBase;

    public CurrencyViewModel(CurrencyService currency, ExpenseStore store)
    {
        _currency = currency;
        _store = store;
        Currencies = CurrencyService.Supported.Keys.ToList();

        RefreshCommand = new Command(async () => await LoadRatesAsync(force: true));
        UseMonthTotalCommand = new Command(UseMonthTotal);
    }

    public List<string> Currencies { get; }
    public ObservableCollection<ConversionRow> Results { get; } = new();

    public ICommand RefreshCommand { get; }
    public ICommand UseMonthTotalCommand { get; }

    private string _amountText = "1000";
    public string AmountText
    {
        get => _amountText;
        set
        {
            if (SetProperty(ref _amountText, value))
                Recalculate();
        }
    }

    private string _fromCurrency = "UAH";
    public string FromCurrency
    {
        get => _fromCurrency;
        set
        {
            if (SetProperty(ref _fromCurrency, value ?? "UAH"))
                _ = LoadRatesAsync(force: false);
        }
    }

    private string _status = "";
    public string Status { get => _status; set => SetProperty(ref _status, value); }

    private string _error = "";
    public string Error
    {
        get => _error;
        set
        {
            if (SetProperty(ref _error, value))
                OnPropertyChanged(nameof(HasError));
        }
    }
    public bool HasError => !string.IsNullOrEmpty(Error);

    public async Task LoadRatesAsync(bool force)
    {
        if (IsBusy) return;
        if (!force && _rates != null && _ratesBase == FromCurrency)
        {
            Recalculate();
            return;
        }

        if (Connectivity.Current.NetworkAccess != NetworkAccess.Internet)
        {
            Error = "Немає підключення до інтернету";
            return;
        }

        IsBusy = true;
        Error = "";
        try
        {
            var result = await _currency.GetRatesAsync(FromCurrency);
            _rates = result.Rates;
            _ratesBase = FromCurrency;
            Status = $"Курси оновлено: {result.Updated:dd.MM.yyyy HH:mm}";
            Recalculate();
        }
        catch (Exception ex)
        {
            Error = $"Не вдалося отримати курси: {ex.Message}";
        }
        finally
        {
            IsBusy = false;
        }
    }

    private void Recalculate()
    {
        Results.Clear();
        if (_rates == null) return;

        var text = AmountText.Trim().Replace(" ", "").Replace(',', '.');
        if (!decimal.TryParse(text, NumberStyles.Number, CultureInfo.InvariantCulture, out var amount))
            return;

        foreach (var (code, name) in CurrencyService.Supported)
        {
            if (code == FromCurrency || !_rates.TryGetValue(code, out var rate))
                continue;
            Results.Add(new ConversionRow { Code = code, Name = name, Rate = rate, Value = amount * rate });
        }
    }

    private void UseMonthTotal()
    {
        var today = DateTime.Today;
        var total = _store.ForMonth(today.Year, today.Month).Sum(e => e.Amount);
        if (FromCurrency != "UAH")
            FromCurrency = "UAH";
        AmountText = total.ToString("0.##", CultureInfo.InvariantCulture);
    }
}
