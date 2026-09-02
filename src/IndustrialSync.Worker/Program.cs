using IndustrialSync.Worker;
using IndustrialSync.Domain.Interfaces;
using IndustrialSync.Infrastructure.Data;
using IndustrialSync.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITelemetryRepository, TelemetryRepository>();

builder.Services.AddHostedService<TelemetryWorker>();

var host = builder.Build();
host.Run();