using ExpenseTracker.Services;
using ExpenseTracker.ViewModels;
using ExpenseTracker.Views;

namespace ExpenseTracker;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder.UseMauiApp<App>();

        // сервіси
        builder.Services.AddSingleton<ExpenseStore>();
        builder.Services.AddSingleton<CurrencyService>();

        // view models
        builder.Services.AddSingleton<ExpensesViewModel>();
        builder.Services.AddTransient<EditExpenseViewModel>();
        builder.Services.AddSingleton<StatsViewModel>();
        builder.Services.AddSingleton<CurrencyViewModel>();

        // сторінки
        builder.Services.AddSingleton<ExpensesPage>();
        builder.Services.AddTransient<EditExpensePage>();
        builder.Services.AddSingleton<StatsPage>();
        builder.Services.AddSingleton<CurrencyPage>();

        return builder.Build();
    }
}
