namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanDtos
{
    public class DepartmanUpdateDto
    {
        public int Id { get; set; }
        public int SubeAlanId { get; set; }
        public int MasterDepartmanId { get; set; }
        public bool DepartmanAktifMi { get; set; }
    }
}