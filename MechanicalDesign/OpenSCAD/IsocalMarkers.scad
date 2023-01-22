// Copyright (c) 2023 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//
echo(version=version());

$fn=15;

rotate([-90, 0 ,0])
{
  translate([0, 113, -75]) sphere(r=2);
  translate([79.903, 79.903, -75]) sphere(r=2);
  translate([79.903, -79.903, -75]) sphere(r=2);
  translate([-113, 0, -75]) sphere(r=2);
  translate([-79.903,  -79.903, -50]) sphere(r=2);
  translate([-79.903, 79.903, -50]) sphere(r=2);
  translate([113, 0, -30]) sphere(r=2);
  translate([0, -113, -20]) sphere(r=2);
  translate([-104.398, -43.243,  20]) sphere(r=2);
  translate([43.243, -104.398,  30]) sphere(r=2);
  translate([-104.398,  43.243,  50]) sphere(r=2);
  translate([43.243, 104.398,  50]) sphere(r=2);
  translate([104.398, 43.243,  75]) sphere(r=2);
  translate([104.398, -43.243,  75]) sphere(r=2);
  translate([-43.243, -104.398,  75]) sphere(r=2);
  translate([-43.243, 104.398,  75]) sphere(r=2);
}
