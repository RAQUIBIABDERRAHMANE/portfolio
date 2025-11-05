# Guide d'installation de la table Users

## 1. Créer la table users

Exécutez le fichier SQL suivant dans votre base de données MySQL :

```bash
# Via ligne de commande
mysql -h 100.99.43.78 -P 3306 -u abdoraquibi -p raquibiPortfolio < database/users_table.sql

# Ou via phpMyAdmin ou autre interface MySQL
```

## 2. Vérifier que la table a été créée

```sql
SHOW TABLES LIKE 'users';
DESCRIBE users;
```

## 3. Structure de la table

La table `users` contient les colonnes suivantes :
- `id` : INT AUTO_INCREMENT PRIMARY KEY
- `full_name` : VARCHAR(255) NOT NULL
- `email` : VARCHAR(255) UNIQUE NOT NULL
- `password` : VARCHAR(255) NOT NULL (hashé avec bcrypt)
- `created_at` : TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` : TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

## 4. Tester l'authentification

Une fois la table créée, vous pouvez :

1. **S'inscrire** : Allez sur `/signup` et créez un compte
2. **Se connecter** : Allez sur `/signin` et connectez-vous

## 5. API Routes disponibles

- `POST /api/auth/signup` - Créer un nouveau compte
- `POST /api/auth/signin` - Se connecter
- `POST /api/auth/logout` - Se déconnecter

## 6. Variables d'environnement requises

Assurez-vous que `.env.local` contient :

```bash
USE_DB=true
DB_HOST=100.99.43.78
DB_PORT=3306
DB_USER=abdoraquibi
DB_PASSWORD=@@12raquibi
DB_NAME=raquibiPortfolio
JWT_SECRET=<votre-secret-généré>
```

## 7. Sécurité

- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Les tokens JWT sont stockés dans des cookies HTTP-only
- Les tokens expirent après 7 jours
- Validation des emails et mots de passe côté serveur
