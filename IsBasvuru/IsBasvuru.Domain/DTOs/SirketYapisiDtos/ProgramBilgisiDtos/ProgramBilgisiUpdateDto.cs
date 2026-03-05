namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.ProgramBilgisiDtos
{
    public class ProgramBilgisiUpdateDto
    {
        public int Id { get; set; }
        public int DepartmanId { get; set; }
        public int MasterProgramId { get; set; }
        public required string ProgramAdi { get; set; }
        public bool ProgramAktifMi { get; set; }
    }
}