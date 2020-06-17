import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, ActivityIndicator, StyleSheet, FlatList, Alert } from 'react-native';
import { BASE_URL, ALBUMS, PHOTOS } from '../../utils/urls';
import SingleItem from './Components/SingleItem';

const Home = () => {
    const [isLoading, setIsLoading] = useState(true); //for showing loader 
    const [photoData, setPhotoData] = useState(null); // for storing API response
    const [isLoadMore] = useState(true); // for load more data 
    const [isRefresh, setIsRefresh] = useState(false); // for pull to refresh 
    const [page, setPage] = useState(1); // iniial page 1
    
    
    // for fetching the data 
    const fetchData = async (page) => {
        let isfetching = true; // to check whether API is fetching or not
        const abortController = new AbortController(); // to abort the fetch API
        //to abort after particular seconds
        setTimeout(() => {
        abortController.abort();
        setIsLoading(false);
        if(isfetching){
            Alert.alert('Connection Time out!!!');
        }
          }, 7000); // to check the connection time out you can decrease the seconds(100)
        
          // Fetch to hit the API
        fetch(`${BASE_URL}/${ALBUMS}/${page}/${PHOTOS}`,{
            'signal': abortController.signal,
        }).
            then((response) => response.json())
            .then((responseJson) => {
                isfetching = false;
                console.log('fetching');
                setIsLoading(false); // to not show the loader
                page===1 ? // to check if its in page 1 or 1+
                    setPhotoData(responseJson)
                    :
                    setPhotoData(photoData.concat(responseJson)); // to concat the previous page data with the current page response
                setIsRefresh(false); // to make the refresh false
            })
            .catch((error) => {
                Alert.alert(error.message);
            })

           
    }
    useEffect(() => { // to work as componentDidMount
        if (page === 1) {
            fetchData(page);
        }
    }, []);

    useEffect(() => { // if the page will change it will hit  and page is greater than 1+
        if (page > 1) {
            setTimeout(()=>fetchData(page),500); // i had used setTimeout to show the loader, as its working very fast and not able to see the loader
        }
    }, [page]);

    useEffect(() => { // if the isRefresh will change it will hit 
        if (isRefresh) {
            let page=1;
            setTimeout(()=>fetchData(page),500);// i had used setTimeout to show the loader, as its working very fast and not able to see the loader
        }
    }, [isRefresh]);

    const renderFooter = () => ( // to show the footer of the flatlist
        isLoadMore && page > 1 && (
            <View style={styles.loader}>
                <ActivityIndicator size='large' />
            </View>
        )
    )
    const onRefresh = () =>{ // on pulling to refersh
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
                    numColumns={3} // to restrict the column to 3 
                    onRefresh={onRefresh} // to refresh
                    refreshing={isRefresh} // whether to call onRefresh or not
                    showsVerticalScrollIndicator={false} // to hide the verticalbarScroller
                    data={photoData} 
                    keyExtractor={item => item.id} // to make each item unique
                    renderItem={({ item }) => SingleItem(item)} // to render
                    onEndReachedThreshold={0.8} // it will call the onEndReached when it will range 80% of the screen to load more
                    ListFooterComponent={renderFooter} // to show loader in footer of the flatlist
                    onEndReached={() => { // on reaching end it will call 
                        if (isLoadMore) {
                            setPage(page + 1); //to increase the page
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