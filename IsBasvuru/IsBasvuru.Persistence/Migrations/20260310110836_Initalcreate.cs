using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace IsBasvuru.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initalcreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Diller",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DilAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Diller", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DogrulamaKodlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Eposta = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Kod = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GecerlilikTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    KullanildiMi = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DogrulamaKodlari", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EhliyetTurleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    EhliyetTuruAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EhliyetTurleri", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "KktcBelgeler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BelgeAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KktcBelgeler", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Kvkklar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DogrulukAciklamaTr = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KvkkAciklamaTr = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReferansAciklamaTr = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DogrulukAciklamaEn = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KvkkAciklamaEn = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReferansAciklamaEn = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KvkkVersiyon = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GuncellemeTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kvkklar", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MasterAlanlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MasterAlanAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterAlanlar", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MasterDepartmanlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MasterDepartmanAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterDepartmanlar", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MasterGorevler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MasterGorevAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterGorevler", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MasterOyunlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MasterOyunAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterOyunlar", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MasterPozisyonlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MasterPozisyonAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterPozisyonlar", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MasterProgramlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MasterProgramAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterProgramlar", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Personeller",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    GuncellemeTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Personeller", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Roller",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RolAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RolTanimi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roller", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Subeler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SubeAdi = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SubeAktifMi = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subeler", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Ulkeler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UlkeAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ulkeler", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Gorevler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MasterGorevId = table.Column<int>(type: "int", nullable: false),
                    MasterDepartmanId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gorevler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Gorevler_MasterDepartmanlar_MasterDepartmanId",
                        column: x => x.MasterDepartmanId,
                        principalTable: "MasterDepartmanlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Gorevler_MasterGorevler_MasterGorevId",
                        column: x => x.MasterGorevId,
                        principalTable: "MasterGorevler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BasvuruOnaylari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    KvkkId = table.Column<int>(type: "int", nullable: false),
                    OnayDurum = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IpAdres = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KullaniciCihaz = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KvkkVersiyon = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DogrulukAciklamaTr = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KvkkAciklamaTr = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReferansAciklamaTr = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OnayTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BasvuruOnaylari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BasvuruOnaylari_Kvkklar_KvkkId",
                        column: x => x.KvkkId,
                        principalTable: "Kvkklar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BasvuruOnaylari_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BilgisayarBilgileri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    ProgramAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Yetkinlik = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BilgisayarBilgileri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BilgisayarBilgileri_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DigerKisiselBilgileri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    KktcBelgeId = table.Column<int>(type: "int", nullable: false),
                    DavaDurumu = table.Column<int>(type: "int", nullable: false),
                    DavaNedeni = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SigaraKullanimi = table.Column<int>(type: "int", nullable: false),
                    AskerlikDurumu = table.Column<int>(type: "int", nullable: false),
                    KaliciRahatsizlik = table.Column<int>(type: "int", nullable: false),
                    KaliciRahatsizlikAciklama = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EhliyetDurumu = table.Column<int>(type: "int", nullable: false),
                    Boy = table.Column<int>(type: "int", nullable: false),
                    Kilo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DigerKisiselBilgileri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DigerKisiselBilgileri_KktcBelgeler_KktcBelgeId",
                        column: x => x.KktcBelgeId,
                        principalTable: "KktcBelgeler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DigerKisiselBilgileri_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EgitimBilgileri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    EgitimSeviyesi = table.Column<int>(type: "int", nullable: false),
                    OkulAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Bolum = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DiplomaDurum = table.Column<int>(type: "int", nullable: false),
                    NotSistemi = table.Column<int>(type: "int", nullable: false),
                    Gano = table.Column<decimal>(type: "decimal(4,2)", nullable: true),
                    BaslangicTarihi = table.Column<DateTime>(type: "date", nullable: false),
                    BitisTarihi = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EgitimBilgileri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EgitimBilgileri_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "IsBasvuruDetaylari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    LojmanTalebiVarMi = table.Column<int>(type: "int", nullable: false),
                    NedenBiz = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IsBasvuruDetaylari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetaylari_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MasterBasvurular",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    BasvuruTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    BasvuruDurum = table.Column<int>(type: "int", nullable: false),
                    BasvuruOnayAsamasi = table.Column<int>(type: "int", nullable: false),
                    BasvuruVersiyonNo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MasterBasvurular", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MasterBasvurular_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PersonelEhliyetleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    EhliyetTuruId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonelEhliyetleri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PersonelEhliyetleri_EhliyetTurleri_EhliyetTuruId",
                        column: x => x.EhliyetTuruId,
                        principalTable: "EhliyetTurleri",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PersonelEhliyetleri_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ReferansBilgileri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    CalistigiKurum = table.Column<int>(type: "int", nullable: false),
                    ReferansAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReferansSoyadi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsYeri = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Gorev = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReferansTelefon = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReferansBilgileri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReferansBilgileri_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SertifikaBilgileri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    SertifikaAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KurumAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Suresi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    VerilisTarihi = table.Column<DateTime>(type: "date", nullable: false),
                    GecerlilikTarihi = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SertifikaBilgileri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SertifikaBilgileri_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "YabanciDilBilgileri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    DilId = table.Column<int>(type: "int", nullable: false),
                    DigerDilAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KonusmaSeviyesi = table.Column<int>(type: "int", nullable: false),
                    YazmaSeviyesi = table.Column<int>(type: "int", nullable: false),
                    OkumaSeviyesi = table.Column<int>(type: "int", nullable: false),
                    DinlemeSeviyesi = table.Column<int>(type: "int", nullable: false),
                    NasilOgrenildi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YabanciDilBilgileri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_YabanciDilBilgileri_Diller_DilId",
                        column: x => x.DilId,
                        principalTable: "Diller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_YabanciDilBilgileri_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PanelKullanicilari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RolId = table.Column<int>(type: "int", nullable: false),
                    SubeId = table.Column<int>(type: "int", nullable: true),
                    MasterAlanId = table.Column<int>(type: "int", nullable: true),
                    MasterDepartmanId = table.Column<int>(type: "int", nullable: true),
                    KullaniciAdi = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Adi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Soyadi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    KullaniciSifre = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SonGirisTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PanelKullanicilari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PanelKullanicilari_MasterAlanlar_MasterAlanId",
                        column: x => x.MasterAlanId,
                        principalTable: "MasterAlanlar",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PanelKullanicilari_MasterDepartmanlar_MasterDepartmanId",
                        column: x => x.MasterDepartmanId,
                        principalTable: "MasterDepartmanlar",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PanelKullanicilari_Roller_RolId",
                        column: x => x.RolId,
                        principalTable: "Roller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PanelKullanicilari_Subeler_SubeId",
                        column: x => x.SubeId,
                        principalTable: "Subeler",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SubeAlanlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SubeId = table.Column<int>(type: "int", nullable: false),
                    MasterAlanId = table.Column<int>(type: "int", nullable: false),
                    SubeAlanAktifMi = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubeAlanlar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubeAlanlar_MasterAlanlar_MasterAlanId",
                        column: x => x.MasterAlanId,
                        principalTable: "MasterAlanlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SubeAlanlar_Subeler_SubeId",
                        column: x => x.SubeId,
                        principalTable: "Subeler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Sehirler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UlkeId = table.Column<int>(type: "int", nullable: false),
                    SehirAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sehirler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sehirler_Ulkeler_UlkeId",
                        column: x => x.UlkeId,
                        principalTable: "Ulkeler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Uyruklar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UlkeId = table.Column<int>(type: "int", nullable: false),
                    UyrukAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Uyruklar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Uyruklar_Ulkeler_UlkeId",
                        column: x => x.UlkeId,
                        principalTable: "Ulkeler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "IsBasvuruDetaySubeler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IsBasvuruDetayId = table.Column<int>(type: "int", nullable: false),
                    SubeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IsBasvuruDetaySubeler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetaySubeler_IsBasvuruDetaylari_IsBasvuruDetayId",
                        column: x => x.IsBasvuruDetayId,
                        principalTable: "IsBasvuruDetaylari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetaySubeler_Subeler_SubeId",
                        column: x => x.SubeId,
                        principalTable: "Subeler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CvDegisiklikLoglari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MasterBasvuruId = table.Column<int>(type: "int", nullable: true),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    DegisenKayitId = table.Column<int>(type: "int", nullable: false),
                    DegisenTabloAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DegisenAlanAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EskiDeger = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    YeniDeger = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DegisiklikTipi = table.Column<int>(type: "int", nullable: false),
                    DegisiklikTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CvDegisiklikLoglari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CvDegisiklikLoglari_MasterBasvurular_MasterBasvuruId",
                        column: x => x.MasterBasvuruId,
                        principalTable: "MasterBasvurular",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CvDegisiklikLoglari_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BasvuruIslemLoglari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MasterBasvuruId = table.Column<int>(type: "int", nullable: false),
                    PanelKullaniciId = table.Column<int>(type: "int", nullable: true),
                    RolId = table.Column<int>(type: "int", nullable: true),
                    BasvuruDurum = table.Column<int>(type: "int", nullable: true),
                    BasvuruOnayAsamasi = table.Column<int>(type: "int", nullable: true),
                    IslemTipi = table.Column<int>(type: "int", nullable: false),
                    IslemAciklama = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IslemTarihi = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BasvuruIslemLoglari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BasvuruIslemLoglari_MasterBasvurular_MasterBasvuruId",
                        column: x => x.MasterBasvuruId,
                        principalTable: "MasterBasvurular",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BasvuruIslemLoglari_PanelKullanicilari_PanelKullaniciId",
                        column: x => x.PanelKullaniciId,
                        principalTable: "PanelKullanicilari",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "GorevAtamaDetaylari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    MasterDepartmanId = table.Column<int>(type: "int", nullable: false),
                    GorevId = table.Column<int>(type: "int", nullable: false),
                    PanelKullaniciId = table.Column<int>(type: "int", nullable: false),
                    NetUcret = table.Column<int>(type: "int", nullable: false),
                    TalepEdilenGorevGenelButcesi = table.Column<int>(type: "int", nullable: false),
                    BaslangicTarihi = table.Column<DateTime>(type: "date", nullable: false),
                    TalepNedeni = table.Column<int>(type: "int", nullable: false),
                    YerineAlinacakKisiAdSoyad = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GorevAtamaDetaylari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GorevAtamaDetaylari_Gorevler_GorevId",
                        column: x => x.GorevId,
                        principalTable: "Gorevler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GorevAtamaDetaylari_MasterDepartmanlar_MasterDepartmanId",
                        column: x => x.MasterDepartmanId,
                        principalTable: "MasterDepartmanlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GorevAtamaDetaylari_PanelKullanicilari_PanelKullaniciId",
                        column: x => x.PanelKullaniciId,
                        principalTable: "PanelKullanicilari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GorevAtamaDetaylari_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Departmanlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SubeAlanId = table.Column<int>(type: "int", nullable: false),
                    MasterDepartmanId = table.Column<int>(type: "int", nullable: false),
                    DepartmanAktifMi = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departmanlar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Departmanlar_MasterDepartmanlar_MasterDepartmanId",
                        column: x => x.MasterDepartmanId,
                        principalTable: "MasterDepartmanlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Departmanlar_SubeAlanlar_SubeAlanId",
                        column: x => x.SubeAlanId,
                        principalTable: "SubeAlanlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "IsBasvuruDetayAlanlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IsBasvuruDetayId = table.Column<int>(type: "int", nullable: false),
                    SubeAlanId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IsBasvuruDetayAlanlari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetayAlanlari_IsBasvuruDetaylari_IsBasvuruDetayId",
                        column: x => x.IsBasvuruDetayId,
                        principalTable: "IsBasvuruDetaylari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetayAlanlari_SubeAlanlar_SubeAlanId",
                        column: x => x.SubeAlanId,
                        principalTable: "SubeAlanlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Ilceler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SehirId = table.Column<int>(type: "int", nullable: false),
                    IlceAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ilceler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ilceler_Sehirler_SehirId",
                        column: x => x.SehirId,
                        principalTable: "Sehirler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "IsDeneyimleri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    UlkeId = table.Column<int>(type: "int", nullable: true),
                    SehirId = table.Column<int>(type: "int", nullable: true),
                    SirketAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Departman = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Pozisyon = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Gorev = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ucret = table.Column<int>(type: "int", nullable: false),
                    UlkeAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SehirAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BaslangicTarihi = table.Column<DateTime>(type: "date", nullable: false),
                    BitisTarihi = table.Column<DateTime>(type: "date", nullable: true),
                    AyrilisSebep = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IsDeneyimleri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IsDeneyimleri_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IsDeneyimleri_Sehirler_SehirId",
                        column: x => x.SehirId,
                        principalTable: "Sehirler",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_IsDeneyimleri_Ulkeler_UlkeId",
                        column: x => x.UlkeId,
                        principalTable: "Ulkeler",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DepartmanPozisyonlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DepartmanId = table.Column<int>(type: "int", nullable: false),
                    MasterPozisyonId = table.Column<int>(type: "int", nullable: false),
                    DepartmanPozisyonAktifMi = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepartmanPozisyonlar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DepartmanPozisyonlar_Departmanlar_DepartmanId",
                        column: x => x.DepartmanId,
                        principalTable: "Departmanlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DepartmanPozisyonlar_MasterPozisyonlar_MasterPozisyonId",
                        column: x => x.MasterPozisyonId,
                        principalTable: "MasterPozisyonlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "IsBasvuruDetayDepartmanlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IsBasvuruDetayId = table.Column<int>(type: "int", nullable: false),
                    DepartmanId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IsBasvuruDetayDepartmanlari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetayDepartmanlari_Departmanlar_DepartmanId",
                        column: x => x.DepartmanId,
                        principalTable: "Departmanlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetayDepartmanlari_IsBasvuruDetaylari_IsBasvuruDeta~",
                        column: x => x.IsBasvuruDetayId,
                        principalTable: "IsBasvuruDetaylari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OyunBilgileri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DepartmanId = table.Column<int>(type: "int", nullable: false),
                    OyunAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MasterOyunId = table.Column<int>(type: "int", nullable: false),
                    OyunAktifMi = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OyunBilgileri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OyunBilgileri_Departmanlar_DepartmanId",
                        column: x => x.DepartmanId,
                        principalTable: "Departmanlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OyunBilgileri_MasterOyunlar_MasterOyunId",
                        column: x => x.MasterOyunId,
                        principalTable: "MasterOyunlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProgramBilgileri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DepartmanId = table.Column<int>(type: "int", nullable: false),
                    MasterProgramId = table.Column<int>(type: "int", nullable: false),
                    ProgramAdi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProgramAktifMi = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgramBilgileri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProgramBilgileri_Departmanlar_DepartmanId",
                        column: x => x.DepartmanId,
                        principalTable: "Departmanlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProgramBilgileri_MasterProgramlar_MasterProgramId",
                        column: x => x.MasterProgramId,
                        principalTable: "MasterProgramlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "KisiselBilgileri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PersonelId = table.Column<int>(type: "int", nullable: false),
                    UyrukId = table.Column<int>(type: "int", nullable: true),
                    UyrukAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DogumUlkeId = table.Column<int>(type: "int", nullable: true),
                    DogumUlkeAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DogumSehirId = table.Column<int>(type: "int", nullable: true),
                    DogumSehirAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DogumIlceId = table.Column<int>(type: "int", nullable: true),
                    DogumIlceAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IkametgahUlkeId = table.Column<int>(type: "int", nullable: true),
                    IkametgahUlkeAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IkametgahSehirId = table.Column<int>(type: "int", nullable: true),
                    IkametgahSehirAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IkametgahIlceId = table.Column<int>(type: "int", nullable: true),
                    IkametgahIlceAdi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ad = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Soyadi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Telefon = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TelefonWhatsapp = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Adres = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DogumTarihi = table.Column<DateTime>(type: "date", nullable: false),
                    Cinsiyet = table.Column<int>(type: "int", nullable: false),
                    MedeniDurum = table.Column<int>(type: "int", nullable: false),
                    CocukSayisi = table.Column<int>(type: "int", nullable: true),
                    VesikalikFotograf = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KisiselBilgileri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KisiselBilgileri_Ilceler_DogumIlceId",
                        column: x => x.DogumIlceId,
                        principalTable: "Ilceler",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_KisiselBilgileri_Ilceler_IkametgahIlceId",
                        column: x => x.IkametgahIlceId,
                        principalTable: "Ilceler",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_KisiselBilgileri_Personeller_PersonelId",
                        column: x => x.PersonelId,
                        principalTable: "Personeller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KisiselBilgileri_Sehirler_DogumSehirId",
                        column: x => x.DogumSehirId,
                        principalTable: "Sehirler",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_KisiselBilgileri_Sehirler_IkametgahSehirId",
                        column: x => x.IkametgahSehirId,
                        principalTable: "Sehirler",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_KisiselBilgileri_Ulkeler_DogumUlkeId",
                        column: x => x.DogumUlkeId,
                        principalTable: "Ulkeler",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_KisiselBilgileri_Ulkeler_IkametgahUlkeId",
                        column: x => x.IkametgahUlkeId,
                        principalTable: "Ulkeler",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_KisiselBilgileri_Uyruklar_UyrukId",
                        column: x => x.UyrukId,
                        principalTable: "Uyruklar",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "IsBasvuruDetayPozisyonlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IsBasvuruDetayId = table.Column<int>(type: "int", nullable: false),
                    DepartmanPozisyonId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IsBasvuruDetayPozisyonlari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetayPozisyonlari_DepartmanPozisyonlar_DepartmanPoz~",
                        column: x => x.DepartmanPozisyonId,
                        principalTable: "DepartmanPozisyonlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetayPozisyonlari_IsBasvuruDetaylari_IsBasvuruDetay~",
                        column: x => x.IsBasvuruDetayId,
                        principalTable: "IsBasvuruDetaylari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "IsBasvuruDetayOyunlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IsBasvuruDetayId = table.Column<int>(type: "int", nullable: false),
                    OyunBilgisiId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IsBasvuruDetayOyunlari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetayOyunlari_IsBasvuruDetaylari_IsBasvuruDetayId",
                        column: x => x.IsBasvuruDetayId,
                        principalTable: "IsBasvuruDetaylari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetayOyunlari_OyunBilgileri_OyunBilgisiId",
                        column: x => x.OyunBilgisiId,
                        principalTable: "OyunBilgileri",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "IsBasvuruDetayProgramlari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IsBasvuruDetayId = table.Column<int>(type: "int", nullable: false),
                    ProgramBilgisiId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IsBasvuruDetayProgramlari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetayProgramlari_IsBasvuruDetaylari_IsBasvuruDetayId",
                        column: x => x.IsBasvuruDetayId,
                        principalTable: "IsBasvuruDetaylari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IsBasvuruDetayProgramlari_ProgramBilgileri_ProgramBilgisiId",
                        column: x => x.ProgramBilgisiId,
                        principalTable: "ProgramBilgileri",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Roller",
                columns: new[] { "Id", "RolAdi", "RolTanimi" },
                values: new object[,]
                {
                    { 1, "SuperAdmin", "Tam yetkili, her şeyi gören ve müdahale eden yönetici." },
                    { 2, "Admin", "İK Müdürü, sistem tanımları ve kullanıcı atamaları yöneticisi." },
                    { 3, "IkAdmin", "Başvuru yönetimi, log görüntüleme ve revize onay yetkilisi." },
                    { 4, "IK", "Başvuru yönetimi ve revize işlemleri (Kısıtlı yetki)." },
                    { 5, "GenelMudur", "Üst düzey başvuru değerlendirme ve onay merci." },
                    { 6, "DepartmanMudur", "İlgili departmana gelen başvuruları değerlendirme merci." },
                    { 7, "MaliIslerMudur", "Adaya teklif edilen maaş ve kadro bütçesinin uygunluğunu denetleyip finansal onay veren merci." }
                });

            migrationBuilder.InsertData(
                table: "PanelKullanicilari",
                columns: new[] { "Id", "Adi", "KullaniciAdi", "KullaniciSifre", "MasterAlanId", "MasterDepartmanId", "RolId", "SonGirisTarihi", "Soyadi", "SubeId" },
                values: new object[] { 1, "Sistem", "SuperAdmin", "$2a$11$v7tUh0sfE41ZtdoAuuEO.emlTQzkMKgnygwNaRnBYJTkbaSDJETsK", null, null, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Yöneticisi", null });

            migrationBuilder.CreateIndex(
                name: "IX_BasvuruIslemLoglari_MasterBasvuruId",
                table: "BasvuruIslemLoglari",
                column: "MasterBasvuruId");

            migrationBuilder.CreateIndex(
                name: "IX_BasvuruIslemLoglari_PanelKullaniciId",
                table: "BasvuruIslemLoglari",
                column: "PanelKullaniciId");

            migrationBuilder.CreateIndex(
                name: "IX_BasvuruOnaylari_KvkkId",
                table: "BasvuruOnaylari",
                column: "KvkkId");

            migrationBuilder.CreateIndex(
                name: "IX_BasvuruOnaylari_PersonelId",
                table: "BasvuruOnaylari",
                column: "PersonelId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BilgisayarBilgileri_PersonelId",
                table: "BilgisayarBilgileri",
                column: "PersonelId");

            migrationBuilder.CreateIndex(
                name: "IX_CvDegisiklikLoglari_MasterBasvuruId",
                table: "CvDegisiklikLoglari",
                column: "MasterBasvuruId");

            migrationBuilder.CreateIndex(
                name: "IX_CvDegisiklikLoglari_PersonelId",
                table: "CvDegisiklikLoglari",
                column: "PersonelId");

            migrationBuilder.CreateIndex(
                name: "IX_Departmanlar_MasterDepartmanId",
                table: "Departmanlar",
                column: "MasterDepartmanId");

            migrationBuilder.CreateIndex(
                name: "IX_Departmanlar_SubeAlanId",
                table: "Departmanlar",
                column: "SubeAlanId");

            migrationBuilder.CreateIndex(
                name: "IX_DepartmanPozisyonlar_DepartmanId",
                table: "DepartmanPozisyonlar",
                column: "DepartmanId");

            migrationBuilder.CreateIndex(
                name: "IX_DepartmanPozisyonlar_MasterPozisyonId",
                table: "DepartmanPozisyonlar",
                column: "MasterPozisyonId");

            migrationBuilder.CreateIndex(
                name: "IX_DigerKisiselBilgileri_KktcBelgeId",
                table: "DigerKisiselBilgileri",
                column: "KktcBelgeId");

            migrationBuilder.CreateIndex(
                name: "IX_DigerKisiselBilgileri_PersonelId",
                table: "DigerKisiselBilgileri",
                column: "PersonelId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EgitimBilgileri_PersonelId",
                table: "EgitimBilgileri",
                column: "PersonelId");

            migrationBuilder.CreateIndex(
                name: "IX_GorevAtamaDetaylari_GorevId",
                table: "GorevAtamaDetaylari",
                column: "GorevId");

            migrationBuilder.CreateIndex(
                name: "IX_GorevAtamaDetaylari_MasterDepartmanId",
                table: "GorevAtamaDetaylari",
                column: "MasterDepartmanId");

            migrationBuilder.CreateIndex(
                name: "IX_GorevAtamaDetaylari_PanelKullaniciId",
                table: "GorevAtamaDetaylari",
                column: "PanelKullaniciId");

            migrationBuilder.CreateIndex(
                name: "IX_GorevAtamaDetaylari_PersonelId",
                table: "GorevAtamaDetaylari",
                column: "PersonelId");

            migrationBuilder.CreateIndex(
                name: "IX_Gorevler_MasterDepartmanId",
                table: "Gorevler",
                column: "MasterDepartmanId");

            migrationBuilder.CreateIndex(
                name: "IX_Gorevler_MasterGorevId",
                table: "Gorevler",
                column: "MasterGorevId");

            migrationBuilder.CreateIndex(
                name: "IX_Ilceler_SehirId",
                table: "Ilceler",
                column: "SehirId");

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetayAlanlari_IsBasvuruDetayId_SubeAlanId",
                table: "IsBasvuruDetayAlanlari",
                columns: new[] { "IsBasvuruDetayId", "SubeAlanId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetayAlanlari_SubeAlanId",
                table: "IsBasvuruDetayAlanlari",
                column: "SubeAlanId");

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetayDepartmanlari_DepartmanId",
                table: "IsBasvuruDetayDepartmanlari",
                column: "DepartmanId");

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetayDepartmanlari_IsBasvuruDetayId_DepartmanId",
                table: "IsBasvuruDetayDepartmanlari",
                columns: new[] { "IsBasvuruDetayId", "DepartmanId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetaylari_PersonelId",
                table: "IsBasvuruDetaylari",
                column: "PersonelId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetayOyunlari_IsBasvuruDetayId_OyunBilgisiId",
                table: "IsBasvuruDetayOyunlari",
                columns: new[] { "IsBasvuruDetayId", "OyunBilgisiId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetayOyunlari_OyunBilgisiId",
                table: "IsBasvuruDetayOyunlari",
                column: "OyunBilgisiId");

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetayPozisyonlari_DepartmanPozisyonId",
                table: "IsBasvuruDetayPozisyonlari",
                column: "DepartmanPozisyonId");

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetayPozisyonlari_IsBasvuruDetayId",
                table: "IsBasvuruDetayPozisyonlari",
                column: "IsBasvuruDetayId");

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetayProgramlari_IsBasvuruDetayId_ProgramBilgisiId",
                table: "IsBasvuruDetayProgramlari",
                columns: new[] { "IsBasvuruDetayId", "ProgramBilgisiId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetayProgramlari_ProgramBilgisiId",
                table: "IsBasvuruDetayProgramlari",
                column: "ProgramBilgisiId");

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetaySubeler_IsBasvuruDetayId_SubeId",
                table: "IsBasvuruDetaySubeler",
                columns: new[] { "IsBasvuruDetayId", "SubeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IsBasvuruDetaySubeler_SubeId",
                table: "IsBasvuruDetaySubeler",
                column: "SubeId");

            migrationBuilder.CreateIndex(
                name: "IX_IsDeneyimleri_PersonelId",
                table: "IsDeneyimleri",
                column: "PersonelId");

            migrationBuilder.CreateIndex(
                name: "IX_IsDeneyimleri_SehirId",
                table: "IsDeneyimleri",
                column: "SehirId");

            migrationBuilder.CreateIndex(
                name: "IX_IsDeneyimleri_UlkeId",
                table: "IsDeneyimleri",
                column: "UlkeId");

            migrationBuilder.CreateIndex(
                name: "IX_KisiselBilgileri_DogumIlceId",
                table: "KisiselBilgileri",
                column: "DogumIlceId");

            migrationBuilder.CreateIndex(
                name: "IX_KisiselBilgileri_DogumSehirId",
                table: "KisiselBilgileri",
                column: "DogumSehirId");

            migrationBuilder.CreateIndex(
                name: "IX_KisiselBilgileri_DogumUlkeId",
                table: "KisiselBilgileri",
                column: "DogumUlkeId");

            migrationBuilder.CreateIndex(
                name: "IX_KisiselBilgileri_Email",
                table: "KisiselBilgileri",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_KisiselBilgileri_IkametgahIlceId",
                table: "KisiselBilgileri",
                column: "IkametgahIlceId");

            migrationBuilder.CreateIndex(
                name: "IX_KisiselBilgileri_IkametgahSehirId",
                table: "KisiselBilgileri",
                column: "IkametgahSehirId");

            migrationBuilder.CreateIndex(
                name: "IX_KisiselBilgileri_IkametgahUlkeId",
                table: "KisiselBilgileri",
                column: "IkametgahUlkeId");

            migrationBuilder.CreateIndex(
                name: "IX_KisiselBilgileri_PersonelId",
                table: "KisiselBilgileri",
                column: "PersonelId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_KisiselBilgileri_UyrukId",
                table: "KisiselBilgileri",
                column: "UyrukId");

            migrationBuilder.CreateIndex(
                name: "IX_MasterBasvurular_PersonelId",
                table: "MasterBasvurular",
                column: "PersonelId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OyunBilgileri_DepartmanId",
                table: "OyunBilgileri",
                column: "DepartmanId");

            migrationBuilder.CreateIndex(
                name: "IX_OyunBilgileri_MasterOyunId",
                table: "OyunBilgileri",
                column: "MasterOyunId");

            migrationBuilder.CreateIndex(
                name: "IX_PanelKullanicilari_KullaniciAdi",
                table: "PanelKullanicilari",
                column: "KullaniciAdi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PanelKullanicilari_MasterAlanId",
                table: "PanelKullanicilari",
                column: "MasterAlanId");

            migrationBuilder.CreateIndex(
                name: "IX_PanelKullanicilari_MasterDepartmanId",
                table: "PanelKullanicilari",
                column: "MasterDepartmanId");

            migrationBuilder.CreateIndex(
                name: "IX_PanelKullanicilari_RolId",
                table: "PanelKullanicilari",
                column: "RolId");

            migrationBuilder.CreateIndex(
                name: "IX_PanelKullanicilari_SubeId",
                table: "PanelKullanicilari",
                column: "SubeId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonelEhliyetleri_EhliyetTuruId",
                table: "PersonelEhliyetleri",
                column: "EhliyetTuruId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonelEhliyetleri_PersonelId",
                table: "PersonelEhliyetleri",
                column: "PersonelId");

            migrationBuilder.CreateIndex(
                name: "IX_ProgramBilgileri_DepartmanId",
                table: "ProgramBilgileri",
                column: "DepartmanId");

            migrationBuilder.CreateIndex(
                name: "IX_ProgramBilgileri_MasterProgramId",
                table: "ProgramBilgileri",
                column: "MasterProgramId");

            migrationBuilder.CreateIndex(
                name: "IX_ReferansBilgileri_PersonelId",
                table: "ReferansBilgileri",
                column: "PersonelId");

            migrationBuilder.CreateIndex(
                name: "IX_Sehirler_UlkeId",
                table: "Sehirler",
                column: "UlkeId");

            migrationBuilder.CreateIndex(
                name: "IX_SertifikaBilgileri_PersonelId",
                table: "SertifikaBilgileri",
                column: "PersonelId");

            migrationBuilder.CreateIndex(
                name: "IX_SubeAlanlar_MasterAlanId",
                table: "SubeAlanlar",
                column: "MasterAlanId");

            migrationBuilder.CreateIndex(
                name: "IX_SubeAlanlar_SubeId",
                table: "SubeAlanlar",
                column: "SubeId");

            migrationBuilder.CreateIndex(
                name: "IX_Subeler_SubeAdi",
                table: "Subeler",
                column: "SubeAdi",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Uyruklar_UlkeId",
                table: "Uyruklar",
                column: "UlkeId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_YabanciDilBilgileri_DilId",
                table: "YabanciDilBilgileri",
                column: "DilId");

            migrationBuilder.CreateIndex(
                name: "IX_YabanciDilBilgileri_PersonelId",
                table: "YabanciDilBilgileri",
                column: "PersonelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BasvuruIslemLoglari");

            migrationBuilder.DropTable(
                name: "BasvuruOnaylari");

            migrationBuilder.DropTable(
                name: "BilgisayarBilgileri");

            migrationBuilder.DropTable(
                name: "CvDegisiklikLoglari");

            migrationBuilder.DropTable(
                name: "DigerKisiselBilgileri");

            migrationBuilder.DropTable(
                name: "DogrulamaKodlari");

            migrationBuilder.DropTable(
                name: "EgitimBilgileri");

            migrationBuilder.DropTable(
                name: "GorevAtamaDetaylari");

            migrationBuilder.DropTable(
                name: "IsBasvuruDetayAlanlari");

            migrationBuilder.DropTable(
                name: "IsBasvuruDetayDepartmanlari");

            migrationBuilder.DropTable(
                name: "IsBasvuruDetayOyunlari");

            migrationBuilder.DropTable(
                name: "IsBasvuruDetayPozisyonlari");

            migrationBuilder.DropTable(
                name: "IsBasvuruDetayProgramlari");

            migrationBuilder.DropTable(
                name: "IsBasvuruDetaySubeler");

            migrationBuilder.DropTable(
                name: "IsDeneyimleri");

            migrationBuilder.DropTable(
                name: "KisiselBilgileri");

            migrationBuilder.DropTable(
                name: "PersonelEhliyetleri");

            migrationBuilder.DropTable(
                name: "ReferansBilgileri");

            migrationBuilder.DropTable(
                name: "SertifikaBilgileri");

            migrationBuilder.DropTable(
                name: "YabanciDilBilgileri");

            migrationBuilder.DropTable(
                name: "Kvkklar");

            migrationBuilder.DropTable(
                name: "MasterBasvurular");

            migrationBuilder.DropTable(
                name: "KktcBelgeler");

            migrationBuilder.DropTable(
                name: "Gorevler");

            migrationBuilder.DropTable(
                name: "PanelKullanicilari");

            migrationBuilder.DropTable(
                name: "OyunBilgileri");

            migrationBuilder.DropTable(
                name: "DepartmanPozisyonlar");

            migrationBuilder.DropTable(
                name: "ProgramBilgileri");

            migrationBuilder.DropTable(
                name: "IsBasvuruDetaylari");

            migrationBuilder.DropTable(
                name: "Ilceler");

            migrationBuilder.DropTable(
                name: "Uyruklar");

            migrationBuilder.DropTable(
                name: "EhliyetTurleri");

            migrationBuilder.DropTable(
                name: "Diller");

            migrationBuilder.DropTable(
                name: "MasterGorevler");

            migrationBuilder.DropTable(
                name: "Roller");

            migrationBuilder.DropTable(
                name: "MasterOyunlar");

            migrationBuilder.DropTable(
                name: "MasterPozisyonlar");

            migrationBuilder.DropTable(
                name: "Departmanlar");

            migrationBuilder.DropTable(
                name: "MasterProgramlar");

            migrationBuilder.DropTable(
                name: "Personeller");

            migrationBuilder.DropTable(
                name: "Sehirler");

            migrationBuilder.DropTable(
                name: "MasterDepartmanlar");

            migrationBuilder.DropTable(
                name: "SubeAlanlar");

            migrationBuilder.DropTable(
                name: "Ulkeler");

            migrationBuilder.DropTable(
                name: "MasterAlanlar");

            migrationBuilder.DropTable(
                name: "Subeler");
        }
    }
}
