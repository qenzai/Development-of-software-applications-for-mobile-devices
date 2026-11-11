using ExpenseTracker.ViewModels;

namespace ExpenseTracker.Views;

public partial class EditExpensePage : ContentPage
{
    public EditExpensePage(EditExpenseViewModel vm)
    {
        InitializeComponent();
        BindingContext = vm;
    }
}
