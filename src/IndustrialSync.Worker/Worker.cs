using Azure.Messaging.ServiceBus;
using IndustrialSync.Domain.Entities;
using IndustrialSync.Domain.Interfaces;
using System.Text.Json;
using IndustrialSync.Application.Models;

namespace IndustrialSync.Worker;

public class TelemetryWorker(
    ILogger<TelemetryWorker> logger,
    IServiceProvider serviceProvider,
    IConfiguration configuration) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var connectionString = configuration.GetConnectionString("ServiceBus");
        await using var client = new ServiceBusClient(connectionString);
        var processor = client.CreateProcessor("telemetry-queue", new ServiceBusProcessorOptions());

        processor.ProcessMessageAsync += async args =>
        {
            var body = args.Message.Body.ToString();

            var data = JsonSerializer.Deserialize<TelemetryMessage>(body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (data != null)
            {
                using var scope = serviceProvider.CreateScope();
                var repository = scope.ServiceProvider.GetRequiredService<ITelemetryRepository>();

                var telemetry = new SensorTelemetry(data.EquipmentCode, data.Temp, data.Press);

                await repository.AddAsync(telemetry);

                logger.LogInformation("Telemetry processed successfully: {Id} for {Code}", telemetry.Id, data.EquipmentCode);
            }

            await args.CompleteMessageAsync(args.Message);
        };

        processor.ProcessErrorAsync += args => {
            logger.LogError(args.Exception, "Error processing message");
            return Task.CompletedTask;
        };

        await processor.StartProcessingAsync(stoppingToken);

        await Task.Delay(-1, stoppingToken);
    }
}