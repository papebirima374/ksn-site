# Visuels de citations (format Instagram)

Générateur de visuels islamiques carrés (1080×1080) et story (1080×1920)
à partir de citations en wolof.

## Ajouter une citation

Éditer `content/citations-visuels.json` :

```json
{
  "id": "02-mon-identifiant",
  "texte": "Le texte wolof, recopié tel quel",
  "signature": "Usmaan Sall Barñi",
  "theme": "vert"
}
```

- `id` : sert de nom de fichier, en minuscules sans espace.
- `texte` : jamais retouché par le script (orthographe wolof conservée).
- `signature` : facultatif, sinon `signatureParDefaut` du fichier.
- `theme` : `nuit` (défaut du projet), `vert`, `creme`, `emeraude`.
  Le défaut se change une fois pour toutes via `themeParDefaut`.
- `mention` : facultatif, petite ligne en capitales sous la signature.

## Générer

```bash
npm run visuels                          # toutes les citations, carré + story
npm run visuels -- --only=02-mon-id      # une seule citation
npm run visuels -- --formats=carre       # carré uniquement
npm run visuels -- --theme=nuit          # force un thème (suffixe dans le nom)
```

Sortie : `public/kit-assets/visuels/citations/<id>[-theme]-<format>.png`

## Notes techniques

- Rendu via Chrome/Chromium headless (`puppeteer-core`). Le script cherche
  le binaire automatiquement ; sinon définir `CHROME_PATH`.
- Les polices (Playfair Display, Amiri, Inter) sont téléchargées une fois
  dans `scripts/.fonts-cache` (ignoré par git) puis intégrées en base64,
  ce qui garantit un rendu identique sur toutes les machines.
- La taille du texte s'ajuste automatiquement (recherche dichotomique)
  pour remplir le cadre sans jamais déborder, quelle que soit la longueur
  de la citation.
