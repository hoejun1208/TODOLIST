import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, View, Text, TouchableOpacity, Platform, TextInput, ScrollView, Button } from 'react-native';
import Login from './Pages/Login'
import TodoList from './Pages/TodoList'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login"
        screenOptions={({ navigation, route }) => ({
          headerShown: true,
        })}>
        <Stack.Screen name="TodoList" component={TodoList} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};