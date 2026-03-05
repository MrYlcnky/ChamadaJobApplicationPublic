namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanPozisyonDtos
{
    public class DepartmanPozisyonCreateDto
    {
        public int DepartmanId { get; set; }
        public int MasterPozisyonId { get; set; }
        public bool DepartmanPozisyonAktifMi { get; set; } = true;
    }
}