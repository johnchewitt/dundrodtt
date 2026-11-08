# Circuit geometry provenance

- `owner-supplied-modern-trace-29902.json` — the owner's digitised trace
  (EPSG:29902). Verified: closed loop, clockwise, correct Dundrod
  geography; follows the post-1965 layout at the hairpin.
- `dundrod-1950s-corrected-29902.geojson` — the 1950-55 corrected route.
  Identical to the owner's trace except a 19-vertex hairpin spur spliced
  at the eastern corner: out along Upper Springfield Road, tight U at
  the old hairpin, back along the surviving (now dead-end) lane.
  Digitised from georeferenced current imagery of the surviving roads;
  shape corroborated by the 1954 RAC TT programme track map
  (`evidence-1954-programme-hairpin.jpg`, OS-based) and the documented
  1965 relocation of the hairpin (~110 m) with the Leathemstown Bridge
  section bypassed. The ~60 m across the modern yard at the U is
  approximate (flagged in feature properties). Leathemstown retained as
  supplied pending a period-sheet check.
- `/public/circuit/route.geojson` — the same corrected route in WGS84,
  served to the ArcGIS explorer.
- Measured length 12,313 m vs documented 7 mi 732 yd (11,935 m): +3.2%.
  The owner's base trace was +1.1%; commonly quoted old-vs-modern length
  figures (7.416 vs 7.401 mi) sit in tension with any sizeable spur —
  those figures were measured independently decades apart; the shape
  evidence is primary. Owner approved this provisional line 2026-11-08.
