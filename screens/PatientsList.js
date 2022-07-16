

import React, { Component, useState,  } from 'react'
import {
    View, Text, SafeAreaView,
    StyleSheet, TouchableHighlight,
    FlatList,
    Modal, Dimensions, TextInput, Alert, TouchableOpacity,  TouchableNativeFeedback
} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from "react-native-modal-datetime-picker";
import { SearchBar } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import firebase from "firebase"
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swipeable from "react-native-gesture-handler/Swipeable";




function CustomInput(props) {
    const [isFocused, setIsFocused] = useState(false)
    const [height, setHeight] = useState(50)
    const [showErr, setShowErr] = useState(false)
    const { errMsg } = props
    // console.log(props);
    return (
        <View>
            <TextInput
                selectionColor="#25CCF7"
                keyboardType={props.keyboardType}
                // underlineColorAndroid={isFocused?"#67E6DC":"#487EB0"}
                maxLength={props.maxLength}

                style={{
                    maxHeight: 100,
                    margin: 5,
                    padding: 10,
                    minHeight: 50,
                    borderColor: "#74B9FF",
                    borderWidth: (isFocused ? 3 : 1),
                    fontSize: 18,
                    textAlign: "center",
                    borderRadius: 10
                }}

                placeholder={props.placeholder}
                onFocus={() => { setIsFocused(true); setShowErr(true) }}
                onBlur={() => {
                    setIsFocused(false);
                    // props.errMsg===""?setShowErr(false):setShowErr(true)
                }}
                multiline={props.multiline}
                onChangeText={text => {
                    props.onChangeHandler(props.name, text)
                }}
                returnKeyType={props.name !== "totalFee" ? "next" : "done"}
            />
            {props.errMsg ? <Text style={{ fontSize: 12, alignSelf: "center", color: "red", marginTop: 0 }}>
                {props.errMsg}
            </Text> : null}
            {/* {showErr?<Text style= {{fontSize:12,alignSelf:"center",color:"red",marginTop:0}}>{errMsg}</Text>:null} */}
        </View>
    )
}


export default class Patientslist extends Component {
    constructor(props) {
        super(props)

        this.state = {
            search: "",
            pGender: null,
            isFocused: false,
            searchArray: "",
            isSelectedBGColor: "",
            isSelectedTextColor: "",
            showModal: false,
            showMenu: false,
            date: (String(new Date(Date.now()).getDate()).padStart(2, '0') +
                "-" + String(new Date(Date.now()).getMonth() + 1).padStart(2, '0') + "-" +
                String(new Date(Date.now()).getFullYear())),
            toDelete: null,
            showPicker: false,
            patients: [],
            clinicName: props.route.params.clinicName,
            clinicID: props.route.params._id,
            p: {
                pName: null,
                pDisease: null,
                pGender: null,
                pTreatment: null,
                contact: null,
                dateOfVisiting: (String(new Date(Date.now()).getDate()).padStart(2, '0') +
                    "-" + String(new Date(Date.now()).getMonth() + 1).padStart(2, '0') + "-" +
                    String(new Date(Date.now()).getFullYear())),
                totalFee: null,
                totalFeePaid: 0,
                totalFeeDue: 0,
                tenure: []
            },
            errMsg: {
                pName: "",
                pDisease: "",
                pTreatment: "",
                contact: "",
                pGender: "",
                totalFee: "",
            },
            showErr: false


        }




    }
    initialState = {
        pName: null,
        pDisease: null,
        pTreatment: null,
        pGender: "Gender",
        contact: null,
        dateOfVisiting: (String(new Date(Date.now()).getDate()).padStart(2, '0') +
            "-" + String(new Date(Date.now()).getMonth() + 1).padStart(2, '0') + "-" +
            String(new Date(Date.now()).getFullYear())),
        totalFee: null,
        totalFeePaid: 0,
        totalFeeDue: 0,
        tenure: []
    }

