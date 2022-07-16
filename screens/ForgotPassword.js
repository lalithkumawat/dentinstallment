import React, { Component } from 'react'
import { Text, TextInput, View,TouchableWithoutFeedback,StyleSheet, TouchableHighlight, Alert } from 'react-native'
import * as firebase from "firebase"
export default class ForgotPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email:"",
            err:""
        }

        
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) { if (prevState.name !== this.state.name) { this.handler() } }

    componentWillUnmount() {

    }

    // Prototype methods, Bind in Constructor (ES2015)
    handleChange(email) {
        let regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    
        email.match(regex) ? 
            this.setState({email:email,err:""}):this.setState({err:"Enter a valid email"})
        
     }

    resetPassword(){
        firebase.auth().sendPasswordResetEmail(this.state.email).then(res=>{
            console.log("reset mail sent",res);
            Alert.alert("Password reset mail is sent to "+this.state.email,"",[
                {
                    text: "Go to Login page",onPress:()=>{
                        this.props.navigation.navigate("Login")
                    }
                }
            ])
        })
        .catch(err=>{
            console.log("Error",err);
        })
    }

    render() {
        return (
            <View>
                <View>
                    <Text>
                        You will receive a password reset email,so please enter your registered email address only,
                    </Text>
                <TextInput


                    autoCapitalize="none"
                    style={styles.textInputStyle}
                    selectionColor="#25CCF7"
                    keyboardType="email-address"
                    placeholder="Email address"
                    // error={isValid}
                    onChangeText={(value) => this.handleChange(value)}
                />
                
                <TouchableHighlight
                    style = {{backgroundColor:"lightblue",alignItems:"center",height:50}}
                    onPress= {()=>this.resetPassword()}
                >
                    <Text>Reset</Text>
                </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        maxHeight: 100,
        margin: 5,
        padding: 10,
        minHeight: 50,
        borderColor: "#74B9FF",
        borderWidth: (1),
        fontSize: 18,
        textAlign: "center",
        borderRadius: 10
    }
})