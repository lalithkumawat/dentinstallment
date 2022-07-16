import React from 'react';
import { StyleSheet } from 'react-native';
import PatientsList from "./screens/PatientsList"
import Login from "./screens/Login"
import Clinics from "./screens/Clinics"
import PatientTenure from "./screens/PatientTenure"
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ForgotPassword from "./screens/ForgotPassword";
import ClinicInfo from "./screens/ClinicInfo"
import Donate from "./screens/Donate"
import  'react-native-gesture-handler';
const Stack = createStackNavigator();

export default function App(){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName = {Login} 
        screenOptions= {{
          headerStyle: {
            backgroundColor: '#51B4EB',
            borderRadius:10,

          },
          headerTitleStyle:{
            fontSize:25,
            color:"#ffffff",
            
            alignSelf:"center",
            justifyContent:"center"
          }
        }}
        >
        
        <Stack.Screen name = "Login" component= {Login} 
          options ={{
            headerShown:false
          }}
        
        />
        <Stack.Screen name="Donate" component = {Donate}/>
        <Stack.Screen name = "Clinics" component= {Clinics} 
        options = {{
          title: 'Clinics',
          
        }} 
        />
        <Stack.Screen name = "ClinicInfo" component={ClinicInfo} 
        
        />
       

        <Stack.Screen name = "PatientsList" component= {PatientsList} 
          // options ={({  navigation, route }) => ({ 
          //   title: route.params.clinicName,
          //   // headerRight: props => navigation.navigate("Donate") 
          // })}
          
          
        />
         <Stack.Screen name = "PatientTenure" component= {PatientTenure} 
          options = {{
            title: 'PatientTenure',
            headerStyle: {
              backgroundColor: '#51B4EB',
              borderRadius:10,
            },
          }} 
        />
        <Stack.Screen name = "ForgotPassword" component = {ForgotPassword}/>
        {/* <Stack.Screen name = "Practice" component = {Practice}/> */}

        </Stack.Navigator>
      </NavigationContainer>
    )
  
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login:{
    alignSelf:"center",
    backgroundColor:"#e90933"
    
  }
});
