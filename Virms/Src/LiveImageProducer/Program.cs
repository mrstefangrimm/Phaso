// Copyright (c) 2021 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
using Emgu.CV;
using Emgu.CV.Structure;
using System;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace LiveImageProducer {
  class Program {
    static void Main(string[] args) {

      int cameraIndex;
      if (!int.TryParse(ConfigurationManager.AppSettings["CameraIndex"], out cameraIndex)) {
        Console.WriteLine($"Unable to parse camera index from '{ConfigurationManager.AppSettings["CameraIndex"]}'");
        return;
      }

      var cts = new CancellationTokenSource();

      var task = Task.Factory.StartNew(() => {

        var cameraCapture = new VideoCapture(cameraIndex);

        while (!cts.Token.IsCancellationRequested) {
          try {
            using Mat frame = cameraCapture.QueryFrame();

            using var fullImg = frame.ToImage<Bgr, byte>();
            string pathFullImg = Path.Combine(ConfigurationManager.AppSettings["OutputDir"], "full-live.jpg");
            fullImg.Save(pathFullImg);

            fullImg.ROI = new Rectangle(0, 0, 200, 480);
            using var img1 = fullImg.Copy();
            string pathFirstImg = Path.Combine(ConfigurationManager.AppSettings["OutputDir"], "first-live.jpg");
            img1.Save(pathFirstImg);

            fullImg.ROI = new Rectangle(200, 0, 200, 480);
            using var img2 = fullImg.Copy();
            string pathSecondImg = Path.Combine(ConfigurationManager.AppSettings["OutputDir"], "second-live.jpg");
            img2.Save(pathSecondImg);

            fullImg.ROI = new Rectangle(400, 0, 240, 480);
            using var img3 = fullImg.Copy();
            string pathThirdImg = Path.Combine(ConfigurationManager.AppSettings["OutputDir"], "third-live.jpg");
            img3.Save(pathThirdImg);

            Thread.Sleep(250);
          }
          catch (Exception e) {
            Console.WriteLine(e.Message);
            Thread.Sleep(2000);
          }
        }
        cameraCapture.Dispose();
      });

      Console.WriteLine("Running until you stop.");
      Console.ReadKey();

      // Request cancellation.
      cts.Cancel();
      Console.WriteLine("Cancellation set in token source...");
      Thread.Sleep(1000);
      // Cancellation should have happened, so call Dispose.
      cts.Dispose();
    }
  }
}
