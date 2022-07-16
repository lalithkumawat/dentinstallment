import React, { Component, useState } from 'react'
import {
    View, Text, SafeAreaView,
    StyleSheet, TouchableHighlight,
    FlatList,
    Modal, Dimensions,
    ImageBackground,
    TextInput, Alert, TouchableOpacity, TouchableWithoutFeedback, LogBox
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import * as firebase from 'firebase';
import 'firebase/firestore'
import { ScrollView } from "react-native-gesture-handler";
import  Icon  from 'react-native-vector-icons/MaterialIcons';
import Swipeable from "react-native-gesture-handler/Swipeable";
import { SearchBar } from 'react-native-elements';


function CustomInput(props) {
    const [isFocused, setIsFocused] = useState(false)
    const [height, setHeight] = useState(50)
    const [showErr, setShowErr] = useState(false)
    const { errMsg } = props
    console.log(props);
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
                secureTextEntry={props.secureTextEntry}
            />
            {props.errMsg ? <Text style={{ fontSize: 12, alignSelf: "center", color: "red", marginTop: 0 }}>
                {props.errMsg}
            </Text> : null}
            {/* {showErr?<Text style= {{fontSize:12,alignSelf:"center",color:"red",marginTop:0}}>{errMsg}</Text>:null} */}
        </View>
    )
}

