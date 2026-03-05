namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeDtos
{
    public class SubeUpdateDto
    {
        public int Id { get; set; }
        public required string SubeAdi { get; set; }
        public bool SubeAktifMi { get; set; }
    }
}