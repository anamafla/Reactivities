//What's going on inside this class. When we use this web application CreateBuilder, it's going to do a bunch of things, but it's going to create something called a Kestrel server. 
//And it's also going to read from our configuration files, any configuration that we pass to it(appsettings.Development.json/ appsettings.json)
using API.Extensions;
using API.Middleware;
using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
var app = builder.Build();

// Configure the HTTP request pipeline.
// This is often referred to as middleware. And think of middleware for the time being as things that can do something with the HTTP request on
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try 
{
    var context = services.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();

