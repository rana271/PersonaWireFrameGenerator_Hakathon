using Microsoft.AspNetCore.SignalR;

namespace Service.WireframeAI.Hubs;

public class WireframeHub : Hub
{
    public async Task JoinGenerationSession(string personaId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, personaId);
        await Clients.Caller.SendAsync("SessionAcknowledged", $"Connected to session: {personaId}");
    }
}