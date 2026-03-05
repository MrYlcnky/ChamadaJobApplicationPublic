namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanDtos
{
    public class DepartmanListDto
    {
        public int Id { get; set; }

        public int MasterDepartmanId { get; set; }
        public required string DepartmanAdi { get; set; } 

        public bool DepartmanAktifMi { get; set; }

        public int SubeAlanId { get; set; }
        public string? SubeAlanAdi { get; set; }
        public string? SubeAdi { get; set; }
    }
}