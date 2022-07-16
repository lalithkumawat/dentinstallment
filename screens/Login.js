import { firestore } from 'firebase';
import React, { Component } from 'react'
// import { TouchableHighlight } from 'react-native-gesture-handler'
import { StyleSheet,Image, Text, View, Button, TouchableHighlight, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import {firebase}  from "../fire/firebase"
// import firebase from '@firebase/app';
import "firebase"
import { SafeAreaView } from 'react-native-safe-area-context';
// import '@firebase/firestore'

export default class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: "",
      email:"",
      password:"",
      admin:"jHj2WJXUytbXrne0xqAG3YzlwGa2"
    }
  }
  onChangeHandler = (name, value) => {
    // console.log(name, value);
    switch (name) {
      case "email":
        let regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        value.match(regex)?
            this.setState({error:"",email:value})
            :this.setState({error:"Please enter valid email id"})
        break;
      case "password":
        value ===""? 
        this.setState({error:"Please enter valid password"})
          : this.setState({error:"",password:value})
        break;
      default:
        break;
    }
  }

    async  addData(){
      
      const ref  = firestore().collection("clinics");

        await ref.add({
          clinicName: "Clinic1",
          docName: "Doctor1",
          docEmail: "doctor1@gmail.com",
          docPass: "xoxoxox",
          dateOfReg:(String(new Date(Date.now()).getDate()).padStart(2, '0')+
          "-"+String(new Date(Date.now()).getMonth() + 1).padStart(2, '0')+"-"+
            String(new Date(Date.now()).getFullYear())),
          address: "address11", "contact": 1234567890,
          patients: [
              {
                  pName: "patient1",
                  pGender:"Male",
                  pDisease: "gum bleeding...dsdsds",
                  pTreatment: "root canal treatment...",
                  contact: 1234567890,
                  dateOfVisiting: "23/08/2020",

                  totalFee: 1000, totalFeeDue: 0, totalFeePaid: 0,
                  tenure: [
                      { "srNo": 1, "date": "24-08-2020", "feePaid": 300, "feeDue": 700 },
                      { "srNo": 2, "date": "30-08-2020", "feePaid": 400, "feeDue": 300 }
                  ]
              },
              {
                  pName: "patient2",
                  pGender:"Female",
                  pDisease: "gum bleeding...dsdsds",
                  pTreatment: "root canal treatment...",
                  contact: 1234567890,
                  dateOfVisiting: "23/08/2020",
                  totalFee: 1000, totalFeeDue: 0, totalFeePaid: 0,
                  tenure: [
                      { "srNo": 1, "date": "24-08-2020", "feePaid": 300, "feeDue": 700 },
                      { "srNo": 2, "date": "30-08-2020", "feePaid": 400, "feeDue": 300 }
                  ]
              }
          ]
      }).then(d=>{console.log("addd",d); })
      .catch(err=>{console.log("err",err);
      })
      
      }

  login = (email,password)=>{
    firebase.auth().signInWithEmailAndPassword(email,password)
    .then(res=>{
      console.log("logged in  with user ",res.user.uid);
      if(res.user.uid===this.state.admin)
        this.props.navigation.navigate("Clinics")
      else{
        let clinicRef = firebase.firestore().collection("Clinics").doc(res.user.uid).get()
        console.log("loginned as a doctor",clinicRef);
        // this.props.navigation.navigate("Patients",{ clinicName: item.clinicName,_id: item._id, patients: item.patients }) })
      }
      
          })
    .catch(err=>{
      if(err.code ==="auth/invalid-email"){
        console.log("Invalid email!",err.code);
        this.setState({error:"Invalid email!"})

      }
      if(err.code ==="auth/wrong-password"){
        console.log('Invalid password!');
        this.setState({error:"Invalid password!"})
      }
      if(err.code ==="auth/user-not-found"){
        console.log('User not found');
        Alert.alert("You are not a authorized");
        this.setState({error:"User not found!"})
      }
      console.log(err.code,err);
    })

  }
  render() {
    const { navigation, route } = this.props
    return (
      <SafeAreaView style={{
        flex: 1,
        flexDirection: "column",
        
          }}
      >
        <ImageBackground 
        blurRadius={1}
        source = {require("../assets/smile.webp")}
        style = {{
            flex: 1,
            resizeMode: 'cover', // or 'stretch'
            alignItems: 'center',
            justifyContent: 'center',
            opacity:0.9,
            overflow:"visible",
            backgroundColor:"lightblue",
            

          }}
        >
        <View style={{
          alignContent: "center"
        }}>


          <TextInput

            label={"Email"}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.textInputStyle}
            selectionColor="#25CCF7"
            placeholder="Email address"
            onChangeText={(value) => this.onChangeHandler("email", value)}

          // error={isValid}
          />

          <TextInput
            label={"Password"}
            secureTextEntry
            autoCapitalize="none"
            style={styles.textInputStyle}
            selectionColor="#25CCF7"

            placeholder="Password"
            // error={isValid}
            onChangeText={(value) => this.onChangeHandler("password", value)}
          />

          {this.state.error ? (
                  <View style={{
                    alignItems:"center"
                  }}>
                    <Text style={{color:"red"}}>{this.state.error}</Text>
                  </View>
                ) : null}
          <TouchableOpacity 
            onPress = {()=>this.props.navigation.navigate("ForgotPassword")}
          >
            <Text style={{
              color: "blue",
              fontStyle:"italic",

            }}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <TouchableHighlight
            onPress={() => this.login(this.state.email, this.state.password)}
            style={styles.login}
            disabled = {this.state.email==="" &&this.state.password===""}
          >

            <Text style={{
              flex: 1,
              margin: 5,

              color: "#FEEE11",

            }}>
              Login 
          </Text>

          </TouchableHighlight>
          {/* <TouchableHighlight
            onPress={() => navigation.navigate("Clinics")}
            style={styles.login}
          >

            <Text style={{
              flex: 1,
              margin: 5,

              color: "#FEEE11",

            }}>
              Login as dev
          </Text>

          </TouchableHighlight> */}
        </View>
        </ImageBackground>
       </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center'
  },
  login: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "dodgerblue",
    width: 110, height: 40,
    borderRadius: 10,
    margin: 5

  },
  textInputStyle: {
  
  maxHeight: 100,
  color:"darkblue",
  margin: 5,
  padding: 10,
  minHeight: 50,
  borderColor: "#74B9FF",
  borderWidth: 3,
  fontSize: 18,
  textAlign: "center",
  borderRadius: 10,
  backgroundColor:"#55E6C1"
  // backfaceVisibility:"hidden"
  }
});
