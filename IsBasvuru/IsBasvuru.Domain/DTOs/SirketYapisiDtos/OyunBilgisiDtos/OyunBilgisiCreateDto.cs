namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.OyunBilgisiDtos
{
    public class OyunBilgisiCreateDto
    {
        public int DepartmanId { get; set; }
        public required string OyunAdi { get; set; }
        public int MasterOyunId { get; set; }
        public string? MasterOyunAdi { get; set; }
        public bool OyunAktifMi { get; set; }
    }
}