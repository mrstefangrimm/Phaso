// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Virms.Web.Core;

namespace Virms.Web {
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

      //services.AddSingleton<IRepository<MotionSystem>, MotionSystemInMemoryRepository>();
      services.AddSingleton<IRepository<MotionSystem>>(x => new MotionSystemSqliteRepository(_env.IsDevelopment()));
      

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

      app.UseStaticFiles();
      if (!env.IsDevelopment()) {
        app.UseSpaStaticFiles();
      }

      // CORS, e.g. UseCors before UseRouting: https://stackoverflow.com/questions/44379560/how-to-enable-cors-in-asp-net-core-webapi
      app.UseCors(
       options => options.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin()
       );
      app.UseCors(
       options => options.WithOrigins("https://mrstefangrimm.github.io")
       );
      app.UseCors(
       options => options.WithOrigins("https://live-phantoms.dynv6.net")
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
