using System.Windows.Media;
using System.Windows.Media.Media3D;

namespace Virms.Isocal.UI.Models3D {
  public partial class CouchModel3D : ModelVisual3D {
    public CouchModel3D() {
      InitializeComponent();
    }

    public Brush Fill { get; set; }
  }
}
