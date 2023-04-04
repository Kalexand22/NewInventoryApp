import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';

import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  /*
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InventairesList">
        <Stack.Screen
          name="InventairesList"
          component={InventairesList}
          options={{ title: 'Liste des inventaires' }}
        />
        <Stack.Screen
          name="InventaireDetail"
          component={InventaireDetail}
          options={{ title: 'Détail de l\'inventaire' }}
        />
        <Stack.Screen
          name="LigneInventaireForm"
          component={LigneInventaireForm}
          options={{ title: 'Ajouter une ligne d\'inventaire' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
  */
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
registerRootComponent(App);
