// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
echo(version=version());

$fn=200;

outerRadius = 115;
innerRadius = 100;

rotate([-90, 0 ,0])
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
