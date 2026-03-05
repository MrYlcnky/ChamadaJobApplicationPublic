namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeAlanDtos
{
    public class SubeAlanListDto
    {
        public int Id { get; set; }
        public int SubeId { get; set; }
        public required string SubeAdi { get; set; } 

        public int MasterAlanId { get; set; }
        public required string AlanAdi { get; set; } 

        public bool SubeAlanAktifMi { get; set; }
    }
}