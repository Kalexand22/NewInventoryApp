import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { insertInventaire, updateInventaire } from '../database/db';
import { globalStyles } from './styles';

const InventaireForm = ({ route, navigation }) => {
  const { inventaire, updateInventaireList } = route.params;
  const [numeroInventaire, setNumeroInventaire] = useState(inventaire ? inventaire.numero_inventaire : '');

  const handleSave = async () => {
    if (!numeroInventaire.trim()) {
      Alert.alert('Erreur', 'Le numéro d\'inventaire est obligatoire.');
      return;
    }

    const data = { numero_inventaire: numeroInventaire };

    try {
      if (inventaire) {
        await updateInventaire({ ...data, id: inventaire.id });
      } else {
        await insertInventaire(data);
      }
      
      navigation.goBack({ updated: true });
    } catch (error) {
      console.log('Erreur lors de la sauvegarde de l\'inventaire:', error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.label}>Numéro d'inventaire :</Text>
      <TextInput
        style={globalStyles.input}
        value={numeroInventaire}
        onChangeText={setNumeroInventaire}
        placeholder="Entrez le numéro d'inventaire"
      />
      <TouchableOpacity style={globalStyles.saveButton} onPress={handleSave}>
        <Text style={globalStyles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InventaireForm;
