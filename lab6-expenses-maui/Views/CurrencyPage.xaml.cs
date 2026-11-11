using ExpenseTracker.ViewModels;

namespace ExpenseTracker.Views;

public partial class CurrencyPage : ContentPage
{
    private readonly CurrencyViewModel _vm;

    public CurrencyPage(CurrencyViewModel vm)
    {
        InitializeComponent();
        BindingContext = _vm = vm;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _vm.LoadRatesAsync(force: false);
    }
}
