namespace IsBasvuru.Domain.DTOs.TanimlamalarDtos.SehirDtos
{
    public class SehirCreateDto
    {
        public int UlkeId { get; set; }
        public required string SehirAdi { get; set; }
    }
}