import AsyncStorage from "@react-native-async-storage/async-storage";

const appStorage = AsyncStorage;

const getItem = async (key: string) => {
    if (key) {
        return await appStorage.getItem(key)
    }
    return null;
}

const setItem = async (key: string, payload: string) => {
    if (key && payload) {
        return await appStorage.setItem(key, payload)
    }
    return null
}

export { getItem, setItem }