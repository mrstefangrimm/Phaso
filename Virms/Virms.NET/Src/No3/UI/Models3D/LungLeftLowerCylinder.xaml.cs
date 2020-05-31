using System.Windows.Media;
using System.Windows.Media.Media3D;

namespace ViphApp.No3.UI.Models3D {
  public partial class LungLeftLowerCylinder : ModelVisual3D {
    public LungLeftLowerCylinder() {
      InitializeComponent();
    }

    public Brush Fill { get; set; }
  }
}
