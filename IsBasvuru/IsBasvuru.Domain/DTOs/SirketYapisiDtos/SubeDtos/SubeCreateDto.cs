namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeDtos
{
    public class SubeCreateDto
    {
        public required string SubeAdi { get; set; }
        public bool SubeAktifMi { get; set; } = true;
    }
}