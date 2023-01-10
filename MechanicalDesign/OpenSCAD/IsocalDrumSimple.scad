echo(version=version());

$fn=120;

outerRadius = 115;
innerRadius = 100;

color([0.95, 0.95, 0.95, 0.1])
  translate([0, 0, -120])
    difference()
    {
      cylinder(r=outerRadius, h=240);
      cylinder(r=innerRadius, h=240);
    }
