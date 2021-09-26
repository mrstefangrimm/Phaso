using System.Windows.Media;
using System.Windows.Media.Media3D;

namespace ViphApp.No3.UI.Models3D {
  public partial class LungLeftModel3D : ModelVisual3D {
    public LungLeftModel3D() {
      InitializeComponent();
    }

    public Brush Fill { get; set; }
  }
}
