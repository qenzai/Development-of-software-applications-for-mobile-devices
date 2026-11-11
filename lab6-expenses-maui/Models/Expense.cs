using System.Text.Json.Serialization;

namespace ExpenseTracker.Models;

public class Expense
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = "";
    public decimal Amount { get; set; }
    public string Category { get; set; } = Categories.Other.Name;
    public DateTime Date { get; set; } = DateTime.Today;
    public string Note { get; set; } = "";

    // властивості лише для відображення, у файл не зберігаються
    [JsonIgnore] public CategoryInfo CategoryInfo => Categories.Get(Category);
    [JsonIgnore] public string Icon => CategoryInfo.Icon;
    [JsonIgnore] public Color CategoryColor => CategoryInfo.Color;
    [JsonIgnore] public string AmountText => $"-{Amount:N2} ₴";
    [JsonIgnore] public string DateText => Date.ToString("d MMMM yyyy");
    [JsonIgnore] public bool HasNote => !string.IsNullOrWhiteSpace(Note);
}
