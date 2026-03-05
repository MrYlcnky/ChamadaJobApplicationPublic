namespace IsBasvuru.Domain.DTOs.TanimlamalarDtos.UyrukDtos
{
    public class UyrukUpdateDto
    {
        public int Id { get; set; }
        public int UlkeId { get; set; }
        public required string UyrukAdi { get; set; }
    }
}