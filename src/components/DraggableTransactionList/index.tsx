import React, { useRef } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import TransactionListItem from '../transaction';

const ITEM_HEIGHT = 80; // Approximate height of each transaction item

// Individual draggable transaction item
const DraggableTransactionItem = ({ item, index, onMove, data }: any) => {
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: () => {
            scale.value = withSpring(1.05);
            zIndex.value = 1000;
        },
        onActive: (event) => {
            translateY.value = event.translationY;

            // Calculate which position this item should move to
            const newIndex = Math.round(index + event.translationY / ITEM_HEIGHT);
            const clampedIndex = Math.max(0, Math.min(data.length - 1, newIndex));

            if (clampedIndex !== index && Math.abs(event.translationY) > ITEM_HEIGHT / 2) {
                runOnJS(onMove)(index, clampedIndex);
            }
        },
        onEnd: () => {
            translateY.value = withSpring(0);
            scale.value = withSpring(1);
            zIndex.value = 0;
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { scale: scale.value },
            ],
            zIndex: zIndex.value,
            elevation: zIndex.value, // For Android
        };
    });

    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={animatedStyle}>
                <TransactionListItem {...item} />
            </Animated.View>
        </PanGestureHandler>
    );
};

// Main draggable FlatList component
const DraggableTransactionList = ({
    data,
    onReorder,
    refreshing,
    onRefresh,
    theme,
    styles,
    EmptyListComponent
}: any) => {
    const dataRef = useRef(data);
    dataRef.current = data;

    const handleMove = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;

        const newData = [...dataRef.current];
        const [movedItem] = newData.splice(fromIndex, 1);
        newData.splice(toIndex, 0, movedItem);

        onReorder(newData);
    };

    const renderItem = ({ item, index }: any) => (
        <DraggableTransactionItem
            item={item}
            index={index}
            onMove={handleMove}
            data={data}
        />
    );

    return (
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
            ListHeaderComponent={
                <View style={styles.pullIndicatorContainer}>
                    <View style={[styles.pullIndicator, { backgroundColor: theme.TEXT }]} />
                </View>
            }
            ListFooterComponent={<View style={{ height: 150 }} />}
        />
    );
};

export default DraggableTransactionList;