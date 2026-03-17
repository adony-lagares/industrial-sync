using IndustrialSync.Worker;
using IndustrialSync.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);

// Registrar o DbContext no Worker também!
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registrar o serviço com o nome correto
builder.Services.AddHostedService<TelemetryWorker>();

var host = builder.Build();
host.Run();