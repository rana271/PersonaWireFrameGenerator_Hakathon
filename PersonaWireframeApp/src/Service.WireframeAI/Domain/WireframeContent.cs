namespace Service.WireframeAI.Domain
{
    public class WireframeContent
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string PageTitle { get; set; } = string.Empty;
        public List<LayoutBlock> Layout { get; set; } = new();
    }
    public class LayoutBlock
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Type { get; set; } = string.Empty; // e.g., "steptracker", "FormSection"
        public Dictionary<string, object> Props { get; set; } = new();
        public string Desc { get; set; } = string.Empty;
        public string Variant { get; set; } = "default"; // e.g., "primary", "info", "warn"
        public List<Dictionary<string, object>> Fields { get; set; } = new();
    }
}
