import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SingleItem = (props) => {
    const {url,title}=props;
    return (
        <View style={styles.item}>
            <Image
                source={{ uri: url }}
                style={{ width: 100, height: 100, }}
            />
            <Text numberOfLines={2} style={styles.title}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        width: '30%',
        backgroundColor: 'grey',
        margin: 5,
        paddingVertical:10,
        alignItems: 'center'
    },
    title: {
        marginTop: 5
    },
})

export default SingleItem;