using System.Globalization;

namespace ExpenseTracker;

public partial class App : Application
{
    public App()
    {
        // українські назви місяців і формат чисел
        var culture = new CultureInfo("uk-UA");
        CultureInfo.DefaultThreadCurrentCulture = culture;
        CultureInfo.DefaultThreadCurrentUICulture = culture;
        CultureInfo.CurrentCulture = culture;
        CultureInfo.CurrentUICulture = culture;

        InitializeComponent();
    }

    protected override Window CreateWindow(IActivationState? activationState)
    {
        return new Window(new AppShell()) { Title = "Мої витрати" };
    }
}
