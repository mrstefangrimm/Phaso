using System.Windows.Media;
using System.Windows.Media.Media3D;

namespace Virms.No3.UI.Models3D {
  public partial class ThoraxBackPlate : ModelVisual3D {
    public ThoraxBackPlate() {
      InitializeComponent();
    }

    public Brush Fill { get; set; }
  }
}
