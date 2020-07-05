using System.Windows.Media;
using System.Windows.Media.Media3D;

namespace ViphApp.No3.UI.Models3D {
  public partial class StaticPLAStructureBlue : ModelVisual3D {
    public StaticPLAStructureBlue() {
      InitializeComponent();
    }

    //public static readonly DependencyProperty FillProperty = DependencyProperty.Register("Fill", typeof(Brush), typeof(ModelVisual3D));
    public Brush Fill { get; set; }
  }
}
