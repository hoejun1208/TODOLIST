import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function Todo(props) {
    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <TouchableOpacity onPress={props.onToggle}>
                    {props.completed ? <Icon name="checkmark-circle" size={30} color="skyblue"/> : <Icon name="ellipse-outline" size={30} color="skyblue" />}
                </TouchableOpacity>
            </View>
            <Text style={props.completed ? styles.itemTextCompleted : styles.itemText}>{props.text}</Text>
            <TouchableOpacity onPress={props.onDelete}>
                <Icon name="trash-bin-outline" size={30} color="#900" />
            </TouchableOpacity>
        </View>
    )
}


export default Todo;

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'

    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#55bcf6',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15
    },
    itemText: {
        maxWidth: '80%',
    },
    itemTextCompleted: {
        maxWidth: '80%',
        textDecorationLine: 'line-through',
        color: 'gray'
    },
    circular: {
        width: 12,
        height: 12,
        borderColor: '#55bcf6',
        borderWidth: 2,
        borderRadius: 5,
    }

});