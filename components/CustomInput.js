import React,{useState} from "react"
import { View,TextInput } from "react-native";


export default function CustomInput(props) {
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
            />
            {props.errMsg ? <Text style={{ fontSize: 12, alignSelf: "center", color: "red", marginTop: 0 }}>
                {props.errMsg}
            </Text> : null}
            {/* {showErr?<Text style= {{fontSize:12,alignSelf:"center",color:"red",marginTop:0}}>{errMsg}</Text>:null} */}
        </View>
    )
}
