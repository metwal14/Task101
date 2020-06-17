import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet, FlatList, Image } from 'react-native';
import { BASE_URL, ALBUMS, PHOTOS } from '../../utils/urls';
import SingleItem from './Components/SingleItem';

const Home = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [photoData, setPhotoData] = useState(null);
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [isRefresh, setIsRefresh] = useState(false);
    const [page, setPage] = useState(1);

    const fetchData = async (page) => {
        fetch(`${BASE_URL}/${ALBUMS}/${page}/${PHOTOS}`).
            then((response) => response.json())
            .then((responseJson) => {
                setIsLoading(false);
                page===1 ?
                    setPhotoData(responseJson)
                    :
                    setPhotoData(photoData.concat(responseJson));
                setIsRefresh(false);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    useEffect(() => {
        if (page === 1) {
            fetchData(page);
        }
    }, []);

    useEffect(() => {
        if (page > 1) {
            setTimeout(()=>fetchData(page),1000);
        }
    }, [page]);

    useEffect(() => {
        if (isRefresh) {
            let page=1;
            setTimeout(()=>fetchData(page),1000);
        }
    }, [isRefresh]);

    const renderFooter = () => (
        isLoadMore && page > 1 && (
            <View style={styles.loader}>
                <ActivityIndicator size='large' />
            </View>
        )
    )
    const onRefresh = () =>{
        setIsRefresh(true);
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            {console.log(photoData)}
            {
                isLoading && (
                    <View style={styles.loader}>
                        <ActivityIndicator
                            size="large"
                        />
                    </View>
                )
            }
            <View style={styles.itemFlatList}>
                <FlatList
                    numColumns={3}
                    onRefresh={onRefresh}
                    refreshing={isRefresh}
                    showsVerticalScrollIndicator={false}
                    data={photoData}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => SingleItem(item)}
                    onEndReachedThreshold={0.8}
                    ListFooterComponent={renderFooter}
                    onEndReached={() => {
                        if (isLoadMore) {
                            setPage(page + 1);
                        }
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    item: {
        width: '30%',
        backgroundColor: 'grey',
        margin: 5,
        alignItems: 'center'
    },
    title: {
        marginTop: 5
    },
    loader: {
        marginTop: '20%'
    }
})

export default Home;