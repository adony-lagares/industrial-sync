namespace IndustrialSync.Application.Models;

public record TelemetryMessage(
    string EquipmentCode,
    double Temp,
    double Press
);