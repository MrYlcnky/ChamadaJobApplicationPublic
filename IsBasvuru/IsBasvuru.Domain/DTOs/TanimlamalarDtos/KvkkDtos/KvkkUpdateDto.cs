namespace IsBasvuru.Domain.DTOs.TanimlamalarDtos.KvkkDtos
{
    public class KvkkUpdateDto
    {
        public int Id { get; set; }
        public required string DogrulukAciklamaTr { get; set; }
        public required string KvkkAciklamaTr { get; set; }
        public required string ReferansAciklamaTr { get; set; }
        public required string DogrulukAciklamaEn { get; set; }
        public required string KvkkAciklamaEn { get; set; }
        public required string ReferansAciklamaEn { get; set; }
    }
}