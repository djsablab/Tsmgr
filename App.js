// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux'; // Redux Provider'ı import ettik
import AppNavigator from './navigation/AppNavigator'; // AppNavigator
import store from './store/store'; // Redux store

const App = () => {
  return (
    <Provider store={store}> 
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
