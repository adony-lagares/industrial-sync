namespace IndustrialSync.Domain.Entities;

public class SensorTelemetry
{
    // Usamos private set para garantir o encapsulamento (Princípio de DDD)
    public Guid Id { get; private set; }
    public string EquipmentCode { get; private set; } = string.Empty;
    public double Temperature { get; private set; }
    public double Pressure { get; private set; }
    public DateTime Timestamp { get; private set; }

    // Construtor vazio para o Entity Framework
    private SensorTelemetry() { }

    // Construtor principal para o negócio
    public SensorTelemetry(string equipmentCode, double temperature, double pressure)
    {
        Id = Guid.NewGuid();
        EquipmentCode = equipmentCode;
        Temperature = temperature;
        Pressure = pressure;
        Timestamp = DateTime.UtcNow;
    }

    // Lógica de Domínio: O objeto sabe se ele é perigoso
    public bool IsCritical() => Temperature > 100 || Pressure > 60;
}