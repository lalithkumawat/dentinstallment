import { firestore } from 'firebase'
import React, { Component } from 'react'
import { Button, Text, View, } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

export default class Clinicinfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            clinicID: props.route.params._id,
            clinic: {}
        }


    }
    componentDidMount() {
        this.getFirebaseData(this.state.clinicID).then(() => { console.log("Data loaded"); }).catch(err => console.log(err, "errrrrr"))
        console.log(this.props);
        // this.props.navigation.setOptions({
        //     headerRight: () => (
        //         <Button title="Donate" onPress={() => this.props.navigation.navigate("Donate", { _id: this.state.clinicID })} />
        //     ),
		// 		})
		// 		this.totalPaynDue()
    }
    totalPaynDue = async () => {
        const clinicDocRef = await firestore().collection("clinics").doc(this.state.clinicID)
        const patientCollectionRef = clinicDocRef.collection("patients")
        patientCollectionRef.onSnapshot(snapshot => {
            let totalFeeReceived = 0,totalFeePending = 0, totalFee=0
            snapshot.forEach(doc => {
                console.log(doc.id," ",doc.data().totalFeePaid)
								totalFeeReceived = totalFeeReceived + doc.data().totalFeePaid;
								totalFeePending = totalFeePending +doc.data().totalFeeDue;
								totalFee = totalFee+parseFloat(doc.data().totalFee);
								console.log(totalFeeReceived," ",totalFeePending," ",totalFee);
								
						})
						clinicDocRef.update({totalFeeReceived:totalFeeReceived, totalFeePending:totalFeePending,totalFee:totalFee})
						
        })
    }
    getFirebaseData = async () => {
        const clinicRef = await firestore().collection("clinics").doc(this.state.clinicID);
        clinicRef.get().then(snap => {
            console.log(snap.data())
            this.setState({ clinic: snap.data() })
        }).catch(err => {
            console.log("Error while loading from firebase", err);
        })
    }

    render() {
        // console.log(this.props);
        const { clinic } = this.state
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: "#E0F1FB", borderRadius: 10 }}>
                    <View ><Text style={{ color: "black", fontSize: 25, alignSelf: "center" }} >{clinic.clinicName}</Text></View>
                    <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Doctor name:</Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>Dr. {clinic.docName}</Text></View>
                    <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Contact: </Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{clinic.contact}</Text></View>

                    <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Address</Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{clinic.address}</Text></View>
                    <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Date of Reg.</Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{clinic.dateOfReg}</Text></View>
                    <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Total payment received</Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{clinic.totalFeeReceived}</Text></View>
                    <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Total payment payment</Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{clinic.totalFeePending}</Text></View>
                    <View style={{ backgroundColor: "#d1edff", marginVertical: 2, alignItems: "center", flex: 1, flexDirection: "row" }} ><Text style={{ flex: 1, alignSelf: "flex-start" }}>Total payment </Text><Text style={{ flex: 1, alignSelf: "flex-start" }}>{clinic.totalFee}</Text></View>

                </View>

            </ScrollView>
        )
    }
}
