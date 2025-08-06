import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { FeatherIcon, MaterialIcons } from '../../../utils/Icons';
import { useTheme } from '../../../utils/colors';
import { createStyles } from './styles';
import { useFetchUserDetails, useUserLogout } from '../../../ReactQueryHook/auth.hook';
import { UserDataProps } from '../../../utils/types';
import EditInformation from '../../../components/EditInformation';

type InfoRowProps = {
    icon: React.ReactNode;
    label: string;
    value?: string;
};

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => {
    const styles = createStyles();
    return (
        <View style={styles.row}>
            {icon}
            <View style={styles.labelContainer}>
                {value && <Text style={styles.valueText}>{value}</Text>}
                <Text style={styles.labelText}>{label}</Text>
            </View>
        </View>
    );
};

const ProfileScreen: React.FC = () => {
    const styles = createStyles();
    const { isDark, setTheme, theme } = useTheme();
    const [isVisible, setIsVisible] = useState<boolean>(false)

    const { mutate: UserLogout } = useUserLogout();
    const { data: UserDetails, isFetching, refetch } = useFetchUserDetails();

    const fade = useSharedValue(0);

    useEffect(() => {
        fade.value = withTiming(1, { duration: 500 });
    }, []);

    const fadeStyle = useAnimatedStyle(() => ({
        opacity: fade.value,
        transform: [{ translateY: fade.value * 10 }],
    }));

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                style={styles.root}
                refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
            >
                <Text style={styles.headerText}>Profile</Text>

                <View style={styles.headContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {UserDetails?.fullName?.[0]?.toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <View style={styles.profileContainer}>
                        <Text style={styles.profileText}>Personal Information</Text>
                        <TouchableOpacity onPress={() => setIsVisible(true)}>
                            <FeatherIcon name="edit" size={20} color={theme.SECONDARY} />
                        </TouchableOpacity>
                    </View>
                </View>

                <Animated.View style={[styles.card, fadeStyle]}>
                    <InfoRow
                        icon={<FontAwesome5Icon name="user" size={24} color="purple" style={styles.icon} />}
                        label="Full Name"
                        value={UserDetails?.fullName || 'N/A'}
                    />
                    <InfoRow
                        icon={<FeatherIcon name="phone" size={24} color="purple" style={styles.icon} />}
                        label="Phone"
                        value={UserDetails?.phoneNumber || 'N/A'}
                    />
                    <InfoRow
                        icon={<MaterialIcons name="email" size={24} color="purple" style={styles.icon} />}
                        label="Email"
                        value={UserDetails?.email || 'N/A'}
                    />

                    <TouchableOpacity style={styles.row} onPress={() => UserLogout()}>
                        <FeatherIcon name="log-out" size={24} color="purple" style={styles.icon} />
                        <View style={styles.labelContainer}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.row}>
                        <FeatherIcon name="sun" size={24} color="purple" style={styles.icon} />
                        <View style={styles.labelContainer}>
                            <Text style={styles.valueText}>Dark Mode</Text>
                        </View>
                        <Switch
                            style={styles.switch}
                            value={isDark}
                            onValueChange={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
                        />
                    </View>
                </Animated.View>
            </ScrollView>
            <EditInformation isVisible={isVisible} setIsVisible={setIsVisible} />
        </View>
    );
};

export default ProfileScreen;
