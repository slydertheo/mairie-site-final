# Tests du système de partage d'événements

## Test 1 : Récupérer toutes les actualités
```bash
curl http://localhost:3000/api/actualites
```

## Test 2 : Récupérer uniquement les actualités pour le calendrier
```bash
curl "http://localhost:3000/api/actualites?afficherDans=calendrier"
```

## Test 3 : Récupérer uniquement les actualités pour le panneau
```bash
curl "http://localhost:3000/api/actualites?afficherDans=panneau"
```

## Test 4 : Créer une actualité partagée (via Postman ou curl)
```bash
curl -X POST http://localhost:3000/api/actualites \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Événement Partagé",
    "date": "2026-02-14",
    "description": "Ceci est un test",
    "imgSrc": "https://via.placeholder.com/400",
    "afficherDans": "carrousel,calendrier,panneau"
  }'
```

## Test 5 : Vérifier dans la base de données
```bash
sqlite3 database/mairie.sqlite "SELECT id, title, afficherDans FROM actualites ORDER BY id DESC LIMIT 5;"
```

## Test 6 : Mettre à jour une actualité existante
```bash
curl -X PUT http://localhost:3000/api/actualites \
  -H "Content-Type: application/json" \
  -d '{
    "id": 30,
    "title": "Soirée autrichienne (Modifiée)",
    "date": "2025-11-15",
    "description": "Grande soirée festive",
    "imgSrc": "...",
    "afficherDans": "carrousel,calendrier,panneau"
  }'
```

## Vérifications visuelles dans l'interface

### Dans CarrouselAdmin
1. Ouvrir `/admin` ou la page d'admin
2. Aller dans "Gestion du carrousel"
3. Créer une nouvelle actualité
4. Cocher **Carrousel** et **Calendrier**
5. Enregistrer
6. Vérifier dans le tableau : les tags 🎠 et 📅 doivent apparaître

### Dans CalendrierAdmin
1. Ouvrir la gestion du calendrier
2. L'événement créé doit apparaître dans le calendrier
3. Il doit avoir un fond jaune clair
4. Une icône 🎠 doit apparaître
5. Les boutons ✏️ et 🗑️ ne doivent PAS être disponibles

### Modification depuis le Carrousel
1. Modifier l'actualité depuis CarrouselAdmin
2. Décocher **Calendrier**
3. Enregistrer
4. Retourner dans CalendrierAdmin
5. L'événement doit avoir disparu du calendrier

## Tests SQL directs

### Voir toutes les actualités avec leur partage
```sql
SELECT 
  id, 
  title, 
  date, 
  afficherDans,
  CASE 
    WHEN afficherDans LIKE '%carrousel%' THEN '🎠 '
    ELSE ''
  END ||
  CASE 
    WHEN afficherDans LIKE '%calendrier%' THEN '📅 '
    ELSE ''
  END ||
  CASE 
    WHEN afficherDans LIKE '%panneau%' THEN '📋'
    ELSE ''
  END as "Où"
FROM actualites 
ORDER BY date DESC;
```

### Compter par type de partage
```sql
SELECT 
  afficherDans,
  COUNT(*) as nombre
FROM actualites
GROUP BY afficherDans;
```

### Trouver les actualités multi-partagées
```sql
SELECT 
  id,
  title,
  afficherDans
FROM actualites
WHERE afficherDans LIKE '%,%'
ORDER BY id DESC;
```

## Résultats attendus

✅ **CarrouselAdmin** : 
- Checkboxes pour sélectionner les destinations
- Tags colorés dans le tableau
- Notification d'aide en haut

✅ **CalendrierAdmin** :
- Événements partagés affichés avec fond jaune
- Icône 🎠 pour les événements partagés
- Impossible de modifier/supprimer les événements partagés
- Notification d'aide en haut

✅ **API** :
- Filtrage par `afficherDans` fonctionne
- Création avec `afficherDans` enregistre correctement
- Mise à jour conserve le format correct

✅ **Base de données** :
- Colonne `afficherDans` existe
- Format : `"carrousel,calendrier,panneau"` (string)
- Valeur par défaut : `"carrousel"`
