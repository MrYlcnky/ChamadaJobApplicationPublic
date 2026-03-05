namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeAlanDtos
{
    public class SubeAlanUpdateDto
    {
        public int Id { get; set; }
        public int SubeId { get; set; }
        public int MasterAlanId { get; set; } 
        public bool SubeAlanAktifMi { get; set; }
    }
}