    componentDidMount() {
        console.log(this.props.route.params._id);

        this.props.navigation.setOptions({
            title: this.props.route.params.clinicName,
            headerRight: () => (
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Donate", { _id: this.props.route.params._id })}>
                    <View
                    style = {{
                        // width:50,
                        alignContent:"center",
                        flex:1,
                        flexDirection:"column",
                    }}
                    >
                        <Icon
                     size={25}
                    name = "donate"
                    color= "#f1c40f"
                    style ={{
                        margin:3,
                        flex:1,
                        alignSelf:"center"
                    }}
                     />
                     
                         <Text  style ={{
                              flex:1,
                              alignSelf:"center",
                              color: "#f1c40f"

                        }}>Donate </Text>
                     </View>
                                     </TouchableOpacity>
                // <Button title="Donate" onPress={() => this.props.navigation.navigate("Donate", { _id: this.props.route.params._id })} />
            )
				})
				

        this.unsubscribe = firebase.firestore().collection("clinics").doc(this.props.route.params._id)
        .collection("patients").onSnapshot(this.getFirebaseData)

        // this.props.navigation.setOptions({...this.props.navigation,
        //     headerRight: () => (
        //       <Button title ="deb" onPress={() => this.props.navigation.navigate("Donate") }  />
        //     ),
        //   })
        // this.unsubscribe()

        
    }
    componentWillUnmount() {
        // we have to unsubscribe when component unmounts, because we don't need to check for updates
        this.unsubscribe()
      }
    getFirebaseData = (querySnapshot) => {
        // const ref = firebase.firestore().collection("clinics").doc(this.state.clinicID)
        //     .collection("patients").onSnapshot(querySnapshot => {
                let  patients  = []

                querySnapshot.forEach(doc => {
                    console.log(doc.id, "=>", doc.data());
                    patients.push(doc.data())
                });
                this.setState({ patients: patients })

            // })

    }
    
    reset() {
        this.setState({ p: this.initialState })
    }

    onChangeHandler = (name, value) => {
        console.log(name, value);
        if (value === null | "") {
            console.log("please fill up all details");
        }
        switch (name) {
            case "pName":
                console.log("pName", value);
                value === "" ?
                    this.setState({ errMsg: { ...this.state.errMsg, pName: "Patient's name cannot be empty" } })
                    : value.match(/^[a-zA-Z][\w_ ]*$/) ?
                        this.setState({ errMsg: { ...this.state.errMsg, pName: "" } })
                        : this.setState({ errMsg: { ...this.state.errMsg, pName: "Name should not start with a digit" } });


                this.state.errMsg.pName === "" ?
                    this.setState({ p: { ...this.state.p, pName: value } }) : null;
                console.log(this.state.p);
                break;
            case "pDisease":
                console.log("pDisease", value);
                value === "" ? this.setState({ errMsg: { ...this.state.errMsg, pDisease: "Please enter disease" } }) : this.setState({ errMsg: { ...this.state.errMsg, pDisease: "" } });
                // this.setState({errMsg:""}):this.setState({errMsg:"Name should not start with a digit"});
                this.state.errMsg.pDisease === "" ?
                    this.setState({ p: { ...this.state.p, pDisease: value } }) : null;

                break;
            case "pTreatment":
                console.log("pTreatment", value);
                value === "" ? this.setState({ errMsg: { ...this.state.errMsg, pTreatment: "Please enter treatment" } }) : this.setState({ errMsg: { ...this.state.errMsg, pTreatment: "" } });

                this.state.errMsg.pTreatment === "" ?
                    this.setState({ p: { ...this.state.p, pTreatment: value } }) : null;
                break;
            case "pGender":
                if (value == "Male" || value == "Female" || value == "Other") {
                    this.setState({ p: { ...this.state.p, pGender: value } })
                }
                break;
            case "contact":
                console.log("contact", value);
                value.match(/^[1-9][0-9]{9}$/)
                    ? this.setState({ errMsg: { ...this.state.errMsg, contact: "" } })
                    : this.setState({ errMsg: { ...this.state.errMsg, contact: "Please enter a valid contact number" } });


                // this.state.errMsg.contact===""?
                // this.setState({p:{...this.state.p,contact:value}}):null;
                this.setState({ p: { ...this.state.p, contact: value } })
                break;
            case "dateOfVisiting":
                console.log("dateOfVisiting", value);

                this.setState({ p: { ...this.state.p, dateOfVisiting: value } });
                break;


            case "totalFee":
                console.log("totalFee", value);
                value === "" ? this.setState({ errMsg: { ...this.state.errMsg, totalFee: "Please enter total fee" } }) :
                    value.match(/^\d+(.\d{1,})?$/) ? this.setState({ errMsg: "" }) :
                        this.setState({ errMsg: { ...this.state.errMsg, totalFee: "Please enter a valid amount, e.g. 1000,10000.00" } });

                this.state.errMsg.totalFee === "" ?
                    this.setState({ p: { ...this.state.p, totalFee: value } }) : null;
                this.setState({ p: { ...this.state.p, totalFee: value } })
                // console.log(p);
                break;
            default:
                break;
        }
        (this.state.errMsg.totalFee === "" | this.state.errMsg.pTreatment === "" |
            this.state.errMsg.pName === "" | this.state.errMsg.pDisease === "" |
            this.state.errMsg.contact === "") ? this.setState({ showErr: true }) : this.setState({ showErr: false })

        this.setState({
            showErr: (!this.state.p.pName & !this.state.p.pTreatment &
                !this.state.p.totalFee & !this.state.p.pDisease & !this.state.p.contact
            )
        })

        console.log("showErr", this.state.showErr);

    }


