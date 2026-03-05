namespace IsBasvuru.Domain.DTOs.KimlikDogrulamaDtos
{
    public class KodGonderDto
    {
        public required string Eposta { get; set; }
        public bool KayitliKullaniciKontrolu { get; set; } = false;
    }
}