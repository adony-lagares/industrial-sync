using Azure.Messaging.ServiceBus;
using IndustrialSync.Domain.Entities;
using IndustrialSync.Infrastructure.Data;
using System.Text.Json;
using IndustrialSync.Application.Models;

namespace IndustrialSync.Worker;

// Renomeamos para TelemetryWorker para evitar conflito com o namespace
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

            // Agora desserializamos para o tipo concreto TelemetryMessage
            var data = JsonSerializer.Deserialize<TelemetryMessage>(body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true // Importante caso o JSON venha com letras minúsculas
            });

            if (data != null)
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var telemetry = new SensorTelemetry(data.EquipmentCode, data.Temp, data.Press);

                context.Telemetries.Add(telemetry);
                await context.SaveChangesAsync();

                logger.LogInformation("Telemetry processed successfully: {Id} for {Code}", telemetry.Id, data.EquipmentCode);
            }

            await args.CompleteMessageAsync(args.Message);
        };

        processor.ProcessErrorAsync += args => {
            logger.LogError(args.Exception, "Error processing message");
            return Task.CompletedTask;
        };

        await processor.StartProcessingAsync(stoppingToken);

        // Mantém o serviço vivo
        await Task.Delay(-1, stoppingToken);
    }
}