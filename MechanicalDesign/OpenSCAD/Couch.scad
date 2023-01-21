// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
echo(version=version());

$fn=60;

couchLength = 1000;
couchWidth = 500;
couchDepth = 40;

color([0.95, 0.95, 0.95, 0.1])
  //rotate([-90, 0 ,0])
    translate([-couchWidth/2, 0, -couchLength + 200])
      {
        difference()
        {
          hull()
          {
            cube([couchWidth, couchDepth, couchLength]);
            translate([0, couchDepth/2, 0])
              cylinder(r=couchDepth/2, h=couchLength);
            translate([couchWidth, couchDepth/2, 0])
              cylinder(r=couchDepth/2, h=couchLength);
            translate([0, couchDepth/2, 0])
              rotate([0, 90, 0])
                cylinder(r=couchDepth/2, h=couchWidth);
            translate([0, couchDepth/2, couchLength])
              rotate([0, 90, 0])
                cylinder(r=couchDepth/2, h=couchWidth);
            translate([0, couchDepth/2, 0])
              sphere(d=couchDepth);
            translate([couchWidth, couchDepth/2, 0])
              sphere(d=couchDepth);
            translate([0, couchDepth/2, couchLength])
              sphere(d=couchDepth);
            translate([couchWidth, couchDepth/2, couchLength])
              sphere(d=couchDepth);
          }
          rotate([90, 0, 0])
            translate([-10, couchLength - 60, -couchDepth/2])
              cylinder(r=15, h=couchDepth/2);
          rotate([90, 0, 0])
            translate([-10, couchLength - 180, -couchDepth/2])
              cylinder(r=15, h=couchDepth/2);
          rotate([90, 0, 0])
            translate([-10, couchLength - 300, -couchDepth/2])
              cylinder(r=15, h=couchDepth/2);
          rotate([90, 0, 0])
            translate([couchWidth+10, couchLength - 60, -couchDepth/2])
              cylinder(r=15, h=couchDepth/2);
          rotate([90, 0, 0])
            translate([couchWidth+10, couchLength - 180, -couchDepth/2])
              cylinder(r=15, h=couchDepth/2);
          rotate([90, 0, 0])
            translate([couchWidth+10, couchLength - 300, -couchDepth/2])
              cylinder(r=15, h=couchDepth/2);
        }
      }
