using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace ExpenseTracker.Services;

/// <summary>
/// Курси валют з безкоштовного API open.er-api.com (ключ не потрібен).
/// </summary>
public class CurrencyService
{
    private readonly HttpClient _http = new() { Timeout = TimeSpan.FromSeconds(15) };

    public static readonly Dictionary<string, string> Supported = new()
    {
        ["UAH"] = "Гривня",
        ["USD"] = "Долар США",
        ["EUR"] = "Євро",
        ["PLN"] = "Польський злотий",
        ["GBP"] = "Фунт стерлінгів",
        ["CZK"] = "Чеська крона",
        ["CHF"] = "Швейцарський франк",
        ["JPY"] = "Японська єна",
        ["CAD"] = "Канадський долар",
        ["TRY"] = "Турецька ліра",
    };

    public async Task<RatesResult> GetRatesAsync(string baseCurrency)
    {
        var url = $"https://open.er-api.com/v6/latest/{baseCurrency}";
        var data = await _http.GetFromJsonAsync<ApiResponse>(url)
                   ?? throw new Exception("Порожня відповідь сервера");

        if (data.Result != "success" || data.Rates == null)
            throw new Exception("Сервер повернув помилку");

        var updated = DateTimeOffset.FromUnixTimeSeconds(data.TimeLastUpdateUnix).LocalDateTime;
        return new RatesResult(data.Rates, updated);
    }

    public record RatesResult(Dictionary<string, decimal> Rates, DateTime Updated);

    private class ApiResponse
    {
        [JsonPropertyName("result")] public string? Result { get; set; }
        [JsonPropertyName("time_last_update_unix")] public long TimeLastUpdateUnix { get; set; }
        [JsonPropertyName("rates")] public Dictionary<string, decimal>? Rates { get; set; }
    }
}
