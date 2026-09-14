# Visuels — « La nourrice du Sceau de l'Existence ﷺ »

Article de Bachir Touré, serviteur de la poésie khadimienne.

| Fichier | Format | Usage |
|---|---|---|
| `couverture.jpg` | 1600×900 (16:9) | **Image de couverture** de l'article — c'est le format que le blog attend |
| `partage-og.jpg` | 1200×630 | Aperçu au **partage** (WhatsApp, Facebook, X) |
| `vers-halima.jpg` | 1200×1200 | « صَلِّ عَلَى مَنْ ظِئْرُهُ حَلِيمَةْ » — le distique central |
| `vers-rabi-al-akhir.jpg` | 1200×1200 | « رَحَّبْتُ حُبًّا بِرَبِيعِ الْآخِرِ » |
| `vers-radaa.jpg` | 1200×1200 | « رَضَاعَةُ الْمُخْتَارِ ذِي الْمَفَاخِرِ » |
| `vers-choukr.jpg` | 1200×1200 | « يَا مُرْضِعَ الْمَحْبُوبِ ذِي الْمَفَاخِرِ » |
| `lignee-khuzayma.jpg` | 1200×1200 | La chaîne des aïeux, de ‘Adnân au Prophète ﷺ, avec خُزَيْمَة en évidence |
| `le-mot-zir.jpg` | 1200×1200 | Le mot « ظِئْر » et sa définition — la trouvaille linguistique de l'article |

Les carrés vont dans la **galerie** de l'article (« En images ») : ce sont eux
qu'on détache pour les envoyer sur WhatsApp.

## Ce qui a guidé ces visuels

**Aucune représentation figurative.** Ni le Prophète ﷺ, ni Halima, ni aucun
être animé : la tradition islamique s'y oppose, et un blog du Dahira ne peut
pas s'en affranchir. On s'en tient à ce que l'art musulman a toujours employé —
la calligraphie, la géométrie et la lumière.

Les polices sont celles du site : **Amiri** pour l'arabe (la même que les pages
du Dahira), Playfair et Crimson pour le français. Les couleurs sont celles de
la charte : vert #0F7C55, or #D4AF37, crème #F8F5EF.

## Les refaire

Les textes vivent dans `scripts/visuels-article.mjs`. Pour corriger un vers, une
traduction ou une couleur, on modifie le script et on relance :

```bash
npm install --no-save puppeteer-core
node scripts/visuels-article.mjs
```
