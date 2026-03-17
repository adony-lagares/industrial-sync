using IndustrialSync.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IndustrialSync.Infrastructure.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<SensorTelemetry> Telemetries => Set<SensorTelemetry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SensorTelemetry>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EquipmentCode).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Timestamp).IsRequired();
        });
    }
}