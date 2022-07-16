import { firestore } from 'firebase'
import React, { Component, } from 'react'
import { Alert, FlatList } from 'react-native';
import {
	TextInput, Text,
	View, StyleSheet, TouchableOpacity,
	ScrollView, TouchableHighlight, Modal, Dimensions,ImageBackground
} from 'react-native'
import { SearchBar } from 'react-native-elements';

import DateTimePicker from "react-native-modal-datetime-picker";

import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import { SafeAreaView } from 'react-native-safe-area-context';
import Swipeable from "react-native-gesture-handler/Swipeable";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Donate extends Component {
	constructor(props) {
		super(props)

		this.state = {
			search:"",
            searchArray:"",
			clinicID: props.route.params._id,
			showPicker: false,
			showModal: false,
			showEditDonation: false,
			screenShot: "",
			editDonationId: "",
			donations: [],
			donation: {
				_id: "",
				donator: "",

				amount: "",

				note: "",

				date: (String(new Date(Date.now()).getDate()).padStart(2, '0') +
					"-" + String(new Date(Date.now()).getMonth() + 1).padStart(2, '0') + "-" +
					String(new Date(Date.now()).getFullYear()))
			},
			error: ""
		}


	}
	componentDidMount() {
		this.getFirebaseData(this.state.clinicID).then(() => { console.log("Data loaded"); }).catch(err => console.log(err, "errrrrr"))
	}
	getFirebaseData = async () => {
		const donationsRef = await firestore().collection("clinics").doc(this.state.clinicID).collection("donations");
		donationsRef.onSnapshot(snap => {
			let donations = [];
			snap.docs.forEach(doc => {
				console.log("getting data from firebase", doc.data());
				donations.push(doc.data())
			})

			this.setState({ donations: donations });

		})
	}
	onChangeHandler = (name, value) => {
		// console.log(name, value);
		switch (name) {
			case "donator":
				let regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
				value !== "" ?
					this.setState({ donation: { ...this.state.donation, donator: value }, error: "" })
					: this.setState({ error: "Please enter valid name" })
				break;
			case "amount":
				value === "" ?
					this.setState({ error: "Please enter valid amount" })
					: this.setState({ error: "", donation: { ...this.state.donation, amount: parseFloat(value) } })
				break;
			case "note":
				value === "" ?
					this.setState({ donation: { ...this.state.donation, note: "---" } }) :
					this.setState({ donation: { ...this.state.donation, note: value } })

			default:
				break;

		}
		console.log("state in change = ", this.state.donation);
	}
	saveDonation = async () => {
		console.log("sdfgh");
		const donationsRef = await firestore().collection("clinics").doc(this.state.clinicID).collection("donations")

		donationsRef.add(this.state.donation).then(snap => {
			console.log(snap, "uploaded");
			snap.update({ _id: snap.id })
			this.setState({ showModal: false })
		}).catch(err => { console.log(err); })

	}
	editDonation = (_id,note) => {
		const donationsRef = firestore().collection("clinics").doc(this.state.clinicID).collection("donations")

		donationsRef.doc(_id).update({ note: note }).then(() => {
			console.log("Donator's note added");
			this.setState({ showEditDonation: false })
		}).catch((err => {
			console.log("Error while editing", err);
		}))
	}
	deleteDonation = async (item) => {
		const donationsRef = await firestore().collection("clinics").doc(this.state.clinicID).collection("donations")

		Alert.alert("Alert", "Do you want to delete \"" + item.donator + "\'s\" data?",
			[
				{
					text: "Delete", onPress: () => {
						this.setState({
							donations: this.state.donations.filter(d => d._id !== item._id)
						})

						donationsRef.onSnapshot(snap => {
							snap.forEach(doc => {
								if (doc.ref.id === item._id) {
									doc.ref.delete().then(() => console.log(item.donator, "deleted"))
										.catch(() => console.log("Error while deleting", item.donator))
								}
							})
						})

					}
				},
				{
					text: "Cancel",
					onPress: () => {
						this.setState({
							// toDelete: {}
						})
						// this.setState({ showMenu: false })
					}
				}
			]
		)
	}
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

			},
			(error) => console.error('Oops, Something Went Wrong', error),
		).catch(err => {
			console.log("errr", err);
		});
	};


	onSwipeRight = ({ item }) => {
		return (<View style={{
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
				onPress={() => this.deleteDonation(item).then(() => { console.log("deleted "); }).catch(() => { console.log("Error while deleting "); })}
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
				// backgroundColor="#51B4EE"
				/>



			</TouchableHighlight>
			<TouchableHighlight
				style={{
					backgroundColor: "green",
					borderRadius: 5,
					marginVertical: 5,
					marginHorizontal: 5,
					flex: 1,
				}}
				onPress={() => this.openShareDialogAsync(this.state.screenShot).then(() => { console.log("deleted "); }).catch((err) => { console.log("Error while deleting ", err.message); })}
			>
				<Icon
					name="share"
					color="#4EEF50"
					size={30}
					style={{
						// margin:3,
						// flex:1,
						alignSelf: "center",


					}}
				// backgroundColor="#51B4EE"
				/>
			</TouchableHighlight>
		</View>)
	}
	renderItem = ({ item }) => {
		console.log("jhg", item);

		return (

			<Swipeable
				renderRightActions={() => this.onSwipeRight(item)}
			>
				<TouchableHighlight
					style={styles.item}
					onPress = {()=>{this.setState({showEditDonation:!this.state.showEditDonation,editDonationId:item._id})}}

				>

					<ViewShot
						onCapture={(uri) => { this.setState({ screenShot: uri }) }}
						options={{ format: 'jpg', quality: 0.9 }}
						captureMode="mount"
					>
						<View style={{
							backgroundColor: "#1E88E5",
							flex: 1,
							flexDirection: "row",
							borderRadius: 5,
							marginHorizontal: 5,
							marginVertical: 5,

						}}>
							<Text style={{
								marginLeft: 10,
								color: "#B3E5FC",
								fontSize: 20,
								alignSelf: "center",
								flex: 1
							}}>
								{item.donator}</Text>
							<Text style={{ color: "#B3E5FC", fontSize: 20, alignSelf: "center", margin: 2, flex: 1 }}>
								{item.note}
							</Text>
							<Text style={{ color: "#E0E0E0", fontSize: 20, alignSelf: "center", margin: 2, flex: 1 }}>
								Rs. {item.amount}/-
                    </Text>
						</View>
					</ViewShot>
				</TouchableHighlight>

			</Swipeable>
		)
	}
	searchDonations = (donator) => {
        this.setState({ search: donator })
        let donations = this.state.donations
        let filteredDonations = donations.filter((d => d.donator.toLowerCase().match(donator.toLowerCase())))
        console.log("searching for", filteredDonations.length);
        this.setState({
            searchArray: filteredDonations
        })

    }
	render() {
		return (
				<ImageBackground
					blurRadius={1}
					source={require("../assets/donationbg.webp")}
					style={{
						flex: 1,
						resizeMode: 'stretch', // or 'stretch'
						// alignItems: 'stretch',

						justifyContent: 'center',
						opacity: 0.9,
						overflow: "scroll",
						backgroundColor: "lightblue",


					}}
				>
			<SafeAreaView style={{ flex: 1 }}>
					
				<Modal style={{

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
					onRequestClose={() => {
						this.setState({ showModal: false })
					}}
				>
					
					<View
						style={{
							flex: 1,
							backgroundColor: "#E0F1FB",
							position: "relative",
							borderRadius: 10,
							// backgroundColor: 'rgba(100,100,100, 0.5)'
						}}>
						<View

							style={{
								marginVertical: 30,
								backgroundColor: "#E0F1FB",
								position: "relative",
								borderRadius: 10,

							}}>




							<TextInput

								label={"donator"}
								autoCapitalize="words"
								keyboardType="name-phone-pad"
								style={styles.textInputStyle}
								selectionColor="#25CCF7"
								placeholder="Name of Donator"
								onChangeText={(value) => this.onChangeHandler("donator", value)}

							/>

							<TextInput
								label={"Amount"}
								// secureTextEntry
								autoCapitalize="none"
								style={styles.textInputStyle}
								selectionColor="#25CCF7"
								keyboardType="decimal-pad"
								placeholder="Amount to be donated"
								// error={isValid}
								onChangeText={(value) => this.onChangeHandler("amount", value)}
							/>
							<TextInput
								
								// secureTextEntry
								autoCapitalize="none"
								style={styles.textInputStyle}
								selectionColor="#25CCF7"

								placeholder="Note"
								// error={isValid}
								onChangeText={(value) => this.onChangeHandler("note", value)}
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
								}}>{this.state.donation.date}</Text>
							</TouchableOpacity>
							<DateTimePicker
								//  datePickerModeAndroid ="spinner"
								isVisible={this.state.showPicker}
								onConfirm={
									(date) => {
										this.setState({
											donation: {
												...this.state.donation,
												date: (String(date.getDate()).padStart(2, '0') + "-" +
													String(date.getMonth() + 1).padStart(2, '0') + "-" +
													String(date.getFullYear()))
											}
										})
									}
								}
								onCancel={() => {
									this.setState({ showPicker: false });
								}}
							/>

							<TouchableHighlight
								onPress={() => this.saveDonation().then((res) => { console.log("added", res.id); }).catch(err => console.log("error", err))}
								style={styles.donate}
								disabled={!(this.state.donation.amount && this.state.donation.donator)}
							>

								<Text style={{
									flex: 1,
									margin: 5,

									color: "#FEEE11",

								}}>
									Donate
					</Text>
							</TouchableHighlight>
						</View>
					</View>
				</Modal>
					<Modal style={{

						marginHorizontal: (Dimensions.get("window").width - 300) / 2,
						marginVertical: (Dimensions.get("window").height - 300) / 2,
						// backgroundColor: "#ffFFF",
						position: "absolute",
						alignSelf: "center",
						alignContent:"center",
						backgroundColor: "#EAF0F1",
						borderRadius: 20,
						flex: 1,
						flexDirection: "row"

					}}
						animationType="fade"
						transparent={false}
						visible={this.state.showEditDonation}
						onRequestClose={() => {
							this.setState({ showEditDonation: false })
						}}
					>
						<View style={{
							backgroundColor: "#EAF0F1",
							borderRadius: 20,
							// flex: 1,
							padding:30,
							height:200,
							width:300,
							// marginTop:300,
							alignSelf:"center",
							// marginHorizontal: (Dimensions.get("window").width - 400) / 2,
							marginTop: 200,

						}}>
							<TextInput

								// secureTextEntry
								autoCapitalize="none"
								style={{
									maxHeight: 100,
									margin: 5,
									padding: 10,
									minHeight: 100,
									borderColor: "#74B9FF",
									borderWidth: (1),
									fontSize: 18,
									textAlign: "center",
									borderRadius: 10
								}}
								selectionColor="#25CCF7"
								multiline={true}
								placeholder="Note"
								// error={isValid}
								onChangeText={(value) => this.onChangeHandler("note", value)}
							/>
							<View style={{
								flex:1,
								flexDirection:"row",
								alignContent:"stretch"
							}}>
							<TouchableHighlight
								onPress={() => this.editDonation(this.state.editDonationId, this.state.donation.note).then((res) => { console.log("added", res.id); }).catch(err => console.log("error", err))}
								style={{
									alignItems: "center",
									// alignSelf: "center",
									backgroundColor: "coral",
									width: 90, height: 40,
									borderRadius: 10,
									margin: 5,
									flex:1/2
							
								}}
								disabled={!(this.state.donation.note)}
							>

								<Text style={{
									flex: 1,
									margin: 5,
									
									color: "#FEEE11",

								}}>
									Save
					</Text>
							</TouchableHighlight>
							<TouchableHighlight
								onPress={() => this.setState({ showEditDonation: false })}
								style={{
									alignItems: "center",
									// alignSelf: "center",
									backgroundColor: "coral",
									width: 90, height: 40,
									borderRadius: 10,
									margin: 5,
									flex:1/2
							
								}}
								
							>

								<Text style={{
									flex: 1,
									margin: 5,
									color: "#FEEE11",

								}}>
									Cancel
					</Text>
							</TouchableHighlight>
							</View>
						</View>
						</Modal>
				<ScrollView
					style={{ flex: 1,
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
                    onChangeText={this.searchDonations}
                    value={this.state.search}
                    returnKeyType="search"
                />
                {
                    this.state.searchArray ? (<FlatList
                        style={{
							marginTop: 10,
							marginHorizontal:10
                        }}
                        data={this.state.searchArray}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item._id}
                    />) :<FlatList
					style={{
						marginTop: 10,
						marginHorizontal:10
					}}
                    data={this.state.donations}
                    renderItem={this.renderItem}
                    keyExtractor={item => item._id}

                />
                    }
					
					<View style={{
						alignSelf: "center",
						alignContent: "center"
					}}>
						<Icon
							name="add"
							color="#ffe"
							size={30}
							onPress={() => this.setState({ showModal: !this.state.showModal })}
						/>
					</View>
				</ScrollView>
				</SafeAreaView>
				</ImageBackground>
		)
	}
}
const styles = StyleSheet.create({

	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	seperatorLine: {
		height: 3,
		backgroundColor: "gray"
	},
	donate: {
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: "coral",
		width: 90, height: 40,
		borderRadius: 10,
		margin: 5

	},
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
});
