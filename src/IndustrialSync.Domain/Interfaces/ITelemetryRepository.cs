using IndustrialSync.Domain.Entities;

namespace IndustrialSync.Domain.Interfaces;

public interface ITelemetryRepository
{
    Task AddAsync(SensorTelemetry telemetry);
    Task<IEnumerable<SensorTelemetry>> GetAllRecentAsync();
}