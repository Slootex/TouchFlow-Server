import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Pressable, TouchableOpacity, View, ScrollViewBase } from 'react-native';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import { Button } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { SelectList } from 'react-native-dropdown-select-list'
import { MaterialIcons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import SearchBar from "react-native-dynamic-search-bar";
import Checkbox from 'expo-checkbox';
import { FontAwesome } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import { Fontisto } from '@expo/vector-icons'
import DrawerLayout from '../_layout';
import { useNavigation, DrawerActions } from '@react-navigation/native';



export default function Setup1() {

    const data = [
        { label: 'English', value: 'en' },
        { label: 'German', value: 'de' },
        { label: 'French', value: 'fr' },
        { label: 'Spanish', value: 'es' },
    ];

    return(

        <SafeAreaView className="bg-black w-full h-screen">
            <Text className="text-6xl text-white font-bold text-center mt-8">Einrichten</Text>
            <Text className="text-3xl text-white font-bold text-left mt-10 ml-16 pl-1">Schritt 1</Text>
            <Text className="text-xl text-white font-bold text-left ml-16 pl-1 mt-2">Sprache auswählen</Text>

            <View className="px-4 mt-4">
            <SelectList className="" inputStyles={{color:"white"}} dropdownTextStyles={{color:"white"}} disabledTextStyles={{color:"white"}}
                     setSelected={(val) => setSelected(val)} 
                     data={data} 
                     search={false}
                     placeholder='Sprache wählen'
                     boxStyles={{width:180}}
                     arrowicon= {<MaterialIcons className="right-0" name="keyboard-arrow-down" size={20} color={'white'} /> }
                     save="value"/>
            </View> 
        </SafeAreaView>

    )
}