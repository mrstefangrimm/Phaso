// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Web {
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Hosting;
  using Microsoft.AspNetCore.SpaServices.AngularCli;
  using Microsoft.Extensions.Configuration;
  using Microsoft.Extensions.DependencyInjection;
  using Microsoft.Extensions.Hosting;
  using Virms.Common;
  using Virms.Web.Core;

  public class Startup {

    private readonly IWebHostEnvironment _env;

    public Startup(IConfiguration configuration, IWebHostEnvironment env) {
      Configuration = configuration;
      _env = env;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services) {
      services.AddControllersWithViews();

      services.AddSingleton<ApplicationApi>();

      services.AddSingleton(
        (System.Func<System.IServiceProvider, IRepository<Core.MotionSystem>>)(
        // MotionSystemSqliteRepository, MotionSystemInMemoryRepository
        x => new MotionSystemSqliteRepository(
          // MophAppProxy, FakeEchoMophAppProxy, FakeRandomMophAppProxy
          new MophAppProxyFactory<MophAppProxy>(),
          _env.IsDevelopment())));
      

      // In production, the Angular files will be served from this directory
      services.AddSpaStaticFiles(configuration => {
        configuration.RootPath = "ClientApp/dist";
      });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {

      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
      }
      else {
        app.UseExceptionHandler("/Error");
      }

      // for live images:
      app.UseStaticFiles();

      // CORS, e.g. UseCors before UseRouting: https://stackoverflow.com/questions/44379560/how-to-enable-cors-in-asp-net-core-webapi
      var cors = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("AppSettings")["CORS"];
      app.UseCors(
        options => options.WithOrigins(cors).AllowAnyMethod().AllowAnyHeader()
       );

      app.UseRouting();

      app.UseEndpoints(endpoints => {
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action=Index}/{id?}");
      });

      app.UseSpa(spa => {
        // To learn more about options for serving an Angular SPA from ASP.NET Core,
        // see https://go.microsoft.com/fwlink/?linkid=864501

        spa.Options.SourcePath = "ClientApp";

        if (env.IsDevelopment()) {
          spa.UseAngularCliServer(npmScript: "start");
        }
      });
    }
  }
}
