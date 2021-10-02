using System.Windows.Media;
using System.Windows.Media.Media3D;

namespace Virms.No3.UI.Models3D {
  public partial class StaticPLAStructureWhite : ModelVisual3D {
    public StaticPLAStructureWhite() {
      InitializeComponent();
    }

    //public static readonly DependencyProperty FillProperty = DependencyProperty.Register("Fill", typeof(Brush), typeof(ModelVisual3D));
    public Brush Fill { get; set; }
  }
}
