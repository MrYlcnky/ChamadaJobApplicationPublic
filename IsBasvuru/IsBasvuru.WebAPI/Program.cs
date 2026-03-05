using FluentValidation;
using FluentValidation.AspNetCore;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Infrastructure.Services;
using IsBasvuru.Persistence.Context;
using IsBasvuru.Persistence.Services;
using IsBasvuru.WebAPI.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.HttpOverrides;

// 1. SERILOG BOOTSTRAP CONFIGURATION
var bootstrapConfiguration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
    .AddEnvironmentVariables()
    .Build();

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(bootstrapConfiguration)
    .CreateLogger();

try
{
    Log.Information("Starting application...");
    var builder = WebApplication.CreateBuilder(args);


    // 2. INTEGRATE SERILOG
    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext());

    // DATABASE CONNECTION
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    builder.Services.AddDbContext<IsBasvuruContext>(options =>
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

    // SERVICE REGISTRATIONS

    // Company & Definitions
    builder.Services.AddScoped<ISubeService, SubeService>();
    builder.Services.AddScoped<ISubeAlanService, SubeAlanService>();
    builder.Services.AddScoped<IDepartmanService, DepartmanService>();
    builder.Services.AddScoped<IDepartmanPozisyonService, DepartmanPozisyonService>();
    builder.Services.AddScoped<IPersonelEhliyetService, PersonelEhliyetService>();
    builder.Services.AddScoped<IUlkeService, UlkeService>();
    builder.Services.AddScoped<ISehirService, SehirService>();
    builder.Services.AddScoped<IIlceService, IlceService>();
    builder.Services.AddScoped<IUyrukService, UyrukService>();
    builder.Services.AddScoped<IDilService, DilService>();
    builder.Services.AddScoped<IEhliyetTuruService, EhliyetTuruService>();
    builder.Services.AddScoped<IKktcBelgeService, KktcBelgeService>();
    builder.Services.AddScoped<IKvkkService, KvkkService>();
    builder.Services.AddScoped<IOyunBilgisiService, OyunBilgisiService>();
    builder.Services.AddScoped<IProgramBilgisiService, ProgramBilgisiService>();

 

    // File & Image Services
    builder.Services.AddScoped<IImageService, ImageService>();

    // Personal Info Services
    builder.Services.AddScoped<IPersonelService, PersonelService>();
    builder.Services.AddScoped<IEgitimBilgisiService, EgitimBilgisiService>();
    builder.Services.AddScoped<IIsDeneyimiService, IsDeneyimiService>();
    builder.Services.AddScoped<IYabanciDilBilgisiService, YabanciDilBilgisiService>();
    builder.Services.AddScoped<ISertifikaBilgisiService, SertifikaBilgisiService>();
    builder.Services.AddScoped<IBilgisayarBilgisiService, BilgisayarBilgisiService>();
    builder.Services.AddScoped<IReferansBilgisiService, ReferansBilgisiService>();
    builder.Services.AddScoped<IDigerKisiselBilgilerService, DigerKisiselBilgilerService>();

    // Master App & Auth Services
    builder.Services.AddScoped<IMasterBasvuruService, MasterBasvuruService>();
    builder.Services.AddScoped<IPanelKullaniciService, PanelKullaniciService>();
    builder.Services.AddScoped<IRolService, RolService>();
    builder.Services.AddScoped<ILogService, LogService>();
    builder.Services.AddScoped<IKimlikDogrulamaService, KimlikDogrulamaService>();

    //Master-Alan Departman Pozisyon
    builder.Services.AddScoped<IMasterAlanService, MasterAlanService>();
    builder.Services.AddScoped<IMasterDepartmanService, MasterDepartmanService>();
    builder.Services.AddScoped<IMasterPozisyonService, MasterPozisyonService>();
    builder.Services.AddScoped<IMasterProgramService, MasterProgramService>();
    builder.Services.AddScoped<IMasterOyunService, MasterOyunService>();


    //Rol
    builder.Services.AddScoped<IAuthService, AuthService>();
    
    builder.Services.AddHttpContextAccessor(); 
    builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

    // Mail Service
    builder.Services.AddScoped<IMailService, MailService>();

    // AutoMapper
    builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

    // Caching
    builder.Services.AddMemoryCache();

    // VALIDATION
    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddFluentValidationClientsideAdapters();
    builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

    // CONTROLLER SETTINGS
    builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
            })
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                   
                    var errors = context.ModelState
                        .Where(e => e.Value != null && e.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value!.Errors)
                        .Select(x => x.ErrorMessage)
                        .ToList();

                    var errorMsg = string.Join(" | ", errors);
                    var response = IsBasvuru.Domain.Wrappers.ServiceResponse<IsBasvuru.Domain.DTOs.Shared.NoContent>.FailureResult(errorMsg);

                    return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(response);
                };
            });

    builder.Services.AddEndpointsApiExplorer();

    // SWAGGER SETTINGS
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "IsBasvuru API", Version = "v1" });

        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "Enter JWT Token as 'Bearer [space] token'. Example: Bearer eyJhbGciOi...",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement()
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    },
                    Scheme = "oauth2",
                    Name = "Bearer",
                    In = ParameterLocation.Header,
                },
                new List<string>()
            }
        });
    });

    // CORS SETTINGS
    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend",
            policy =>
            {
                if (allowedOrigins != null && allowedOrigins.Length > 0)
                {
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                }
                else
                {
                    // Dev environment: Allow Any
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                }
            });
    });

    // JWT AUTHENTICATION
    var jwtSettings = builder.Configuration.GetSection("JwtSettings");
    var secretKey = jwtSettings["Key"];

    if (string.IsNullOrEmpty(secretKey))
    {
        throw new Exception("Critical Error: JWT SecurityKey not found in configuration!");
    }

    var key = Encoding.UTF8.GetBytes(secretKey);

    builder.Services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(x =>
    {
        // Require HTTPS in Production
        x.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            RoleClaimType = System.Security.Claims.ClaimTypes.Role
        };
    });

    var app = builder.Build();

    var forwardedOptions = new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    };


    // Nesne oluştuktan sonra metotları çağırıyoruz
    forwardedOptions.KnownNetworks.Clear();
    forwardedOptions.KnownProxies.Clear();

    // Hazır olan nesneyi kullanıyoruz
    app.UseForwardedHeaders(forwardedOptions);


    // MIDDLEWARE PIPELINE


    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }
    else
    {
        // Production Security: HSTS
        app.UseHsts();
    }

    app.UseHttpsRedirection();

    // CORS must be before StaticFiles
    app.UseCors("AllowFrontend");

    app.UseStaticFiles();

    app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly! (Fatal Error)");
}
finally
{
    Log.CloseAndFlush();
}