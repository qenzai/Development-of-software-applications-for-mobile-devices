using ExpenseTracker.ViewModels;

namespace ExpenseTracker.Views;

public partial class ExpensesPage : ContentPage
{
    private readonly ExpensesViewModel _vm;

    public ExpensesPage(ExpensesViewModel vm)
    {
        InitializeComponent();
        BindingContext = _vm = vm;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _vm.LoadAsync();
    }
}
