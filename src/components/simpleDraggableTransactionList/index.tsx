import React, { useState } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity, Text, Animated } from 'react-native';
import TransactionListItem from '../transaction';

const SimpleExpandableTransactionList = ({
    data,
    refreshing,
    onRefresh,
    theme,
    styles,
    EmptyListComponent
}: any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [animatedHeight] = useState(new Animated.Value(300)); // Default height

    const toggleExpansion = () => {
        const targetHeight = isExpanded ? 300 : 600; // Toggle between 300 and 600

        Animated.spring(animatedHeight, {
            toValue: targetHeight,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
        }).start();

        setIsExpanded(!isExpanded);
    };

    const renderItem = ({ item }: any) => (
        <TransactionListItem {...item} />
    );

    return (
        <View style={{ flex: 1 }}>
            {/* Tap to expand/collapse */}
            <TouchableOpacity
                onPress={toggleExpansion}
                style={{
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.BACKGROUND || '#f0f0f0',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}
            >
                <View style={{
                    width: 40,
                    height: 4,
                    backgroundColor: theme.TEXT || '#666',
                    borderRadius: 2,
                    opacity: 0.5,
                }} />
                <Text style={{
                    color: theme.TEXT || '#666',
                    fontSize: 12,
                    marginTop: 4,
                    opacity: 0.7,
                }}>
                    {isExpanded ? 'Tap to collapse' : 'Tap to expand'}
                </Text>
            </TouchableOpacity>

            {/* Transaction List */}
            <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)}
                    showsVerticalScrollIndicator={false}
                    style={styles.flatList}
                    scrollEnabled={true}
                    bounces={true}
                    ListEmptyComponent={EmptyListComponent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.PRIMARY]}
                            tintColor={theme.PURPLE}
                            progressBackgroundColor={theme.SECONDARY}
                        />
                    }
                    ListFooterComponent={<View style={{ height: 20 }} />}
                />
            </Animated.View>
        </View>
    );
};

export default SimpleExpandableTransactionList;