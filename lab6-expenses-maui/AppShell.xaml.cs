using ExpenseTracker.Views;

namespace ExpenseTracker;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        // сторінка редагування відкривається поверх вкладок (стекова навігація)
        Routing.RegisterRoute(nameof(EditExpensePage), typeof(EditExpensePage));
    }
}
