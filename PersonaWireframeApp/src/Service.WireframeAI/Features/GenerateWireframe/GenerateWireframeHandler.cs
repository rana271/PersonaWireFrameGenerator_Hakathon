using Microsoft.AspNetCore.SignalR;
using Service.WireframeAI.Hubs;
using Service.WireframeAI.Domain;

namespace Service.WireframeAI.Features.GenerateWireframe;

public class GenerateWireframeHandler
{
    private readonly IHubContext<WireframeHub> _hubContext;

    public GenerateWireframeHandler(IHubContext<WireframeHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task ExecuteStreamingGenerationAsync(string connectionId, string prompt)
    {
        // Simulated structural layout stream targeting a banking scenario or custom persona prompt
        var simulatedBlocks = new List<LayoutBlock>
        {
            new() {
                Type = "steptracker",
                Variant = "primary",
                Props = new() { { "sectionHeader", "Identity Verification" } }
            },
            new() {
                Type = "FormSection",
                Variant = "default",
                Desc = "Customer Core KYC Intake",
                Fields = new() {
                    new() { { "id", "firstName" }, { "type", "text" }, { "label", "Legal First Name" } },
                    new() { { "id", "emailAddress" }, { "type", "email" }, { "label", "Email Address" } }
                }
            }
        };

        // Stream components sequentially down to the client layout canvas
        foreach (var block in simulatedBlocks)
        {
            await Task.Delay(1200); // Emulate network/LLM analytical compilation latency
            await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveLayoutBlock", block);
        }

        await _hubContext.Clients.Client(connectionId).SendAsync("GenerationCompleted", "Layout rendering finalized.");
    }
}