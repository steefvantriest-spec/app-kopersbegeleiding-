# Info-modal afbeeldingen (Home stat-tiles)

Deze map bevat de afbeeldingen voor de drie klikbare vakken op de homepage
(Paris Proof / 100% circulair casco / ±1 jaar bouwtijd), die elk een
bottom-sheet modal openen.

| Modal | Bestand |
|-------|---------|
| Paris Proof | `paris-proof.jpg` |
| 100% circulair casco | `circulair-casco.jpg` |
| ±1 jaar bouwtijd | `bouwtijd.jpg` |

De modal toont de afbeelding in een kader met dezelfde aspect ratio (≈1.414) en
`border-radius` (20px) als de bestaande IKC-modal. Omdat dit informatieve
diagrammen zijn (grafiek/tijdlijn/exploded view) gebruiken we `object-fit:contain`,
zodat labels en assen niet worden weggesneden.

> Om een afbeelding te updaten: vervang het bestand op **exact hetzelfde pad en
> dezelfde bestandsnaam** — geen codewijziging nodig.
