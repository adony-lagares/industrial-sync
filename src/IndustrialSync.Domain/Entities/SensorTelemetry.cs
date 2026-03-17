namespace IndustrialSync.Domain.Entities;

public class SensorTelemetry
{
    public Guid Id { get; private set; }
    public string EquipmentCode { get; private set; } = string.Empty;
    public double Temperature { get; private set; }
    public double Pressure { get; private set; }
    public DateTime Timestamp { get; private set; }

    private SensorTelemetry() { }

    public SensorTelemetry(string equipmentCode, double temperature, double pressure)
    {
        Id = Guid.NewGuid();
        EquipmentCode = equipmentCode;
        Temperature = temperature;
        Pressure = pressure;
        Timestamp = DateTime.UtcNow;
    }

    public bool IsCritical() => Temperature > 100 || Pressure > 60;
}