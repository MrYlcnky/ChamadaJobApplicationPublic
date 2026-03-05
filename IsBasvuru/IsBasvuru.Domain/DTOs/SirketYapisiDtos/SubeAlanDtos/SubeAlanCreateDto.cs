namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeAlanDtos
{
    public class SubeAlanCreateDto
    {
        public int SubeId { get; set; } // Hangi şubeye bağlı?
        public int MasterAlanId { get; set; }
        public bool SubeAlanAktifMi { get; set; } = true;
    }
}