import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerRootComponent } from 'expo';
import InventairesList from './src/screens/InventairesList';
import InventaireDetail from './src/screens/InventaireDetail';
import LigneInventaireForm from './src/screens/LigneInventaireForm';
import InventaireForm from './src/screens/InventaireForm';
import { initDB } from './src/database/db';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDB();
        console.log('Database initialized');
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
  }, []);

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
        <Stack.Screen
          name="InventaireForm"
          component={InventaireForm}
          options={{ title: 'Ajouter un inventaire' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
registerRootComponent(App);
