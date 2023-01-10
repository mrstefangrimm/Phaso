echo(version=version());

$fn=90;

outerRadius = 115;
innerRadius = 100;

color([0.95, 0.95, 0.95, 0.1])
  difference()
  {
    {
      translate([0, 0, -120])
        difference()
        {
          cylinder(r=outerRadius, h=240);
          cylinder(r=innerRadius, h=240);
        }
    }
    {
      translate([0, 113, -75]) sphere(r=2, $fn=15);
      translate([79.903, 79.903, -75]) sphere(r=2, $fn=15);
      translate([79.903, -79.903, -75]) sphere(r=2, $fn=15);
      translate([-113, 0, -75]) sphere(r=2);
      translate([-79.903,  -79.903, -50]) sphere(r=2, $fn=15);
      translate([-79.903, 79.903, -50]) sphere(r=2, $fn=15);
      translate([113, 0, -30]) sphere(r=2, $fn=15);
      translate([0, -113, -20]) sphere(r=2, $fn=15);
      translate([-104.398, -43.243,  20]) sphere(r=2, $fn=15);
      translate([43.243, -104.398,  30]) sphere(r=2, $fn=15);
      translate([-104.398,  43.243,  50]) sphere(r=2, $fn=15);
      translate([43.243, 104.398,  50]) sphere(r=2, $fn=15);
      translate([104.398, 43.243,  75]) sphere(r=2, $fn=15);
      translate([104.398, -43.243,  75]) sphere(r=2, $fn=15);
      translate([-43.243, -104.398,  75]) sphere(r=2, $fn=15);
      translate([-43.243, 104.398,  75]) sphere(r=2, $fn=15);
    }
  }