export default class Clinics extends Component {
    constructor(props) {
        super(props)
        LogBox.ignoreLogs(['Setting a timer']);
        this.state = {
            search:"",
            searchArray:"",
            showModal: false,
            showMenu: false,
            docPass:null,
            docPass1:null,
            clinics:[],
            // clinics: [
            //     {
            //         clinicName: "Clinic1",
            //         docName: "Doctor1",
            //         docEmail: "doctor1@gmail.com",
            //         docPass: "xoxoxox",
            //         dateOfReg:(String(new Date(Date.now()).getDate()).padStart(2, '0')+
            //         "-"+String(new Date(Date.now()).getMonth() + 1).padStart(2, '0')+"-"+
            //           String(new Date(Date.now()).getFullYear())),
            //         address: "address11", "contact": 1234567890,
            //         patients: [
            //             {
            //                 pName: "patient1",
            //                 pGender:"Male",
            //                 pDisease: "gum bleeding...dsdsds",
            //                 pTreatment: "root canal treatment...",
            //                 contact: 1234567890,
            //                 dateOfVisiting: "23/08/2020",

            //                 totalFee: 1000, totalFeeDue: 0, totalFeePaid: 0,
            //                 tenure: [
            //                     { "srNo": 1, "date": "24-08-2020", "feePaid": 300, "feeDue": 700 },
            //                     { "srNo": 2, "date": "30-08-2020", "feePaid": 400, "feeDue": 300 }
            //                 ]
            //             },
            //             {
            //                 pName: "patient2",
            //                 pGender:"Female",
            //                 pDisease: "gum bleeding...dsdsds",
            //                 pTreatment: "root canal treatment...",
            //                 contact: 1234567890,
            //                 dateOfVisiting: "23/08/2020",
            //                 totalFee: 1000, totalFeeDue: 0, totalFeePaid: 0,
            //                 tenure: [
            //                     { "srNo": 1, "date": "24-08-2020", "feePaid": 300, "feeDue": 700 },
            //                     { "srNo": 2, "date": "30-08-2020", "feePaid": 400, "feeDue": 300 }
            //                 ]
            //             }
            //         ]
            //     },
            //     {
            //         clinicName: "Clinic2",
            //         docName: "Doctor2",
            //         docEmail: "doctor2@gmail.com",
            //         docPass: "xoxoxox",
            //         dateOfReg:(String(new Date(Date.now()).getDate()).padStart(2, '0')+
            //         "-"+String(new Date(Date.now()).getMonth() + 1).padStart(2, '0')+"-"+
            //           String(new Date(Date.now()).getFullYear())),
            //         address: "address22", "contact": 1234567890,
            //         patients: [
            //             {
            //                 pName: "patient1",
            //                 pGender:"Male",
            //                 pDisease: "gum bleeding...dsdsds",
            //                 pTreatment: "root canal treatment...",
            //                 dateOfVisiting: "23/08/2020",

            //                 contact: 1234567890,
            //                 totalFee: 1000, totalFeeDue: 0, totalFeePaid: 0,
            //                 tenure: [
            //                     { "srNo": 1, "date": "24-08-2020", "feePaid": 300, "feeDue": 700 },
            //                     { "srNo": 2, "date": "30-08-2020", "feePaid": 400, "feeDue": 300 }
            //                 ]
            //             },
            //             {
            //                 pName: "patient2",
            //                 pGender:"Female",
            //                 pDisease: "gum bleeding...dsdsds",
            //                 pTreatment: "root canal treatment...root canal treatment...root canal treatment...",
            //                 contact: 1234567890,
            //                 dateOfVisiting: "23/08/2020",

            //                 totalFee: 1000,
            //                 totalFeePaid: 0, totalFeeDue: 0,
            //                 tenure: [
            //                     { "srNo": 1, "date": "24-08-2020", "feePaid": 300, "feeDue": 700 },
            //                     { "srNo": 2, "date": "30-08-2020", "feePaid": 400, "feeDue": 300 }
            //                 ]
            //             }
            //         ]
            //     }
            // ],
            toDelete: null,
            showPicker: false,

            c: {
                _id:null,
                clinicName: null,
                docName: null,
                docEmail: null,
               
                dateOfReg:(String(new Date(Date.now()).getDate()).padStart(2, '0')+
                "-"+String(new Date(Date.now()).getMonth() + 1).padStart(2, '0')+"-"+
                  String(new Date(Date.now()).getFullYear())),
                address: null,
                contact: null,
                totalPatients:0,
                
            },
            errMsg: {
                clinicName: "",
                docName: "",
                docEmail: "",
                docPass: "",
                docPass1:"",
                contact: "",
                address:"",
            },
            showErr: false
        }
    }
    componentDidMount(){
        this.getFirebaseData().then(()=>{
            console.log("Fetching data from firebase");
        }).catch(err=>{
            console.log("error while fetching data from firebase",err);
        })

    }
    async getFirebaseData(){
        const ref = firebase.firestore().collection("clinics")
        await ref.get().then(snapshot=>{

        snapshot.forEach(doc => {
            console.log(doc.id,"=>",doc.data());
            let {clinics} = this.state
            clinics.push(doc.data())
            this.setState({clinics:clinics})
        });
    }).catch(err=>{
        console.log("Error while fetchinng data from firebase",err);
    })


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
            case "clinicName":
                console.log("clinicName", value);
                value === "" ?
                    this.setState({ errMsg: { ...this.state.errMsg, clinicName: "Clinics's name cannot be empty" } })
                    // : value.match(/^[a-zA-Z][\w_ ]*$/) ?
                        :this.setState({ errMsg: { ...this.state.errMsg, clinicName: "" } })
                        // : this.setState({ errMsg: { ...this.state.errMsg, clinicName: "Name should not start with a digit" } });


                this.state.errMsg.clinicName === "" ?
                    this.setState({ c: { ...this.state.c, clinicName: value } }) : null;
                console.log(this.state.c);
                break;
            case "docName":
                console.log("docName", value);
                value === "" ? 
                    this.setState({ errMsg: { ...this.state.errMsg, docName: "Please enter doctor's name" } }) 
                        : this.setState({ errMsg: { ...this.state.errMsg, docName: "" } });
                
                this.state.errMsg.docName === "" ?
                    this.setState({ c: { ...this.state.c, docName: value } }) : null;

                break;
            case "docEmail":
                console.log("docEmail", value);
                let regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
            
                value.match(regex) ? 
                    this.setState({ c: { ...this.state.c, docEmail: value }, errMsg: { ...this.state.errMsg, docEmail: "" } })
                        :this.setState({ errMsg: { ...this.state.errMsg, docEmail: "Please enter a valid email " } });

                this.state.errMsg.docEmail === "" ?
                    this.setState({ c: { ...this.state.c, docEmail: value } }) : null;
                break;
            case "docPass":
                this.state.errMsg.docPass === "" ?
                    this.setState({  docPass: value  }) : null;
                break;
            case "docPass1":
                value ===this.state.docPass?this.setState({errMsg:{...this.state.errMsg,docPass1:""}})
                    :this.setState({errMsg:{...this.state.errMsg,docPass1:"Password did not matched"}})
                this.state.errMsg.docPass1 === "" ?
                    this.setState({ ...this.state.c, docPass1: value }) : null;
            
                break;
            case "contact":
                console.log("contact", value);
                value.match(/^[1-9][0-9]{9}$/)
                    ? this.setState({ errMsg: { ...this.state.errMsg, contact: "" } })
                    : this.setState({ errMsg: { ...this.state.errMsg, contact: "Please enter a valid contact number" } });



                this.setState({ c: { ...this.state.c, contact: value } })
                break;
            case "dateOfReg":
                console.log("dateOfReg", value);

                this.setState({ c: { ...this.state.c, dateOfReg: value } });
                break;


            case "address":
                console.log("address", value);

                this.state.errMsg.address === "" ?
                    this.setState({ c: { ...this.state.c, address: value } }) : null;
                this.setState({ c: { ...this.state.c, address: value } })
                // console.log(c);
                break;
            default:
                break;
        }
        (this.state.errMsg.address === "" | this.state.errMsg.docPass1 === "" |
            this.state.errMsg.docPass === "" | this.state.errMsg.docEmail === "" |
            this.state.errMsg.clinicName === "" | this.state.errMsg.docName === "" |
            this.state.errMsg.contact === "") ? this.setState({ showErr: true }) : this.setState({ showErr: false })

        

