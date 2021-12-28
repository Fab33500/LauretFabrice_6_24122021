# <center> Piiquante <center>

## Parcours Développeur Web : Projet : P6

## Construisez une API sécurisée pour une application d'avis gastronomiques.

Le P6 consiste à développer une application d’évaluation des sauces piquantes pour la marque "PIICANTE". L'objectif étant de créer une application permettant aux utilisateurs d'évaluer les sauces ajoutées par les autres utilisateurs, mais aussi d'en rajouter.

Une attention particuliere devra etre observée sur la sécurité.

#### Compétences visées

Utisisation de:

-   JavaScript
-   Node.js
-   MongoDB et Mongoose
-   du framework Express
-   de Bcrypt pour le Hash
-   Mise en oeuvre les opérations du CRUD
-   Sécuriser l'API en appliquant les techniques de OWASP

#### Installation des dépendances :

-   NodeJS 12.14 ou 14.0.
-   Angular CLI 7.0.2.
-   node-sass : assurez-vous d'utiliser la version correspondante à NodeJS. Pour Noe 14.0 par exemple, vous avez besoin de node-sass dans la version 4.14+.

Sous Windows, ces installations nécessitent d'utiliser PowerShell en mode administrateur.

#### Installation

Clonez le projet

##### le Frontend

-   Ouvrir le terminal sur le dossier Frontend et exécuter `npm install` pour installer les dépendances.
-   Exécuter `npm install node-sass` pour installer sass.
-   Le projet a été généré avec Angular CLI version 13.1.2.
    Démarrer `npm start` .
-   allez sur `http://localhost:4200`, si la page ne s'ouvre pas automatiquement.
-   L'application mettra à jour automatiquement vos fichiers source qui sont modifiés.

##### le Backend

-   Ouvrir le terminal sur le dossier Backend.
-   Pour utiliser le serveur, chargez le package nodemon : `npm install -g nodemon`.
-   Puis lancez le serveur: `nodemon server`.

Si les packages sont déja installés, ou à chaque réouverture de votre dossier sur votre IDE:

-   Dans le terminal sur le dossier Frontend, tapez : `npm start`
-   Dans le terminal sur le dossier Backend, tapez : `nodemon server`
-   Connectez vous ensuite à l'Url : `http://localhost:4200`
