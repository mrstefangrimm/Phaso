using System.Windows.Media;
using System.Windows.Media.Media3D;

namespace Virms.No3.UI.Models3D {
  public partial class SkeletonModel3D : ModelVisual3D {
    public SkeletonModel3D() {
      InitializeComponent();
    }

    public Brush Fill { get; set; }
  }
}
