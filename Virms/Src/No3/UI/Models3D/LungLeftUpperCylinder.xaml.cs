using System.Windows.Media;
using System.Windows.Media.Media3D;

namespace ViphApp.No3.UI.Models3D {
  public partial class LungLeftUpperCylinder : ModelVisual3D {
    public LungLeftUpperCylinder() {
      InitializeComponent();
    }

    public Brush Fill { get; set; }
  }
}
