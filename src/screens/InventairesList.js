import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { getInventaires, deleteInventaire } from '../database/db';
import { useFocusEffect } from '@react-navigation/native';
import { globalStyles } from './styles';

const InventairesList = ({ navigation }) => {
  const [inventaires, setInventaires] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {};
    }, [])
  );

  const fetchData = async () => {
    try {
      const data = await getInventaires();
      setInventaires(data);
    } catch (error) {
      console.log("Erreur lors de la récupération des inventaires:", error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Supprimer l'inventaire",
      "Êtes-vous sûr de vouloir supprimer cet inventaire ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              await deleteInventaire(id);
              fetchData();
            } catch (error) {
              console.log("Erreur lors de la suppression de l'inventaire:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  

  const renderItem = ({ item }) => (
    <View style={globalStyles.item}>
      <Text style={globalStyles.title}>{item.numero_inventaire}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={globalStyles.delete}>Supprimer</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("InventaireDetail", { inventaire: item })}>
        <Text style={globalStyles.details}>Détails</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.header}>Liste des inventaires</Text>
      <FlatList
        data={inventaires}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={globalStyles.addButton}
        onPress={() => navigation.navigate("InventaireForm", { updateInventaireList: fetchData })}
      >
        <Text style={globalStyles.addButtonText}>Ajouter un inventaire</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InventairesList;
