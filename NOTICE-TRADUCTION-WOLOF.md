# Traduction wolof du site KSN — notice

Merci d'accepter ce travail. Voici ce qu'il y a à faire et, surtout, ce à
quoi il faut faire attention.

## Où en est le site

Le site parle six langues. Le wolof est **à moitié fait** :

| | |
|---|---|
| Textes déjà en wolof | **364** |
| Textes à traduire | **306** |

Sur ces 306, **247 n'existent pas du tout** en wolof — le site affiche alors
le français à la personne qui a pourtant choisi « WO ». Les **59 autres** sont
plus gênants : quelqu'un a recopié le texte français dans la case wolof. Le
site se croit traduit, et personne ne s'en aperçoit.

## Les deux fichiers

**`traduction-wolof.csv` — le travail.**
Une ligne par texte à traduire, rangées par page du site. Vous remplissez
**uniquement la dernière colonne**, `WOLOF (à remplir)`.

**`traduction-wolof-faite.csv` — la relecture.**
Ce qui est déjà en wolof. À parcourir si vous avez le temps : corrigez dans la
dernière colonne, et laissez-la vide si la traduction vous convient.

Les deux s'ouvrent dans Excel, LibreOffice ou Google Sheets.

## Ce qu'il ne faut PAS traduire

**La colonne « Clé ».** C'est le nom interne du texte dans le site
(`faq.q1_1`, `nav.boutique`…). Si elle change, le texte ne s'affiche plus.

**Les variables entre accolades.** Elles sont remplacées par un nombre ou un
mot au moment de l'affichage. La colonne « Ne pas traduire » les signale.

> Français : `sur {target} — Challenge du milliard`
> Wolof : `… {target} …` ← `{target}` doit rester **exactement** ainsi

**Les noms propres :** Dahira, KSN, Salaatu, Touba, Khassida, Magal, Gàmmu, et
les noms de personnes. L'usage local les garde tels quels.

**Le symbole ﷺ.** À recopier tel quel, à la même place dans la phrase.

## Deux conseils

**Les boutons doivent rester courts.** Quand le français fait un ou deux mots
(« Voir plus », « Envoyer »), c'est un bouton : une traduction longue déborde
de son cadre sur un téléphone.

**Un mot français d'usage courant en wolof peut rester en français.** Si les
gens de Touba disent le mot en français dans la vie de tous les jours, ne
cherchez pas un équivalent savant. C'est vous qui jugez — c'est pour cela
qu'on vous demande.

## Deux libellés à vérifier en priorité

Ils sont déjà dans le fichier de relecture, et ils n'ont **pas** été écrits par
un locuteur — ils ont été formés par analogie avec les termes déjà présents
dans le site. Ils s'affichent dans la barre de navigation, sur toutes les
pages :

| Clé | Français | Wolof proposé |
|---|---|---|
| `nav.vie_spirituelle` | Vie spirituelle | **Diine ji** |
| `nav.actualites` | Actualités | **Xibaar yi** |

Si l'un des deux sonne faux, corrigez-le : c'est ce que des milliers de
visiteurs lisent en premier.

## Par où commencer

Si le temps manque, les pages les plus visitées d'abord :

1. **Page FAQ** — 49 textes, dont **39 recopiés du français** : c'est la page
   la plus trompeuse du site en l'état
2. **Page Challenge** — 48 textes
3. **Page Faire un don** — 32 textes
4. **Bibliothèque des Salaats** — 20 textes
5. **Page Spiritualité** — 18 textes

Jazaakumu Laahu khayran.
