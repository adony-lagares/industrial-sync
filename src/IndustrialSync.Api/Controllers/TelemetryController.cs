using IndustrialSync.Application.Models;
using IndustrialSync.Domain.Interfaces;
using IndustrialSync.Infrastructure.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace IndustrialSync.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TelemetryController(ITelemetryRepository repository, ServiceBusPublisher publisher) : ControllerBase
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
        if (string.IsNullOrWhiteSpace(equipmentCode))
            return BadRequest("equipmentCode is required.");

        if (double.IsNaN(temp) || temp < 0)
            return BadRequest("temp must be a non-negative number.");

        if (double.IsNaN(press) || press < 0)
            return BadRequest("press must be a non-negative number.");

        await publisher.PublishAsync(new TelemetryMessage(equipmentCode, temp, press));
        return Accepted(new { Status = "Sent to Queue" });
    }
}