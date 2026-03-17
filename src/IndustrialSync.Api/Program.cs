using IndustrialSync.Domain.Interfaces;
using IndustrialSync.Infrastructure.Data;
using IndustrialSync.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Azure.Messaging.ServiceBus;

var builder = WebApplication.CreateBuilder(args);

// 1. Configura o Banco de Dados (Pega a connection string da Azure)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Injeção de Dependência: "Sempre que alguém pedir ITelemetryRepository, entregue o TelemetryRepository"
builder.Services.AddScoped<ITelemetryRepository, TelemetryRepository>();
builder.Services.AddSingleton(new ServiceBusClient(builder.Configuration.GetConnectionString("ServiceBus")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.MapControllers();

app.Run();