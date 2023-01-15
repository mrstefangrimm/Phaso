echo(version=version());

$fn=200;

outerRadius = 115;
innerRadius = 100;

color([0.95, 0.95, 0.95, 0.1])
  translate([0, 0, 0])
    difference()
    {
      cylinder(r=outerRadius, h=240, center=true);
      {
        cylinder(r=innerRadius, h=240, center=true);
        translate([outerRadius-1.5, 0, 0]) cube([2, 2, 240], center=true);
        translate([-outerRadius+1.5, 0, 0]) cube([2, 3, 240], center=true);
        translate([0, outerRadius-1.5, 0]) cube([2, 3, 240], center=true);
        translate([0, -outerRadius+1.5, 0]) cube([2, 3, 240], center=true);
        difference()
        {
          cylinder(r=outerRadius, h=2, center=true);
          cylinder(r=outerRadius-3, h=2, center=true);
        }
      }
    }
