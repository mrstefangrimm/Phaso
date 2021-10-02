using System.Windows.Media;
using System.Windows.Media.Media3D;

namespace Virms.No3.UI.Models3D {
  public partial class LungRightModel3D : ModelVisual3D {
    public LungRightModel3D() {
      InitializeComponent();
    }

    public Brush Fill { get; set; }
  }
}
