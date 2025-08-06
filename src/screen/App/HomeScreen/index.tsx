import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { createStyles } from './styles'
import Header from './components/Header';
import SecondHeader from './components/SecondHeader';
import Chart from './components/Chart';
import { MaterialIcons } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import TransactionList from '../../../components/transaction';
import { useFetchLatestTransaction } from '../../../ReactQueryHook/transaction.hook';

const HomeScreen = () => {
    const styles = createStyles();
    const { theme } = useTheme();
    const { data: transactionData, isLoading: refreshing, refetch } = useFetchLatestTransaction()

    // Simulated transaction data - replace with your actual data

    const EmptyListComponent = () => (
        <View style={styles.emptyState}>
            <MaterialIcons name="receipt-long" size={64} color={theme.PURPLE} />
            <Text style={[styles.emptyText, { color: theme.TEXT }]}>
                {refreshing ? 'Loading transactions...' : 'No recent transactions found'}
            </Text>
        </View>
    );

    const renderRecentTransaction = ({ item }: any) => {
        return <TransactionList {...item} />;
    };

    return (
        <View style={styles.root}>
            <Header />
            <SecondHeader />
            <Chart />
            <FlatList
                data={transactionData}
                renderItem={renderRecentTransaction}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                style={styles.flatList}
                scrollEnabled={true}
                bounces={true}
                ListEmptyComponent={EmptyListComponent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refetch}
                        colors={[theme.PRIMARY]}
                        tintColor={theme.PURPLE}
                        progressBackgroundColor={theme.SECONDARY}
                    />
                }
                ListHeaderComponent={
                    <View style={styles.pullIndicatorContainer}>
                        <View style={[styles.pullIndicator, { backgroundColor: theme.TEXT }]} />
                    </View>
                }
                ListFooterComponent={<View style={{ height: 150 }} />}
            />
        </View>
    )
}

export default HomeScreen