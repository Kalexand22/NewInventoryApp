import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CategoryPicker = ({ categories, onSelectCategory }) => {
  const [categoryInput, setCategoryInput] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddCategory = () => {
    onSelectCategory(categoryInput);
    setCategoryInput('');
    setShowInput(false);
  };

  return (
    <View style={styles.container}>
      {showInput ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={categoryInput}
            onChangeText={setCategoryInput}
            placeholder="Entrez une nouvelle catégorie"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
            <Text style={styles.addButtonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.label}>Catégorie :</Text>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowInput(true)}
          >
            <Text style={styles.categoryButtonText}>Ajouter une catégorie</Text>
          </TouchableOpacity>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryButton}
              onPress={() => onSelectCategory(category)}
            >
              <Text style={styles.categoryButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
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
  categoryButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 5,
  },
  categoryButtonText: {
    fontSize: 18,
  },
});

export default CategoryPicker;
