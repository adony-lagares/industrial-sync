using IndustrialSync.Domain.Entities;
using Xunit;

namespace IndustrialSync.Domain.Tests;

public class SensorTelemetryTests
{
    [Fact]
    public void Constructor_SetsFieldsAndGeneratesId()
    {
        var telemetry = new SensorTelemetry("PUMP-01", 55.5, 30.2);

        Assert.NotEqual(Guid.Empty, telemetry.Id);
        Assert.Equal("PUMP-01", telemetry.EquipmentCode);
        Assert.Equal(55.5, telemetry.Temperature);
        Assert.Equal(30.2, telemetry.Pressure);
    }

    [Theory]
    [InlineData(79, 44, false)]
    [InlineData(80, 44, false)]
    [InlineData(81, 44, true)]
    [InlineData(79, 45, false)]
    [InlineData(79, 46, true)]
    public void IsCritical_RespectsTemperatureAndPressureThresholds(double temperature, double pressure, bool expectedCritical)
    {
        var telemetry = new SensorTelemetry("PUMP-01", temperature, pressure);

        Assert.Equal(expectedCritical, telemetry.IsCritical());
    }
}
