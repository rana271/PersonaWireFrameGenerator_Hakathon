var builder = WebApplication.CreateBuilder(args);

// Quick reverse proxy routing configurations setup mapping to microservices
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.MapReverseProxy();

app.Run();