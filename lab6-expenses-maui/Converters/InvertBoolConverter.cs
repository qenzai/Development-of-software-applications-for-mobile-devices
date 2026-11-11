using System.Globalization;

namespace ExpenseTracker.Converters;

/// <summary>Перетворює true на false і навпаки (для IsVisible).</summary>
public class InvertBoolConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture) =>
        value is bool b ? !b : true;

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture) =>
        value is bool b ? !b : false;
}
