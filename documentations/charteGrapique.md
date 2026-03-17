# DOCUMENTATION DE CG(charte graphique)

Cette documentation détaille la configuration du Design System mise en place avec Tailwind CSS v4. L'objectif est de centraliser les styles pour garantir la cohérence visuelle entre les différents modules du projet.

## 1. FICHIERS CONCERNES

Le système repose sur la modification du fichier CSS principal :
- Chemin : src/index.css

## 2. ARCHITECTURE DE CONFIGURATION

Le fichier utilise la nouvelle syntaxe @theme de Tailwind v4 pour injecter des variables CSS natives dans le moteur de rendu.

### A. Typographie et Font-Family
La police Poppins est importée et définie comme police sans-serif globale.
- Import : Google Fonts (Poids 300 à 800)
- Classe utilitaire : font-sans

### B. Tailles de texte personnalisées
Des classes utilitaires de texte ont été créées pour correspondre aux maquettes Figma :
- .text-hero : 4rem (64px) - Utilisation : Titres majeurs de page d'accueil.
- .text-title : 2.25rem (36px) - Utilisation : Titres de sections.
- .text-subtitle : 1.25rem (20px) - Utilisation : Titres de cartes et sous-titres.
- .text-body : 1rem (16px) - Utilisation : Corps de texte standard.

### C. Palette de Couleurs Sémantiques
Les couleurs sont indexées sur des variables sémantiques pour faciliter la maintenance.

| Identifiant | Classe Tailwind | Usage |
|-------------|-----------------|-------|
| Primary | bg-primary-default | Identité visuelle (Vert) |
| Secondary | bg-secondary-default | Actions secondaires (Bleu) |
| Accent | text-accent-foreground | Mise en avant (Jaune) |
| Success | bg-success | Validation et succès (Vert) |
| Danger | bg-danger | Erreurs et alertes (Rouge) |
| Info | bg-info | Notifications et infos (Bleu ciel) |

## 3. GESTION DU MODE SOMBRE (DARK MODE)

Le système utilise la variante dark native. Les couleurs s'adaptent automatiquement :
- background : Passe du blanc pur au oklch sombre.
- neutral-text : Passe du gris foncé (clair) au gris très clair (sombre).

Il est impératif d'utiliser la classe .text-neutral-text pour tous les textes standards afin d'assurer cette transition automatique.

## 4. GUIDE D'UTILISATION (EXEMPLES)

### Structure d'un titre Hero
<h1 class="text-hero font-bold text-neutral-text">
  TITRE PRINCIPAL <span class="text-accent-foreground">MOT CLE</span>
</h1>

### Bouton d'action standard
```jsx
<button class="bg-primary-default text-primary-foreground px-4 py-2 rounded-lg">
  Texte du bouton
</button>
```

### Message d'erreur de formulaire
```jsx
<p class="text-danger font-medium text-body">
  Message d'erreur ici.
</p>
```
## 5. REGLAGES DES ARRONDIS

Tous les composants doivent suivre la variable de radius globale :
- Variable : --radius (0.625rem)
- Classe : rounded-lg (ou rounded-md/sm selon le contexte)