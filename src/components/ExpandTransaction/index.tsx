import React, { useRef } from 'react';
import { View, FlatList, RefreshControl, Dimensions, Text } from 'react-native';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    Extrapolate,
    runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import TransactionListItem from '../transaction';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIN_HEIGHT = 200; // Minimum height when collapsed
const MAX_HEIGHT = SCREEN_HEIGHT * 0.6; // Maximum height when expanded
const DEFAULT_HEIGHT = 300; // Default height

const ExpandableTransactionList = ({
    data,
    refreshing,
    onRefresh,
    theme,
    styles,
    EmptyListComponent
}: any) => {
    const height = useSharedValue(DEFAULT_HEIGHT);
    const isDragging = useSharedValue(false);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: () => {
            isDragging.value = true;
        },
        onActive: (event) => {
            // Calculate new height based on drag direction
            const newHeight = height.value - event.translationY;

            // Clamp the height between min and max
            height.value = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
        },
        onEnd: (event) => {
            isDragging.value = false;

            // Snap to predefined heights based on velocity and current position
            const velocity = event.velocityY;
            const currentHeight = height.value;

            if (velocity > 500) {
                // Fast downward swipe - collapse
                height.value = withSpring(MIN_HEIGHT);
            } else if (velocity < -500) {
                // Fast upward swipe - expand
                height.value = withSpring(MAX_HEIGHT);
            } else {
                // Snap to nearest position based on current height
                if (currentHeight < (MIN_HEIGHT + DEFAULT_HEIGHT) / 2) {
                    height.value = withSpring(MIN_HEIGHT);
                } else if (currentHeight < (DEFAULT_HEIGHT + MAX_HEIGHT) / 2) {
                    height.value = withSpring(DEFAULT_HEIGHT);
                } else {
                    height.value = withSpring(MAX_HEIGHT);
                }
            }
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
        };
    });

    const handleStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            isDragging.value ? 1 : 0,
            [0, 1],
            [0.6, 1],
            Extrapolate.CLAMP
        );

        return {
            opacity,
        };
    });

    const renderItem = ({ item }: any) => (
        <TransactionListItem {...item} />
    );

    return (
        <View style={{ flex: 1 }}>
            {/* Drag Handle */}
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[handleStyle, {
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.BACKGROUND || '#f0f0f0',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }]}>
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
                        Drag to resize
                    </Text>
                </Animated.View>
            </PanGestureHandler>

            {/* Transaction List */}
            <Animated.View style={[animatedStyle, { overflow: 'hidden' }]}>
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

export default ExpandableTransactionList;