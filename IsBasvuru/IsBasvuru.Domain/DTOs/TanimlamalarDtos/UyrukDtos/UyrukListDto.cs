namespace IsBasvuru.Domain.DTOs.TanimlamalarDtos.UyrukDtos
{
    public class UyrukListDto
    {
        public int Id { get; set; }
        public required string UyrukAdi { get; set; }

        // İlişki
        public int UlkeId { get; set; }
        public required string UlkeAdi { get; set; }
    }
}