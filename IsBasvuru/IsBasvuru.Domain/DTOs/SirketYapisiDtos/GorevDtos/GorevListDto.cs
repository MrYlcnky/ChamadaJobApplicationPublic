namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.GorevDtos
{
    public class GorevListDto
    {
        public int Id { get; set; }
        public int MasterGorevId { get; set; }
        public string? MasterGorevAdi { get; set; } 

        public int MasterDepartmanId { get; set; }
        public string? MasterDepartmanAdi { get; set; }
    }
}