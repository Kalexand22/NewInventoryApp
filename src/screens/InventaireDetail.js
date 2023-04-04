import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getLignesInventaire,getFirstPhoto ,getAllLignesInventaire } from '../database/db';

const InventaireDetail = ({ route, navigation }) => {
  const { inventaire } = route.params;
  const [lignes, setLignes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Inventaire reçu dans fetchData:', inventaire);
      const data = await getAllLignesInventaire();
      console.log('Lignes récupérées dans fetchData:', data);
      const lignesWithPhotos = [];

      for (let ligne of data) {
        const photo = await getFirstPhoto(ligne.id);
        lignesWithPhotos.push({ ...ligne, photo });
      }

      setLignes(lignesWithPhotos);
      console.log(lignes)
    } catch (error) {
      console.log('Erreur lors de la récupération des lignes d\'inventaire:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.description}>{item.description}</Text>
      {item.photo && (
        <Image
          source={{ uri: item.photo.uri }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('LigneInventaireForm', { ligneInventaire: item, updateLignesInventaireList: fetchData })}>
        <Text style={styles.details}>Modifier</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventaire: {inventaire.numero_inventaire}</Text>
      <FlatList
        data={lignes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('LigneInventaireForm', { inventaireId: inventaire.id, updateLignesInventaireList: fetchData })}
      >
        <Text style={styles.addButtonText}>Ajouter une ligne d'inventaire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
  details: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  addButton: {
    backgroundColor: '#0f0',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default InventaireDetail;
