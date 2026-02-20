import { View, FlatList, RefreshControl } from 'react-native';
import React, { useCallback } from 'react';
import { createStyles } from './styles'
import AuthHeader from '../../../../components/core/AuthHeader'
import { AddFriend, Friend } from '../../../../components/Friends';
import { useFetchFriend } from '../../../../ReactQueryHook/friend.hook';
import { useRoute } from '@react-navigation/native';

const FriendList = React.memo(() => {
    const styles = createStyles();
    const route: any = useRoute();
    const bookId: string = route?.params?.bookId;
    const isSharedBook: boolean = route?.params?.isShared === true;

    const { data: friendData, isLoading, refetch } = useFetchFriend(bookId);

    const renderItem = useCallback(({ item }: any) => (
        <Friend
            name={item.name}
            email={item.email}
            id={item.id}
            canManage={!isSharedBook}
        />
    ), [isSharedBook]);

    const keyExtractor = useCallback((item: any) => item.id, []);

    return (
        <View style={styles.root}>
            <AuthHeader title={`Group Members`} />
            <View style={styles.container}>
                {!isSharedBook && <AddFriend bookId={bookId} />}
                <FlatList
                    data={friendData}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={refetch}
                        />
                    }
                />
            </View>
        </View>
    );
});

FriendList.displayName = 'FriendList';
export default FriendList;