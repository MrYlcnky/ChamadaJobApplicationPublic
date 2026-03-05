namespace IsBasvuru.Domain.DTOs.TanimlamalarDtos.SehirDtos
{
    public class SehirUpdateDto
    {
        public int Id { get; set; }
        public int UlkeId { get; set; }
        public required string SehirAdi { get; set; }
    }
}