namespace ExpenseTracker.Models;

public class CategoryStat
{
    public required string Name { get; init; }
    public required string Icon { get; init; }
    public required Color Color { get; init; }
    public decimal Amount { get; init; }
    public double Share { get; init; } // 0..1

    public string AmountText => $"{Amount:N2} ₴";
    public string ShareText => $"{Share * 100:0}%";
}

public class ConversionRow
{
    public required string Code { get; init; }
    public required string Name { get; init; }
    public decimal Value { get; init; }
    public decimal Rate { get; init; }

    public string ValueText => $"{Value:N2} {Code}";
    public string RateText => $"курс: {Rate:0.####}";
}
