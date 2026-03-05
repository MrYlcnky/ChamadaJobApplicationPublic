namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanPozisyonDtos
{
    public class DepartmanPozisyonUpdateDto
    {
        public int Id { get; set; }
        public int DepartmanId { get; set; }
        public int MasterPozisyonId { get; set; } 
        public bool DepartmanPozisyonAktifMi { get; set; }
    }
}