namespace ExpenseTracker.Models;

public record CategoryInfo(string Name, string Icon, string ColorHex)
{
    public Color Color => Color.FromArgb(ColorHex);
}

public static class Categories
{
    public static readonly CategoryInfo Food = new("Їжа", "🍔", "#FF7043");
    public static readonly CategoryInfo Transport = new("Транспорт", "🚌", "#42A5F5");
    public static readonly CategoryInfo Home = new("Житло", "🏠", "#8D6E63");
    public static readonly CategoryInfo Fun = new("Розваги", "🎮", "#AB47BC");
    public static readonly CategoryInfo Health = new("Здоров'я", "💊", "#EC407A");
    public static readonly CategoryInfo Shopping = new("Покупки", "🛍️", "#FFCA28");
    public static readonly CategoryInfo Study = new("Навчання", "📚", "#26A69A");
    public static readonly CategoryInfo Other = new("Інше", "📦", "#78909C");

    public static readonly IReadOnlyList<CategoryInfo> All =
        new[] { Food, Transport, Home, Fun, Health, Shopping, Study, Other };

    public static IReadOnlyList<string> Names { get; } = All.Select(c => c.Name).ToList();

    public static CategoryInfo Get(string name) =>
        All.FirstOrDefault(c => c.Name == name) ?? Other;
}
