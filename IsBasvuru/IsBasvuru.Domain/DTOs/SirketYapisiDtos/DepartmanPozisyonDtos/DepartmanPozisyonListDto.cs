namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanPozisyonDtos
{
    public class DepartmanPozisyonListDto
    {
        public int Id { get; set; }

        public int MasterPozisyonId { get; set; }
        public required string PozisyonAdi { get; set; } 

        public bool DepartmanPozisyonAktifMi { get; set; }

        public int DepartmanId { get; set; }
        public string? DepartmanAdi { get; set; }
        public string? SubeAlanAdi { get; set; }
        public string? SubeAdi { get; set; }
    }
}