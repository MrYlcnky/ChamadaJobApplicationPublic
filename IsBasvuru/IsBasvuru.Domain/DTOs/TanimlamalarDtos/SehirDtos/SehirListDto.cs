namespace IsBasvuru.Domain.DTOs.TanimlamalarDtos.SehirDtos
{
    public class SehirListDto
    {
        public int Id { get; set; }
        public required string SehirAdi { get; set; }

        // İlişki
        public int UlkeId { get; set; }
        public required string UlkeAdi { get; set; }
    }
}