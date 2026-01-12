# 📋 Guide du partage d'événements/actualités

## 🎯 Vue d'ensemble

Le système permet de **partager une seule actualité entre plusieurs sections** du site sans duplication.

## 🔄 Sections disponibles

### 1. 🎠 Carrousel (Page d'accueil)
- Affiche les actualités en slider sur la page d'accueil
- Supporte images et PDFs
- Affichage visuel attractif

### 2. 📅 Calendrier (Page événements)
- Affiche les événements dans un calendrier interactif
- Permet de voir tous les événements du mois
- Clic sur une date pour voir les détails

### 3. 📋 Panneau d'affichage (Page d'accueil)
- Affiche les documents officiels par catégorie
- Système de filtrage par type (arrêtés, mariages, etc.)
- Gestion de durée d'affichage

## ✨ Comment partager une actualité

### Depuis le Carrousel Admin

1. **Créer ou modifier une actualité**
2. **Cocher les destinations** dans la section "📍 Afficher cette actualité dans :"
   - ☑️ Carrousel (par défaut)
   - ☑️ Calendrier
   - ☑️ Panneau d'affichage

3. **Enregistrer** → L'actualité apparaît automatiquement dans toutes les sections cochées

### Exemple d'utilisation

**Cas 1 : Événement de mariage**
```
✅ Carrousel (annonce visuelle)
✅ Calendrier (date de la cérémonie)
✅ Panneau d'affichage (ban de mariage officiel)
```

**Cas 2 : Simple actualité**
```
✅ Carrousel uniquement
```

**Cas 3 : Fête du village**
```
✅ Carrousel (affiche de l'événement)
✅ Calendrier (date de l'événement)
```

## 🔍 Identification visuelle

### Dans le Calendrier
- **Icône 🎠** = Événement partagé depuis le carrousel
- **Fond jaune clair** = Événement partagé
- **Impossible à modifier** depuis le calendrier (modifier depuis le carrousel)

### Dans le Tableau de gestion
- **Tags colorés** indiquent où l'actualité est partagée :
  - 🎠 (bleu) = Carrousel
  - 📅 (vert) = Calendrier
  - 📋 (jaune) = Panneau

## ⚙️ Modifications

### Pour modifier un événement partagé

1. **Aller dans le Carrousel Admin**
2. **Cliquer sur ✏️ Modifier**
3. **Modifier le contenu**
4. **Cocher/décocher les destinations**
5. **Enregistrer**

👉 Les modifications s'appliquent **automatiquement partout**

### Pour supprimer un événement partagé

1. **Aller dans le Carrousel Admin**
2. **Cliquer sur 🗑️ Supprimer**
3. **Confirmer**

👉 L'événement disparaît de **toutes les sections**

## 🎨 Avantages du système

1. **Pas de duplication** : Une seule saisie pour plusieurs affichages
2. **Cohérence** : Mêmes informations partout
3. **Gain de temps** : Modification unique
4. **Flexibilité** : Choix libre des destinations

## 🛠️ Structure technique

### Base de données
- Table `actualites` avec champ `afficherDans`
- Format : `"carrousel,calendrier,panneau"` (string séparée par virgules)

### API
- Route `/api/actualites` avec paramètre `afficherDans`
- Exemple : `/api/actualites?afficherDans=calendrier`

### Composants
- `CarrouselAdmin.jsx` : Gestion principale
- `CalendrierAdmin.jsx` : Récupère les événements marqués pour le calendrier
- `PageContentEditor.jsx` : Récupère les items pour le panneau

## 📝 Notes importantes

- Les événements créés **directement dans le Calendrier** ne peuvent pas être modifiés depuis le carrousel
- Les actualités **sans sélection** s'affichent uniquement dans le carrousel (par défaut)
- Le champ `description` est partagé entre toutes les sections
- Le champ `pdfUrl` permet d'attacher un document officiel

## 🔮 Évolutions futures possibles

- [ ] Partage vers les réseaux sociaux
- [ ] Export iCal pour le calendrier
- [ ] Notifications par email
- [ ] Archive automatique des anciennes actualités
