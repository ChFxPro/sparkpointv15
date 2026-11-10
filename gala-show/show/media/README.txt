Put the show's videos, trip photos and sponsor logos in this folder.

The deck looks for these names out of the box (change them in the editor, E):

  Atlas-of-Wonders-Build-In-1440p30.mp4    plays once when the first loop page opens
  Atlas-of-Wonders-Loop-1440p30.mp4        the holding loop
  Atlas-of-Wonders-Build-Out-1440p30.mp4   plays when you move on from the loop
  highlights-1.mp4                         the "A year in pictures" video
  trips/<trip>/promo.mp4                   each featured trip's film
  trips/<trip>/<still>.webp                the photo on that trip's page (optional)

<trip> is the trip's id from the Gala trip kit: greece, iceland, cortona,
scotland, south-africa. The films and stills come from each trip's promo
pack (Branding/Gala/WorldOfConnections/trips/<trip>/pack/). Copy the film
in as promo.mp4. For the stills, run `npm run stills` in gala-show/: it
copies each featured trip's hero still here and puts its credit (from the
pack's stills.json) on the trip page. Most stills are Creative Commons and
must be shown with that credit; if you swap a photo by hand, fill in the
trip page's "Photo credit" from the pack's stills.json or LICENSES.md.

The three Atlas files are in the "SP Gala 26" drive folder, under
"Logo loop Render /delivery". Use the .mp4 files: Chrome can't play the
ProRes .mov masters.

Until the 3D loop is re-rendered with the new title, these files still say
An Atlas of Wonders. When the A World of Connections renders land, copy them
here and change the three file names on the loop page in the editor (E).

In the editor, "Check media files" lists anything the show can't find.
