import { View, Text, FlatList, RefreshControl } from 'react-native'
import React from 'react'
import { createStyles } from './styles'
import AuthHeader from '../../../../components/core/AuthHeader'
import { AddFriend, Friend } from '../../../../components/Friends';
import { useFetchFriend } from '../../../../ReactQueryHook/friend.hook';
import { useRoute } from '@react-navigation/native';

const FriendList = () => {
    const styles = createStyles();
    const route: any = useRoute();
    const bookId: string = route?.params?.bookId

    const { data: friendData, isLoading, refetch } = useFetchFriend(bookId)

    return (
        <View style={styles.root}>
            <AuthHeader title={`Group Members`} />
            <View style={styles.container}>
                <AddFriend bookId={bookId} />
                <FlatList
                    data={friendData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Friend
                            name={item.name}
                            email={item.email}
                            id={item.id}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={refetch}
                        />
                    }
                />
            </View>
        </View>
    )
}

export default FriendList