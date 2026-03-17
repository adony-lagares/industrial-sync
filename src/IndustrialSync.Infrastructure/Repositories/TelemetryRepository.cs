using IndustrialSync.Domain.Entities;
using IndustrialSync.Domain.Interfaces;
using IndustrialSync.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IndustrialSync.Infrastructure.Repositories;

public class TelemetryRepository(ApplicationDbContext context) : ITelemetryRepository
{
    public async Task AddAsync(SensorTelemetry telemetry)
    {
        await context.Telemetries.AddAsync(telemetry);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<SensorTelemetry>> GetAllRecentAsync()
    {
        return await context.Telemetries
            .OrderByDescending(t => t.Timestamp)
            .Take(100)
            .ToListAsync();
    }
}