    onPressAddPatient = () => {
        console.log(this.state.showErr, "onpress add p", this.state.p);
        if (this.state.p.pName
            && this.state.p.pDisease
            && this.state.p.pTreatment
            && this.state.p.contact
            && this.state.p.totalFee

        ) {
            console.log("Patient added");


            if ((this.state.patients) && this.state.patients.filter(p => p.pName === this.state.p.pName).length > 0)
                Alert.alert(                                                                                                        //alert pending
                    "Patient with the same name \"" + this.state.p.pName + "\" already exist!!!"
                );
            else {
                this.setState({ p: { ...this.state.p } });
                console.log(this.state.p);
                // this.state.patients.push(this.state.p);
                this.uploadToFirebase().then(()=>{
                    this.setState({ showModal: false, showPicker: false });

                }).catch(err=>{
                    console.log("error",err);
                })
            }




        }
    }
    uploadToFirebase = async () => {
        const clinicDocRef = await firebase.firestore().collection("clinics").doc(this.state.clinicID)
        const patientCollectionRef = clinicDocRef.collection("patients")
        patientCollectionRef.add(
            this.state.p
        ).then(snap => {
            console.log("patient add with name", snap.id);
            snap.update({ _id: snap.id })
            this.reset();
            // this.getFirebaseData();
            

        }).catch(err => {
            console.log("Error while adding to patient to firestore", err);
        })
        patientCollectionRef.get().then(snap=>{
            clinicDocRef.update({totalPatients: snap.size})

        }).catch(err=>{
            console.log("error while updating total patients");
        })



    }
    deletePfromFirebase(_id){
        firebase.firestore().collection("clinics").doc(this.state.clinicID)
        .collection("patients").onSnapshot(snap=>{
            snap.forEach(doc=>{
                if(doc.ref.id===_id)
                    {doc.ref.delete()}
            })
        })
    }
    onPressDeletePatient = (toDelete) => {
        if (this.state.patients) {
            Alert.alert("Alert", "Do you want to delete patient \"" + toDelete.pName + "\'s\" data?",
                [
                    {
                        text: "Delete", onPress: () => {
                            this.setState({
                                patients: this.state.patients.filter(p => p.pName !== toDelete.pName)
                            })
                            this.deletePfromFirebase(toDelete._id)
                            this.setState({ showMenu: false })
                        }
                    },
                    {
                        text: "Cancel",
                        onPress: () => {
                            this.setState({
                                toDelete: {}
                            })
                            this.setState({ showMenu: false })
                        }
                    }
                ]
            )
        }
    }
    onSwipeRight = ({item})=>{
        return(
            <View style={{
                flex: 1 / 2,
                flexDirection: "row"
            }}>
                <TouchableHighlight style={{
                    backgroundColor: "#f44336",
                    borderRadius: 5,
                    marginVertical: 5,
                    marginHorizontal: 5,
                    flex: 1
                }}
                    onPress={() => 
                    this.onPressDeletePatient(item).then(() => { console.log("deleted "); }).catch(() => { console.log("Error while deleting "); })}
                >
                    <Icon
                        name="delete"
                        color="#4CAF50"
                        size={30}
                        style={{
                            alignSelf: "center",
    
    
                        }}
                    />
    
    
    
                </TouchableHighlight>
                </View>

        )
    }
    renderPatients = ({ item }) => {
        console.log(item.pName);
        let isSelectedBGColor = "";

        return (

            <Swipeable
                renderRightActions={()=>this.onSwipeRight(item)}
            >
            {/* <Swipeout 
            right={[{
                text:"Delete",
                backgroundColor:"red",
                onPress:()=>{
                    this.onPressDeletePatient(item)
                }
            }]}
            > */}
                
            <TouchableNativeFeedback
                style={styles.item}
                onPress={() => { this.props.navigation.navigate("PatientTenure", { patient: item, clinicID: this.state.clinicID}) }}
            >
                <View
                    style={{
                        backgroundColor: "#E0F1FB",
                        alignContent: "center",
                        alignItems: "center",
                        marginBottom: 3,
                        borderRadius: 5,
                        height: 49,
                        marginHorizontal: 10,
                        borderRadius: 10
                    }}
                >
                    <Text style={{ color: "#5C8AAB", fontSize: 20, alignSelf: "center" }}>{item.pName}</Text>

                </View>

            </TouchableNativeFeedback>
            {/* </Swipeout> */}
            </Swipeable>
        )
    }
    addDate = (date) => {
        console.log(date, typeof date);
        this.setState({
            date: (String(date.getDate()).padStart(2, '0') + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getFullYear()))
        })
    }
    searchPatient = (pName) => {
        this.setState({ search: pName })
        let patients = this.state.patients
        let filteredPatients = patients.filter((p => p.pName.toLowerCase().match(pName.toLowerCase())))
        console.log("searching for", filteredPatients.length);
        this.setState({
            searchArray: filteredPatients
        })

    }
    render() {
        console.log("props",this.props);
        return (
            <SafeAreaView style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <SearchBar
                    style={{
                        backfaceVisibility: "hidden",
                        // backgroundColor:"#FFFFFF",


                    }}
                    containerStyle={{
                        borderWidth: 5,
                        borderColor: "#E0F1FB",
                        borderRadius: 30,
                        marginHorizontal: 5,
                        marginTop: 5
                    }}
                    platform="android"
                    placeholder="Search..."
                    onChangeText={this.searchPatient}
                    value={this.state.search}
                    returnKeyType="search"
                />
                {
                    this.state.searchArray ? (<FlatList
                        style={{
                            marginTop: 10
                        }}
                        data={this.state.searchArray}
                        renderItem={(item) => this.renderPatients(item)}
                        keyExtractor={(item) => item.pName}
                    />) : <FlatList
                            style={{
                                marginTop: 10
                            }}
                            data={this.state.patients}
                            renderItem={(item) => this.renderPatients(item)}
                            keyExtractor={(item) => item.pName}
                        />
                }

                
                <Modal
                    style={{

                        marginHorizontal: (Dimensions.get("window").width - 300) / 2,
                        marginVertical: (Dimensions.get("window").height - 300) / 2,
                        backgroundColor: "#ffFFF",
                        position: "absolute",
                        alignSelf: "center",
                        backgroundColor: "#EAF0F1",
                        borderRadius: 20,
                        flex: 1,
                        flexDirection: "row"


                    }}
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showModal}
                    onRequestClose={() => {
                        this.setState({ showModal: !this.state.showModal })
                    }}
                >
                    <View style={{
                        backgroundColor: "#EAF0F1",
                        borderRadius: 20,
                        flex: 1,
                        marginHorizontal: (Dimensions.get("window").width - 400) / 2,
                        marginVertical: 50,


                    }}>
                        <ScrollView style={{
                            margin: 10,

                        }}>

                            <CustomInput
                                name="pName"
                                placeholder="Patient's name"
                                keyboardType="default"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.pName}
                                maxLength={25}
                            />
                            <View
                                style={{
                                    // maxHeight:100,
                                    margin: 5,
                                    // padding:10,
                                    // alignItems:"center",
                                    // height:50,
                                    borderColor: "#74B9FF",
                                    borderWidth: 1,
                                    fontSize: 18,
                                    // textAlign:"center",
                                    borderRadius: 10
                                }}
                            // onPress = {()=>{this.setState({isFocused:true})}}

                            >
                                
                                <Picker
                                    selectedValue={this.state.p.pGender ? this.state.p.pGender : "Gender"}
                                    style={{

                                        height: 50,
                                        borderColor: "#FFF",
                                        borderWidth: 1,
                                        fontSize: 18,
                                        // alignSelf:"center",
                                        textAlign: "center",


                                    }}
                                    // onPress = {()=>{this.setState({isFocused:true})}}


                                    itemStyle={{
                                        borderColor: "#74B9FF",
                                        textAlign: "center"
                                    }}
                                    prompt="Gender"
                                    mode="dialog"
                                    onValueChange={(itemValue, itemIndex) => {
                                        if (itemValue === "Male" || itemValue === "Female" || itemValue === "Other")
                                            this.setState({ p: { ...this.state.p, pGender: itemValue }, })

                                    }}>
                                    <Picker.Item label="Gender" value={null} />

                                    <Picker.Item label="Male" value="Male" />
                                    <Picker.Item label="Female" value="Female" />
                                    <Picker.Item label="Other" value="Other" />

                                </Picker>
                            </View>

                            <CustomInput
                                name="pDisease"
                                placeholder="Disease"
                                keyboardType="default"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.pDisease}
                                maxLength={30}


                            />

                            <CustomInput
                                name="pTreatment"
                                placeholder="Treatment"
                                keyboardType="default"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.pTreatment}
                                multiline={true}
                                maxLength={150}

                            />

                            <CustomInput
                                name="contact"
                                placeholder="Contact"
                                keyboardType="phone-pad"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.contact}
                                maxLength={10}

                            />

                            <TouchableOpacity
                                style={{
                                    maxHeight: 100,
                                    margin: 5,
                                    padding: 10,
                                    minHeight: 50,
                                    borderColor: "#74B9FF",
                                    borderWidth: 1,
                                    fontSize: 18,
                                    textAlign: "center",
                                    borderRadius: 10
                                }}

                                onPress={() => this.setState({ showPicker: !this.state.showPicker })}

                            >
                                <Text style={{
                                    fontSize: 18, alignSelf: "center",
                                    textAlign: "justify"
                                }}>{this.state.p.dateOfVisiting}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                //  datePickerModeAndroid ="spinner"
                                isVisible={this.state.showPicker}
                                onConfirm={this.addDate}
                                onCancel={() => {
                                    this.setState({ showPicker: false });
                                }}
                            />
                            {/* <CustomInput
                        name="dateOfVisiting"
                        placeholder="Date of first visit"
                        keyboardType="default"
                        onChangeHandler={this.onChangeHandler.bind(this)}
                        // errMsg={this.state.errMsg}

                    /> */}

                            <CustomInput
                                name="totalFee"
                                placeholder="Total fee"
                                keyboardType="decimal-pad"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.totalFee}

                            />


                        </ScrollView>

                        {/* {this.state.showErr?
                                <Text style={{ 
                                    fontSize: 12, alignSelf: "center",
                                    color: "red", marginTop: 0
                                }}
                                
                                >
                                    {this.state.errMsg.pDisease||this.state.errMsg.pDisease||this.state.errMsg.pTreatment||this.state.errMsg.contact
                                    ||this.state.errMsg.totalFee||"Please fill the details"}</Text>
                                    : null} */}
                        <View style={{
                            flexDirection: "row",
                            borderRadius: 15,
                            height: 55,
                        }}>

                            <TouchableHighlight
                                style={{
                                    flex: 1 / 2,
                                    alignSelf: "stretch",
                                    alignContent: "center",
                                    borderRadius: 15,
                                    backgroundColor: "#51B4EE"
                                }}
                                onPress={() => { this.onPressAddPatient() }}
                                disabled={this.state.showErr}
                            >
                                <Text style={{
                                    color: "#FFEEEE", fontSize: 20,
                                    alignSelf: "center", marginTop: 5,

                                }}> Add Patient</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={{
                                    backgroundColor: "#F07373",
                                    borderRadius: 15,
                                    flex: 1 / 2,
                                    alignItems: "center",
                                    alignSelf: "stretch"
                                }}
                                onPress={() => { this.setState({ showModal: false }) }}>
                                <Text style={{
                                    color: "#FFEEEE", fontSize: 20, alignSelf: "center",
                                    marginTop: 5,


                                }}> close</Text>
                            </TouchableHighlight>
                        </View>
                    </View>

                </Modal>



                <TouchableHighlight
                    style={{
                        backgroundColor: "#51B4EE",
                        borderRadius: 15,
                        height: 50,
                    }}
                    onPress={() => this.setState({ showModal: true })}
                >
                    <Text style={{ color: "#FFFFFF", fontSize: 25, alignSelf: "center" }} >Add a patient</Text>
                </TouchableHighlight>




            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({

    inputs: {
        padding: 10,
        height: 50,
        borderColor: "#74B9FF",
        fontSize: 18,
        borderRadius: 10
    },
    item: {
        flex: 1,
        backgroundColor: "#E0F1FB",
        alignContent: "center",
        marginBottom: 3,
        borderRadius: 5,
        height: 49,
        marginHorizontal: 10,
        borderRadius: 10

    },

    row: {
        backgroundColor: "#25CCF7",
        // height:90,
        // width:40,
        flexDirection: "row",
        borderRadius: 5,

    }
})

