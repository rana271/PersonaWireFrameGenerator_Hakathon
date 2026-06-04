using Service.WireframeAI.Hubs;
using Service.WireframeAI.Features.GenerateWireframe;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddScoped<GenerateWireframeHandler>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite default port
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Your exact Vite frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // <-- CRITICAL FOR SIGNALR NEGOTIATION
    });
});
var app = builder.Build();

app.UseCors();

// SignalR WebSocket Hub Mapping
app.MapHub<WireframeHub>("/wireframehub");

// Execution triggering endpoint
app.MapPost("/api/wireframe/generate", async (string connectionId, string prompt, GenerateWireframeHandler handler) =>
{
    if (string.IsNullOrWhiteSpace(prompt)) return Results.BadRequest("Prompt text is required.");

    // Background execution safely isolated from blocking the primary HTTP transport context
    _ = handler.ExecuteStreamingGenerationAsync(connectionId, prompt);
    return Results.Accepted();
});

app.Run();