        console.log("showErr", this.state.showErr);

    }

    onPressAddClinic = () => {
        console.log(this.state.showErr, "onpress add c", this.state.c);
        if (this.state.c.clinicName
            && this.state.c.docName
            && this.state.docPass
            && this.state.docPass1
            && this.state.c.address
            && this.state.c.contact
        ) {
            console.log("Clinics added under Dr. ",this.state.c.docName);

            if (this.state.clinics.filter(c => c.clinicName === this.state.c.clinicName).length > 0)
                Alert.alert(                                                                                                        //alert pending
                    "Clinics with the same name \"" + this.state.c.clinicName + "\" already exist!!!"
                );
            else {
                this.setState({ c: { ...this.state.c } });
                console.log(this.state.c);
                this.uploadToFirebase().then(()=>{

                    Alert.alert("Congratulates", "Clinic ", this.state.c.clinicName," is added successfully")
                    this.state.clinics.push(this.state.c);

                })
                this.setState({ showModal: false, showPicker: false });
                
            }



        }
    }
    async uploadToFirebase (){
        const ref = firebase.firestore().collection("clinics")
        await firebase.auth()
                .createUserWithEmailAndPassword(this.state.c.docEmail, this.state.docPass).then((user)=>
                {
                    console.log("user created with email id", user.user.uid);
        

                      this.setState({c:{...this.state.c,_id:user.user.uid}})
                      ref.doc(user.user.uid).set(this.state.c).then(res=>{
                        this.reset()
                    }
                    )
                    .catch(err=>{
                        this.setState({errorMessage:"Some problem occurred while adding to cloud!!"})
                        console.log(err)
                    });
                })
                .catch((error) => {
                    console.log("Error code",error.code,"Error message",error.message); ;
                    
                    
                  });
        
         
    }
    onPressDeleteClinic = (toDelete)=>{
        
            Alert.alert("Alert", "Do you want to delete \"" + toDelete.clinicName + "\'s\" data?",
                [
                    {
                        text: "Delete", onPress: () => {
                            this.setState({
                                clinics: this.state.clinics.filter(c => c._id !== toDelete._id)
                            })
                            
                            firebase.firestore().collection("clinics").onSnapshot(snap => {
                                    snap.forEach(doc => {
                                        if (doc.ref.id === toDelete._id) { 
                                            doc.ref.delete().then(()=>console.log(toDelete.clinicName,"deleted"))
                                            .catch(()=>console.log("Error while deleting",toDelete.clinicName))
                                        }
                                    })
                                })
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
    onSwipeRight = ( item )=>{
        return (<View style={{
			flex: 1 / 2,
			flexDirection: "row"
		}}>
			
			<TouchableHighlight
				style={{
					backgroundColor: "lightblue",
					borderRadius: 5,
					marginVertical: 5,
					marginHorizontal: 5,
					flex: 1,
				}}
                onPress={() => 
                    {this.props.navigation.navigate("ClinicInfo",
                    { 
                        clinicName: item.clinicName,
                        _id: item._id,
                        // patients: item.patients
                    }) 
                }
                }
			>
				<Icon
                    name="info-outline"
                    
					color="darkblue"
					size={30}
					style={{
						// margin:3,
                        // flex:1,
                        marginVertical:5,
						alignSelf: "center",


					}}
				// backgroundColor="#51B4EE"
				/>
			</TouchableHighlight>
            <TouchableHighlight style={{
				backgroundColor: "#f44336",
				borderRadius: 5,
				marginVertical: 5,
				marginHorizontal: 5,
				flex: 1
			}}
				onPress={() => this.onPressDeleteClinic(item).then(() => { console.log("deleted "); }).catch(() => { console.log("Error while deleting "); })}
			>
				<Icon
					name="delete-sweep"
					color="#4CAF50"
					size={30}
					style={{
						// margin:3,
						// flex:1,
						alignSelf: "center",


					}}
				/>

			</TouchableHighlight>
		</View>)
    }
    renderItem = ({ item }) => {
        // console.log(item.clinicName);

        return (
            <Swipeable 
            renderRightActions= {()=>this.onSwipeRight(item)}
            >
            
            <TouchableHighlight 
                style={styles.item} 
                onPress={() => { this.props.navigation.navigate("PatientsList", { clinicName: item.clinicName,_id: item._id  }) }}
                
            >

                <View>
                    <Text style={{
                        color: "#5C8AAB",
                        fontSize: 20,
                        alignSelf: "center"
                    }}>{item.clinicName}</Text>
                    <Text style={{ color: "#5C8AAB", fontSize: 15, alignSelf: "flex-end", margin: 2 }}>
                        {item.docName}
                    </Text>
                </View>
            </TouchableHighlight>
            {/* </Swipeout> */}
            </Swipeable>
        )
    }
    addDate = (date) => {
        // console.log(date, typeof date);
        this.setState({
                c:
                    {...this.state.c,
                        dateOfReg:(String(date.getDate()).padStart(2, '0') + "-" +
                         String(date.getMonth() + 1).padStart(2, '0') + "-" + 
                         String(date.getFullYear()))
                    }
                
            })
          
       
    }
    searchClinic = (clinicName) => {
        this.setState({ search: clinicName })
        let clinics = this.state.clinics
        let filteredClinics = clinics.filter((c => c.clinicName.toLowerCase().match(clinicName.toLowerCase())))
        console.log("searching for", filteredClinics.length);
        this.setState({
            searchArray: filteredClinics
        })

    }
    render() {

        if(!this.state.clinics){
            return (<SafeAreaView>
                <Text>Loading</Text>
                <Text>Loading</Text>
                <Text>Loading</Text>
                <Text>Loading</Text>
                <Text>Loading</Text>

            </SafeAreaView>)
        }
        return (
            // <SafeAreaView>
            <ImageBackground 
        blurRadius={1}
        source = {require("../assets/smile.webp")}
        style = {{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            resizeMode: 'cover', // or 'stretch'
            // alignItems: 'center',
            justifyContent: 'center',
            opacity:0.9,
            overflow:"visible",
            backgroundColor:"lightblue",
            

          }}
        >
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
                        marginVertical: 5
                    }}
                    platform="android"
                    placeholder="Search..."
                    onChangeText={this.searchClinic}
                    value={this.state.search}
                    returnKeyType="search"
                />
                {
                    this.state.searchArray ? (<FlatList
                        style={{
                            marginTop: 10
                        }}
                        data={this.state.searchArray}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.clinicName}
                    />) :<FlatList
                    data={this.state.clinics}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.clinicName}

                />
                    }
                <Modal
                    style={{

                        position: "absolute",
                        borderRadius: 20,
                        flex: 1,
                        flexDirection: "row"

                    }}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showMenu}
                    onRequestClose={()=>{
                        this.setState({showMenu:false})
                    }}


                >
                    <TouchableWithoutFeedback

                        onPress={() => { this.setState({ showMenu: false }) }}
                    >
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }} />
                    </TouchableWithoutFeedback>

                    <TouchableHighlight
                        style={{
                            height: 50,
                            // width:70,
                            backgroundColor: "#F07373",
                            borderRadius: 15,

                            top: Dimensions.get("window").height - 52
                        }}
                        onPress={() => { this.onLongPressDeletePatient() }}
                    >
                        <Text
                            style={{ color: "#FFFFFF", fontSize: 25, alignSelf: "center" }}
                        >
                            Delete
                            </Text>
                    </TouchableHighlight>




                </Modal>
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
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={()=>{
                        this.setState({showModal:false})
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
                                name="clinicName"
                                placeholder="Clinic's name"
                                keyboardType="default"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.clinicName}
                                maxLength={25}
                            />


                            <CustomInput
                                name="docName"
                                placeholder="Doctor's name"
                                keyboardType="default"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.docName}
                                maxLength={30}


                            />

                            <CustomInput
                                name="docEmail"
                                placeholder="Enter email id "
                                keyboardType="email-address"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.docEmail}
                                multiline={true}
                                // maxLength={150}

                            />

                            <CustomInput
                                name="docPass"
                                placeholder="Enter password"
                                keyboardType="default"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.docPass}
                                secureTextEntry 

                                // maxLength={10}
                                // securedTextEntry

                            />
                            <CustomInput
                                name="docPass1"
                                placeholder="Confirm password"
                                keyboardType="default"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.docPass1}
                                // maxLength={10}
                                secureTextEntry = {true}

                            />

                            <CustomInput
                                name="contact"
                                placeholder="Enter contact"
                                keyboardType="phone-pad"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.contact}
                                maxLength={10}

                            />
                            <CustomInput
                                name="address"
                                placeholder="Enter address"
                                keyboardType="default"
                                onChangeHandler={this.onChangeHandler.bind(this)}
                                errMsg={this.state.errMsg.address}
                                // maxLength={10}

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
                                }}>{this.state.c.dateOfReg}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                //  datePickerModeAndroid ="spinner"
                                isVisible={this.state.showPicker}
                                onConfirm={this.addDate}
                                onCancel={() => {
                                    this.setState({ showPicker: false });
                                }}
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
                                onPress={() => { this.onPressAddClinic() }}
                                disabled={!this.state.showErr}
                            > 
                                <Text style={{
                                    color: "#FFEEEE", fontSize: 20,
                                    alignSelf: "center", marginTop: 5,

                                }}>  Add a Clinic </Text>
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
                >
                    <Icon.Button

                            name = "local-hospital" 
                            color= "#fff"
                            size = {30}
                            style ={{
                                // margin:3,
                                // flex:1,
                                alignSelf:"center",
            
            
                            }}
                            backgroundColor="#51B4EE"
                            onPress={() => this.setState({ showModal: true })}

                            >
                                <Text style={{ color: "#FFFFFF", fontSize: 25, alignSelf: "center" }} >Add a Clinic</Text>
                            </Icon.Button>
                    {/*  */}
                </TouchableHighlight>
            </ImageBackground>
            // </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        backgroundColor: "#E0F1FB",
        alignContent: "center",
        marginBottom: 3,
        borderRadius: 5,
        height: 49,
        marginHorizontal: 10,
        borderRadius: 10

    }
})