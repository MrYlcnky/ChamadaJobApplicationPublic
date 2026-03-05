namespace IsBasvuru.Domain.DTOs.SirketYapisiDtos.ProgramBilgisiDtos
{
    public class ProgramBilgisiCreateDto
    {
        public int DepartmanId { get; set; }
        public int MasterProgramId { get; set; }
        public required string ProgramAdi { get; set; }
        public bool ProgramAktifMi { get; set; }
    }
}