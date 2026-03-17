using IndustrialSync.Domain.Entities;
using IndustrialSync.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Azure.Messaging.ServiceBus;

namespace IndustrialSync.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TelemetryController(ITelemetryRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var data = await repository.GetAllRecentAsync();
        return Ok(data);
    }

    [HttpPost]
    public async Task<IActionResult> Post(string equipmentCode, double temp, double press)
    {
        var client = HttpContext.RequestServices.GetRequiredService<ServiceBusClient>();
        var sender = client.CreateSender("telemetry-queue");

        var messageBody = System.Text.Json.JsonSerializer.Serialize(new { equipmentCode, temp, press });
        var message = new ServiceBusMessage(messageBody);

        await sender.SendMessageAsync(message);
        return Accepted(new { Status = "Sent to Queue" });
    }
}