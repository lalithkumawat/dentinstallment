import React, { Component } from 'react'
import {
  View, Text, Button, Modal, Alert, StyleSheet, TouchableHighlight,
   TouchableOpacity,
  Dimensions,
  TextInput,


} from 'react-native';

import ViewShot from "react-native-view-shot";

import { captureScreen } from 'react-native-view-shot';

import { Input, Icon } from "react-native-elements"
import DateTimePicker from "react-native-modal-datetime-picker";

import { ScrollView } from 'react-native-gesture-handler';
import * as Sharing from "expo-sharing";
import firebase from "firebase"


export default class PatientTenure extends Component {
  constructor(props) {
    super(props)

    this.state = {
      clinicID:props.route.params.clinicID,
      p: props.route.params.patient,
      modalVisible: false,
      payment: 0,

      date: (String(new Date(Date.now()).getDate()).padStart(2, '0') +
        "-" + String(new Date(Date.now()).getMonth() + 1).padStart(2, '0') + "-" +
        String(new Date(Date.now()).getFullYear())),
      showAddPayment: true,
      showPicker: false,
      screenShot: ""


    }


  }

  componentDidMount() {
    this.calculateTotalPaidnDue();

    // this.unsubscribe = firebase.firestore().collection("clinics").doc(this.state.clinicID)
    //   .collection("patients").onSnapshot(this.getFirebaseData)

  }
  componentWillUnmount() {
    // we have to unsubscribe when component unmounts, because we don't need to check for updates
    // this.unsubscribe()
  }
  getFirebaseData(){
    firebase.firestore().collection("clinics").doc(this.state.clinicID)
      .collection("patients").doc(this.state.p._id)

  }
  addDate = (date) => {
    console.log(date, typeof date);
    this.setState({
      date: (String(date.getDate()).padStart(2, '0') + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getFullYear()))
    })
  }
  onPressAddPayment = () => {
    let p = this.state.p;
    let date = this.state.date;


    console.log(typeof date, date);
    // let ddmmyyyy = String(date.getDate()).padStart(2, '0')+"-"+String(date.getMonth() + 1).padStart(2, '0')+"-"+String(date.getFullYear());

    console.log("onpressaddpayment", p);
    p.tenure.push({
      srNo: p.tenure.length + 1,
      date: date,
      feePaid: this.state.payment,
      feeDue: parseFloat(p.totalFeeDue - parseFloat(this.state.payment))
    })
    this.setState({
      p: p,
      modalVisible: false,
      showPicker: false
    })
    this.calculateTotalPaidnDue();




  }
  async uploadToFirebase() {

    const pRef = await firebase.firestore().collection("clinics").doc(this.state.clinicID)
    .collection("patients").doc(this.state.p._id)
    pRef.update({tenure:this.state.p.tenure, totalFeeDue:this.state.p.totalFeeDue,totalFeePaid:this.state.p.totalFeePaid})
  }
  async calculateTotalPaidnDue() {
    let temp = 0;
    let totalFee = this.state.p.totalFee;
    let due = 0

    // let totalFeePaid = this.state.p.totalFeePaid;
    let tenure = this.state.p.tenure
    console.log(typeof this.state.payment);
    tenure.map(t => temp = temp + (t.feePaid))
    console.log("tenure", tenure);
    console.log("total paid fee", temp);
    due = totalFee - temp
    console.log("total paid due", due);

    this.setState({
      p: { ...this.state.p, tenure: tenure, totalFeePaid: temp, totalFeeDue: due }

    })
    await this.uploadToFirebase()

    if (due == 0) {
      Alert.alert("Congratulations!!!", "Total payment received")
      this.setState({ showAddPayment: false })
    }


  }

  renderDatePicker() {
    if (!this.state.showPicker) {
      return (
        <RNDateTimePicker

          ref={picker => {
            this.datePicker = picker;
          }}
          style={{ flex: 1, alignSelf: "stretch" }}
          value={this.state.date}
          display="default"
          mode="date"
          placeholder="select date"
          // format="DD-MM-YYYY"
          maxDate="25-10-2020"

          // customStyles = {{

          //   dateIcon: {
          //     display: 'none', ///
          //     // alignSelf:"stretch",
          //     // position: 'relative',
          //     // left: 0,
          //     // top: 1,
          //     // marginLeft: 0,
          //   },
          //   dateInput: {
          //     // marginLeft: 0,
          //     marginHorizontal:3,
          //     alignSelf:"stretch",
          //     left:2,right:2,


          //   },

          // }}
          onChange={(date) => {
            console.log(date);
            this.setState({ date: date, });
          }}
        />
      )
    }
  }

  //
  openShareDialogAsync = async (uri) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(uri);
  };
  takeScreenShot = () => {
    // To capture Screenshot
    captureScreen({
      // Either png or jpg (or webm Android Only), Defaults: png
      format: 'jpg',
      // Quality 0.0 - 1.0 (only available for jpg)
      quality: 0.8,
    }).then(
      //callback function to get the result URL of the screnshot
      (uri) => {
        this.setState({
          screenShot: uri,
        })
        // setSavedImagePath(uri);
        // setImageURI(uri);
        console.log(uri);
        let options = {
          title: 'Share Title',
          message: 'Share Message',
          url: uri,
          type: 'image/jpeg',
        };
        this.openShareDialogAsync(uri)

        // Share.open(options)
        //   .then((res) => {
        //     console.log(res);
        //   })
        //   .catch((err) => {
        //      console.log(err);
        //   });
      },
      (error) => console.error('Oops, Something Went Wrong', error),
    ).catch(err => {
      console.log("errr", err);
    });
  };
  render() {
    return (
      //   <ViewShot
      //   ref="viewShot"
      //     options={{format: 'jpg', quality: 0.9}}>
      <ScrollView style={{ flex: 1 }}>
        <ViewShot
          // ref="viewShot"
          onCapture={(uri) => { this.setState({ screenShot: uri }) }}
          options={{ format: 'jpg', quality: 0.9 }}
          captureMode="update"
        >
          <View style={{ flex: 1, backgroundColor: "#E0F1FB", borderRadius: 10 }}>
            <View ><Text style={{ color: "black", fontSize: 25, alignSelf: "center" }} >{this.state.p.pName}</Text></View>
            <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Gender:</Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{this.state.p.pGender}</Text></View>

            <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Patient's Disease:</Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{this.state.p.pDisease}</Text></View>
            <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Treatment:</Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{this.state.p.pTreatment}</Text></View>
            <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Contact: </Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{this.state.p.contact}</Text></View>
            <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Date of First Visit: </Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{this.state.p.dateOfVisiting}</Text></View>

            <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Total fee: </Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{this.state.p.totalFee}</Text></View>
            <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Fee paid: </Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{this.state.p.totalFeePaid}</Text></View>
            <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Fee Due: </Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{this.state.p.totalFeeDue}</Text></View>

          </View>
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ backgroundColor: "#586790", borderRadius: 10 }}><Text style={{ alignSelf: "center", color: "#EAF0F1" }}>Tenure </Text></View>
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
              <View style={styles.headerCell}><Text style={{ color: "#EAF0F1" }}>Sr. No </Text></View>
              <View style={styles.headerCell}><Text style={{ color: "#EAF0F1" }}>Date </Text></View>
              <View style={styles.headerCell}><Text style={{ color: "#EAF0F1" }}>Fee Paid </Text></View>
              <View style={styles.headerCell}><Text style={{ color: "#EAF0F1" }}>Fee Due </Text></View>




              
            </View>

            {
              this.state.p.tenure.map(t => {
                return (
                  <View style={styles.row} key={t.srNo}>
                    <View style={styles.headerCell}><Text style={{ color: "#EAF0F1" }}> {t.srNo} </Text></View>
                    <View style={styles.headerCell}><Text style={{ color: "#EAF0F1" }}> {t.date} </Text></View>
                    <View style={styles.headerCell}><Text style={{ color: "#EAF0F1" }}> {t.feePaid} </Text></View>
                    <View style={styles.headerCell}><Text style={{ color: "#EAF0F1" }}>{t.feeDue}</Text></View>
                  </View>
                )
              })

            }
          </View>
          <View style={{ flex: 1, backgroundColor: "green", marginVertical: 2 }}>
            <View style={styles.row} >
              <View style={styles.footerCell}><Text style={{ textAlign: "center" }}>Total Fee paid: </Text></View>
              <View style={styles.footerCell}><Text style={{ textAlign: "center" }}>{this.state.p.totalFeePaid}</Text></View>
              <View style={styles.footerCell}><Text style={{ textAlign: "center" }} >Total Fee Due: </Text></View>
              <View style={styles.footerCell}><Text style={{ textAlign: "center" }}>{this.state.p.totalFeeDue}</Text></View>
            </View>
          </View>
        </ViewShot>
        <View style={{ flex: 1, backgroundColor: "white", marginVertical: 2 }}>
          <Modal
            style={styles.modal}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { console.log("Modal has been closed.") }}>

            <View style={styles.modalView}>
              <View style={{
                flex: 1 / 2,
                borderRadius: 10,
                margin: 3,
                backgroundColor: "lightblue",
                marginHorizontal: 1,
                alignSelf: "stretch",
                alignItems: "center",


              }}>
                <Text style={{ color: "white", fontSize: 18 }}>how much to pay</Text>
              </View>


              <Input
                style={{
                  flex: 1, marginTop: 20, alignSelf: "center",
                  textAlign: 'center'

                }}
                keyboardType="decimal-pad"
                placeholder="Add Payment"

                onChangeText={text => {
                  if (parseFloat(text) > this.state.p.totalFeeDue) {
                    Alert.alert("Sorry", "Payment can not be more than due amount")
                  }
                  else {
                    this.setState({ payment: parseFloat(text) })

                  }

                }}

              />
              
              <TouchableOpacity
                style={{ flex: 1, alignSelf: "stretch", }}
                onPress={() => this.setState({ showPicker: !this.state.showPicker })}

              >
                <Text style={{
                  fontSize: 18, alignSelf: "center"
                }}>{this.state.date}</Text>
              </TouchableOpacity>
             
              <DateTimePicker
                //  datePickerModeAndroid ="spinner"
                isVisible={this.state.showPicker}
                onConfirm={this.addDate}
                onCancel={() => {
                  this.setState({ showPicker: false });
                }}
              />



              {/* )} */}
              {/* )
                 :(<View style = {{
                  // flex:1/2,
                  
                  borderRadius:10,
                  margin:3,
                  backgroundColor:"lightblue",
                  marginHorizontal:1,
                  alignSelf:"stretch",
                  alignItems:"center",
 
                }}>
                <Text> Date</Text>
                </View>)} */}
              {/* </TouchableHighlight> */}


              <View style={{ flex: 1, flexDirection: "row", }}>
                <TouchableHighlight
                  style={{
                    flex: 1 / 2, backgroundColor: "lightgreen", alignSelf: "auto", marginHorizontal: 2,
                    borderRadius: 5, alignItems: "center"
                  }}
                  onPress={() => this.onPressAddPayment()}
                  disabled={!(this.state.payment > 0)}
                >
                  <Text style={{ alignSelf: "center", color: "#fff", margin: 7 }}>Add Payment</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={{
                    flex: 1 / 2, backgroundColor: "#F07373", alignSelf: "auto", marginHorizontal: 2,
                    borderRadius: 5, alignItems: "center"
                  }}
                  onPress={() => {
                    this.setState({ modalVisible: !this.state.modalVisible })
                  }}>

                  <Text style={{ alignSelf: "center", color: "#fff", margin: 7 }}>Cancel</Text>
                </TouchableHighlight>
              </View>

            </View>
          </Modal>

          <Button
            title="Add a payment"
            onPress={() => {
              this.setState(
                { modalVisible: true }
              )
            }}
            disabled={!this.state.showAddPayment}
          />





        </View>

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => this.openShareDialogAsync(this.state.screenShot)}>
          <Text style={styles.buttonTextStyle}>
            Share details
          </Text>
        </TouchableOpacity>




      </ScrollView>
      // </ViewShot>
    )
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    minWidth: 250,
  },
  buttonTextStyle: {
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  datePickerStyle: {
    width: 200,
    marginTop: 20,
  },
  row: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginTop: 1,
    borderRadius: 3,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 10,
    backgroundColor: "#586790",
    borderRadius: 3,
  },
  footerCell: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 10,
    backgroundColor: "#7CEC9F",
    borderRadius: 3,

  },
  cell: {
    flex: 1,
    alignItems: 'center',

    marginHorizontal: 2,
    marginVertical: 2,
    backgroundColor: "#586776",
    borderRadius: 3,

  },
  modal: {
    height: 500,
    width: 800,

    alignSelf: "baseline",
    alignItems: "center"



  },
  modalView: {
    height: 300,
    width: 300,
    // margin: 10,
    marginHorizontal: (Dimensions.get("window").width - 300) / 2,
    marginVertical: (Dimensions.get("window").height - 300) / 2,
    backgroundColor: "#EAF0F1",
    borderRadius: 20,
    padding: 35,
    alignSelf: "center",

    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modal: {

  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});


