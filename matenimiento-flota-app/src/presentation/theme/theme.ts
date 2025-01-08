import { StyleSheet } from "react-native";

export const globalColors ={
    primary: '#004170',
    secondary: '#F0F0F0',
    rol: '#6C7072',
    dark: '#000',
    background: '#FFFFFF', 

}

export const globalStyles = (top: number) => StyleSheet.create({

    container:{
        flex:1,
        padding: 20,
        backgroundColor: globalColors.background,
        paddingTop: top,
    },
    
/*     primaryButton: {
        backgroundColor: globalColors.primary,
        borderRadius: 5,
        padding: 10,
        margin: 10,
        width: '100%',
        alignItems: 'center',
    },

    buttonText: {
        color: globalColors.primary,
        fontSize: 18,
    } */

})