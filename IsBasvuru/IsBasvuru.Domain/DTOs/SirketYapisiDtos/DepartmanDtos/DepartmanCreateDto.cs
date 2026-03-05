namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanDtos
{
    public class DepartmanCreateDto
    {
        public int SubeAlanId { get; set; } // Hangi ofise bağlı?
        public int MasterDepartmanId { get; set; }
        public bool DepartmanAktifMi { get; set; } = true;
    }
}