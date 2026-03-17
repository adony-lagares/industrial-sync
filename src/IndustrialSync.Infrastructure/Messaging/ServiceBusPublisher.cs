using Azure.Messaging.ServiceBus;
using System.Text.Json;

namespace IndustrialSync.Infrastructure.Messaging;

public class ServiceBusPublisher(string connectionString, string queueName)
{
    public async Task PublishAsync<T>(T message)
    {
        await using var client = new ServiceBusClient(connectionString);
        ServiceBusSender sender = client.CreateSender(queueName);

        string messageBody = JsonSerializer.Serialize(message);
        ServiceBusMessage sbMessage = new(messageBody);

        await sender.SendMessageAsync(sbMessage);
    }
}