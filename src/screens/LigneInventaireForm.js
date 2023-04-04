import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { insertLigneInventaire, updateLigneInventaire } from '../database/db';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const LigneInventaireForm = ({ route, navigation }) => {
  const { inventaireId, ligneInventaire, updateLignesInventaireList } = route.params;

  const [description, setDescription] = useState(ligneInventaire ? ligneInventaire.description : '');
  const [photos, setPhotos] = useState(ligneInventaire ? ligneInventaire.photos : []);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Désolé, nous avons besoin de la permission pour accéder à la caméra et à la galerie!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setPhotos([...photos, result.uri]);
    }
  };

  const deletePhoto = async (uri) => {
    try {
      await FileSystem.deleteAsync(uri);
      setPhotos(photos.filter((photo) => photo !== uri));
    } catch (error) {
      console.log('Erreur lors de la suppression de la photo:', error);
    }
  };

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert('Erreur', 'La description est obligatoire.');
      return;
    }

    const data = {
      description,
      inventaireId,
      photos,
    };

    try {
      if (ligneInventaire) {
        await updateLigneInventaire({ ...data, id: ligneInventaire.id });
      } else {
        await insertLigneInventaire(data);
      }
      updateLignesInventaireList();
      navigation.goBack();
    } catch (error) {
      console.log('Erreur lors de la sauvegarde de la ligne d\'inventaire:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item }} style={styles.photo} />
      <TouchableOpacity onPress={() => deletePhoto(item)}>
        <Text style={styles.deletePhoto}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Description :</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Entrez la description"
      />
      <Text style={styles.label}>Photos :</Text>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={pickImage}>
        <Text style={styles.addButtonText}>Prendre une photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#0f0',
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#00f',
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  deletePhoto: {
    color: 'red',
    textDecorationLine: 'underline',
  },
});

export default LigneInventaireForm;
