# Raynald Art

Portfolio Astro mettant en valeur les illustrations, portraits, croquis et services de mentorat de Raynald Monta.

## Démarrer

```bash
pnpm install
pnpm dev
```

## Scripts utiles

- `pnpm dev` : lance le serveur de développement sur `http://localhost:4321`.
- `pnpm build` : génère la version statique de production dans `dist/`.
- `pnpm preview` : sert le build localement pour vérification avant mise en ligne.

## Structure principale

- `src/pages/` : pages Astro (accueil, about, mentorat, portfolio et sous-catégories).
- `src/components/` : composants partagés (`Header`, `Footer`, `Gallery`, etc.).
- `public/images/` : médias affichés sur le site.
- `src/styles/` : feuilles de styles globales et spécifiques.

## Déploiement

Le site est configuré pour être publié en mode statique (`astro build`). Copiez le contenu de `dist/` vers votre hébergement (ou utilisez l’intégration de votre choix).
