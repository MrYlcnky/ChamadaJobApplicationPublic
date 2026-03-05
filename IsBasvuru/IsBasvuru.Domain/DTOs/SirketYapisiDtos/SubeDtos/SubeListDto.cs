namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeDtos
{
    public class SubeListDto
    {
        public int Id { get; set; }
        public required string SubeAdi { get; set; }
        public bool SubeAktifMi { get; set; }
    }
}