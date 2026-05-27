# Photos de la Journée Salaatu ʿAlaa Nabii

Dossier prévu pour les photos officielles des éditions précédentes,
affichées dans la galerie de `/journee-salaatu`.

## Ajouter une vraie photo

1. Place le fichier ici, par exemple :
   - `public/images/journee/2024-recital-coran.jpg`
   - `public/images/journee/2024-rajass.webp`
2. Édite `components/sections/JourneeGallery.tsx` et remplace `src: null`
   par le chemin de la photo dans le tableau `ITEMS`.
3. Renseigne `caption` et `year` pour le contexte.

## Conseils

- Format recommandé : **WebP** (~50 % plus léger que JPEG)
- Dimension : **1600×1200 px max** suffisent largement (la galerie sert
  des thumbnails 4:3 et un lightbox plein écran)
- Poids : **< 250 KB** par image idéalement (Next/Image optimise auto
  pour les autres formats / tailles à la volée)
- Ne mets PAS de visages d'enfants identifiables sans autorisation
  parentale (RGPD/CCTV).
