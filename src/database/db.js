import * as SQLite from 'expo-sqlite';

// Ouvrir ou créer la base de données
const db = SQLite.openDatabase('Inventaire2.db');

// Initialiser la base de données
export const initDB = () => {
  return new Promise((resolve, reject) => {
    console.log('Initialisation de la base de données');
    db.transaction((tx) => {
      // Créer la table 'inventaires'
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS inventaires (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          numero_inventaire TEXT NOT NULL,
          description TEXT,
          lieu_inventaire TEXT,
          contact_nom TEXT,
          contact_prenom TEXT,
          contact_telephone TEXT
        )`,
        [],
        () => {
          console.log('Table inventaires créée');
        },
        (_, error) => {
          console.log('Erreur lors de la création de la table inventaires', error);
          reject(error);
        },
      );

      // Créer la table 'lignes_inventaire'
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS lignes_inventaire (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          inventaire_id INTEGER,
          description TEXT,
          estimation_min REAL,
          estimation_max REAL,
          categorie TEXT,
          emplacement TEXT,
          FOREIGN KEY (inventaire_id) REFERENCES inventaires (id) ON DELETE CASCADE
        )`,
        [],
        () => {
          console.log('Table lignes_inventaire créée');
        },
        (_, error) => {
          console.log('Erreur lors de la création de la table lignes_inventaire', error);
          reject(error);
        },
      );

      // Créer la table 'photos'
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS photos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ligne_inventaire_id INTEGER,
          uri TEXT NOT NULL,
          FOREIGN KEY (ligne_inventaire_id) REFERENCES lignes_inventaire (id) ON DELETE CASCADE
        )`,
        [],
        () => {
          console.log('Table photos créée');
          resolve();
        },
        (_, error) => {
          console.log('Erreur lors de la création de la table photos', error);
          reject(error);
        },
      );
    });
  });
};

// Fonctions pour interagir avec la table 'inventaires'
// Ajouter, mettre à jour, supprimer et récupérer des données
// Faites de même pour les autres tables (lignes_inventaire et photos)

export const insertInventaire = (inventaire) => {
    return new Promise((resolve, reject) => {
      const { numero_inventaire, description, lieu_inventaire, contact_nom, contact_prenom, contact_telephone } = inventaire;
      console.log('Inventaire insertion en cours...');
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO inventaires (numero_inventaire, description, lieu_inventaire, contact_nom, contact_prenom, contact_telephone)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [numero_inventaire, description, lieu_inventaire, contact_nom, contact_prenom, contact_telephone],
          (_, { insertId }) => {
            console.log('Inventaire inséré avec succès');
            resolve(insertId);
          },
          (_, error) => {
            console.log('Erreur lors de l\'insertion de l\'inventaire', error);
            reject(error);
          },
        );
      }, (error) => {
        console.log('Erreur lors de la transaction', error);
      });
    });
  };
  
  export const updateInventaire = (inventaire) => {
    return new Promise((resolve, reject) => {
      const { id, numero_inventaire, description, lieu_inventaire, contact_nom, contact_prenom, contact_telephone } = inventaire;
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE inventaires SET numero_inventaire = ?, description = ?, lieu_inventaire = ?, contact_nom = ?, contact_prenom = ?, contact_telephone = ? WHERE id = ?`,
          [numero_inventaire, description, lieu_inventaire, contact_nom, contact_prenom, contact_telephone, id],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              console.log('Inventaire mis à jour avec succès');
              resolve();
            } else {
              console.log('Aucun inventaire mis à jour');
              reject();
            }
          },
          (_, error) => {
            console.log('Erreur lors de la mise à jour de l\'inventaire', error);
            reject(error);
          },
        );
      });
    });
  };
  
  export const deleteInventaire = (id) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM inventaires WHERE id = ?`,
          [id],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              console.log('Inventaire supprimé avec succès');
              resolve();
            } else {
              console.log('Aucun inventaire supprimé');
              reject();
            }
          },
          (_, error) => {
            console.log('Erreur lors de la suppression de l\'inventaire', error);
            reject(error);
          },
        );
      });
    });
  };
  
  export const getInventaires = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM inventaires',
          [],
          (_, { rows }) => {
            const inventaires = [];
            for (let i = 0; i < rows.length; i++) {
              inventaires.push(rows.item(i));
            }
            resolve(inventaires);
          },
          (_, error) => {
            console.log('Erreur lors de la récupération des inventaires:', error);
            reject(error);
          }
        );
      });
    });
  };

  export const insertLigneInventaire = (ligneInventaire, callback) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO lignes_inventaire (description, estimation_min, estimation_max, categorie, emplacement, inventaire_id) VALUES (?, ?, ?, ?, ?, ?);',
        [
          ligneInventaire.description,
          ligneInventaire.estimation_min,
          ligneInventaire.estimation_max,
          ligneInventaire.categorie,
          ligneInventaire.emplacement,
          ligneInventaire.inventaire_id,
        ],
        (_, resultSet) => callback(resultSet.insertId)
      );
    });
  };
  
  
  export const updateLigneInventaire = (ligneInventaire, callback) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE lignes_inventaire SET description = ?, estimation_min = ?, estimation_max = ?, categorie = ?, emplacement = ? WHERE id = ?;',
        [
          ligneInventaire.description,
          ligneInventaire.estimation_min,
          ligneInventaire.estimation_max,
          ligneInventaire.categorie,
          ligneInventaire.emplacement,
          ligneInventaire.id,
        ],
        (_, resultSet) => callback(resultSet.rowsAffected)
      );
    });
  };
  
  export const deleteLigneInventaire = (id, callback) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM lignes_inventaire WHERE id = ?;', [id], (_, resultSet) => callback(resultSet.rowsAffected));
    });
  };

  export const getLignesInventaire = (inventaireId) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM lignes_inventaire WHERE inventaire_id = ?`,
          [inventaireId],
          (_, { rows }) => {
            console.log('Lignes récupérées:', rows._array);
            resolve(rows._array);
          },
          (_, error) => {
            console.log('Erreur lors de la récupération des lignes d\'inventaire:', error);
            reject(error);
          },
        );
      });
    });
  };

  export const getAllLignesInventaire = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM lignes_inventaire `,
          [],
          (_, { rows }) => {
            console.log('Lignes récupérées:', rows._array);
            resolve(rows._array);
          },
          (_, error) => {
            console.log('Erreur lors de la récupération des lignes d\'inventaire:', error);
            reject(error);
          },
        );
      });
    });
  };
  
  export const getLignesInventaireByInventaireId = (id_inventaire, callback) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM lignes_inventaire WHERE id_inventaire = ?;', [id_inventaire], (_, resultSet) =>
        callback(resultSet.rows._array)
      );
    });
  };
  
  export const insertPhoto = (photo, callback) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO photos (uri, id_ligne_inventaire) VALUES (?, ?);',
        [photo.uri, photo.id_ligne_inventaire],
        (_, resultSet) => callback(resultSet.insertId)
      );
    });
  };
  
  export const deletePhoto = (id, callback) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM photos WHERE id = ?;', [id], (_, resultSet) => callback(resultSet.rowsAffected));
    });
  };
  
  export const getPhotosByLigneInventaireId = (id_ligne_inventaire, callback) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM photos WHERE id_ligne_inventaire = ?;', [id_ligne_inventaire], (_, resultSet) =>
        callback(resultSet.rows._array)
      );
    });
  };

  export const getFirstPhoto = (ligneInventaireId) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM photos WHERE ligne_inventaire_id = ? LIMIT 1',
          [ligneInventaireId],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(rows.item(0));
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            console.log('Erreur lors de la récupération de la première photo:', error);
            reject(error);
          }
        );
      });
    });
  };
  
