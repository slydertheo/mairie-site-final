-- Table des utilisateurs (admins, secrétaires, etc.)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- À stocker hashé avec bcrypt ou similaire
    email TEXT NOT NULL UNIQUE,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    derniere_connexion TIMESTAMP,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Table des rôles (admin, secrétaire, etc.)
CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Table des permissions spécifiques
CREATE TABLE permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL
);

-- Table de liaison entre rôles et permissions
CREATE TABLE role_permissions (
    role_id INTEGER,
    permission_id INTEGER,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Table pour le contenu modifiable des pages
CREATE TABLE page_contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,        -- Nom de la page (ex: "infos_pratiques")
    section TEXT NOT NULL,     -- Identifiant de la section (ex: "contacts", "dechets")
    titre TEXT,
    contenu TEXT,
    derniere_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by INTEGER,
    FOREIGN KEY (modified_by) REFERENCES users(id),
    UNIQUE (page, section)
);

-- Table des événements et manifestations
CREATE TABLE evenements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    lieu TEXT,
    inscription BOOLEAN DEFAULT 0,
    image TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Table des bulletins municipaux
CREATE TABLE bulletins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    date TEXT NOT NULL,
    fichier TEXT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Table des contacts et services
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service TEXT NOT NULL,
    numero TEXT,
    details TEXT,
    horaires TEXT,
    categorie TEXT NOT NULL,  -- 'urgence', 'securite', 'services'
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by INTEGER,
    FOREIGN KEY (modified_by) REFERENCES users(id)
);

-- Table pour les informations de collecte des déchets
CREATE TABLE collecte_dechets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,  -- 'ordures', 'recyclables', 'biodechets', 'verre', 'encombrants'
    jour_collecte TEXT,
    details TEXT,
    couleur_bac TEXT,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by INTEGER,
    FOREIGN KEY (modified_by) REFERENCES users(id)
);

-- Table des salles communales
CREATE TABLE salles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    capacite INTEGER,
    equipements TEXT,
    tarif TEXT,
    description TEXT,
    image TEXT,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by INTEGER,
    FOREIGN KEY (modified_by) REFERENCES users(id)
);

-- Table des réservations de salles
CREATE TABLE reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    salle_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    heure_debut TEXT,
    heure_fin TEXT,
    evenement TEXT,
    nom_contact TEXT NOT NULL,
    email TEXT,
    telephone TEXT,
    participants INTEGER,
    nature TEXT,
    statut TEXT DEFAULT 'en_attente',  -- 'en_attente', 'confirmee', 'refusee'
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (salle_id) REFERENCES salles(id)
);

-- Table des commerces et artisans
CREATE TABLE commerces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    description TEXT,
    adresse TEXT,
    telephone TEXT,
    horaires TEXT,
    site TEXT,
    image TEXT,
    categorie TEXT NOT NULL,  -- 'alimentaire', 'restauration', 'services', 'artisanat'
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by INTEGER,
    FOREIGN KEY (modified_by) REFERENCES users(id)
);

-- Table des périodes de chasse
CREATE TABLE periodes_chasse (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    secteur TEXT NOT NULL,
    type_chasse TEXT NOT NULL,
    horaires TEXT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Création des rôles de base
INSERT INTO roles (nom, description) VALUES 
('super_admin', 'Accès complet à toutes les fonctionnalités'),
('admin', 'Administration du site'),
('secretaire', 'Modification du contenu du site'),
('editeur', 'Ajout et modification de contenu spécifique');

-- Création des permissions
INSERT INTO permissions (code, description) VALUES
-- Permissions générales
('gerer_utilisateurs', 'Créer/modifier/supprimer des utilisateurs'),
('gerer_roles', 'Gérer les rôles et permissions'),

-- Permissions sur le contenu
('editer_page_content', 'Modifier le contenu des pages'),
('gerer_evenements', 'Gérer les événements et manifestations'),
('gerer_bulletins', 'Gérer les bulletins municipaux'),
('gerer_contacts', 'Gérer les contacts et numéros utiles'),
('gerer_dechets', 'Gérer les informations sur la collecte des déchets'),
('gerer_salles', 'Gérer les salles communales'),
('gerer_reservations', 'Gérer les réservations de salles'),
('gerer_commerces', 'Gérer les commerces et artisans'),
('gerer_periodes_chasse', 'Gérer les périodes de chasse');

-- Attribution des permissions au rôle super_admin (toutes)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Attribution des permissions au rôle admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions 
WHERE code != 'gerer_roles';

-- Attribution des permissions au rôle secrétaire
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions 
WHERE code IN (
    'editer_page_content', 'gerer_evenements', 'gerer_bulletins', 
    'gerer_contacts', 'gerer_dechets', 'gerer_salles', 
    'gerer_reservations', 'gerer_commerces', 'gerer_periodes_chasse'
);

-- Attribution des permissions au rôle éditeur
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions 
WHERE code IN (
    'gerer_evenements', 'gerer_bulletins', 'gerer_commerces'
);

-- Créer un utilisateur super_admin initial
INSERT INTO users (username, password, email, nom, prenom, role_id)
VALUES ('admin', '$2a$10$dMrGgBY8xB50VQUkEZUdGO7MoJ4ZA1LVXwWnvOJZ0hq44p1ocUWRu', 'admin@mairie-friesen.fr', 'Admin', 'Mairie', 1);
-- Note: Mot de passe est 'admin123' (hashé avec bcrypt)