// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
namespace Virms.Common {

  public class WebMotionPattern {
    private readonly IMophAppProxy _proxy;

    public WebMotionPattern(string name, int programId, IMophAppProxy mophApp, IWebMotionGenerator motionGenerator) {
      Name = name;
      ProgramId = programId;
      _proxy = mophApp;
      MotionGenerator = motionGenerator;

      MotionGenerator.ServoPositionChanged += OnServoPositionChanged;
    }  

    public string Name { get; }
    public int ProgramId { get; }
    public IWebMotionGenerator MotionGenerator { get; }

    public void Start() {
      MotionGenerator.Start(ProgramId);
    }

    public void Stop() {
      MotionGenerator.Stop();
    }

    private void OnServoPositionChanged(object sender, WebMotorPositionChangedEventArgs args) {
      _proxy.GoTo(new[] { args.Position });
    }
  }
}
