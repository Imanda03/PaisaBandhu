import { View, Text, FlatList, RefreshControl, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '../../../utils/colors';
import { createStyles } from './styles';
import { IoniconsIcon, MaterialIcons } from '../../../utils/Icons';
import BookListItem from '../../../components/books';
import BottomSheet from '../../../components/BottomSheet';
import { useNavigation } from '@react-navigation/native';
import BookFormSheet from './Components/BookFormSheet';
import { useFetchFinancialBook } from '../../../ReactQueryHook/book.hook';
import { BookInterfaceProps } from '../../../utils/types';

const emptyBook: BookInterfaceProps = { id: '', title: '', type: 'single' }


const BookScreen = () => {
    const styles = createStyles();
    const { theme, isDark } = useTheme();
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookInterfaceProps>(emptyBook)

    const navigation: any = useNavigation()

    const { data: financialBook, refetch, isLoading: fetchLoading } = useFetchFinancialBook()

    const handleBookPress = (book: BookInterfaceProps) => {
        console.log("book", book)
        navigation.navigate('InnerScreen', {
            screen: 'Transactions',
            params: { bookId: book.id, type: book.type, title: book.title }
        })
    }

    const renderBookList = ({ item }: any) => {
        return <BookListItem
            item={item}
            onEditPress={() => openEditBookModal(item)}
            onPress={() => handleBookPress(item)}
        />
    };

    const openAddBookModal = () => {
        setIsAddMode(true);
        setBottomSheetVisible(true);
    };

    const openEditBookModal = (bookItem: BookInterfaceProps) => {
        setIsAddMode(false);
        setBottomSheetVisible(true);
        setSelectedBook(bookItem)
    };


    const EmptyListComponent = () => (
        <View style={styles.emptyState}>
            <MaterialIcons name="menu-book" size={64} color={theme.PURPLE} />
            <Text style={[styles.emptyText, { color: theme.TEXT }]}>
                {fetchLoading ? 'Loading transactions...' : 'No financial records yet'}
            </Text>
            <Text style={[styles.actionText, { color: isDark ? theme.SECONDARY : theme.PURPLE }]}>
                Add your first record by tapping the + button
            </Text>
        </View>
    );
    return (
        <View style={styles.root}>
            <TouchableOpacity style={styles.headerContainer}>

                <Text style={styles.headerText}>Financial Books</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={openAddBookModal}
                >
                    <IoniconsIcon name="add" size={32} color={theme.PURPLE} />
                </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.content}>
                <FlatList
                    data={financialBook}
                    renderItem={renderBookList}
                    keyExtractor={(item) => String(item.id)}
                    showsVerticalScrollIndicator={false}
                    // style={styles.flatList}
                    scrollEnabled={true}
                    bounces={true}
                    ListEmptyComponent={EmptyListComponent}
                    refreshControl={
                        <RefreshControl
                            refreshing={fetchLoading}
                            onRefresh={refetch}
                            colors={[theme.PRIMARY]}
                            tintColor={theme.PURPLE}
                            progressBackgroundColor={theme.SECONDARY}
                        />
                    }
                    ListFooterComponent={<View style={{ height: 150 }} />}
                />
            </View>
            <BookFormSheet
                isVisible={isBottomSheetVisible}
                onClose={() => { setBottomSheetVisible(false); setSelectedBook({ id: '', title: '', type: 'single' }) }}
                isAddMode={isAddMode}
                selectedBook={selectedBook}
            />


        </View>
    )
}

export default BookScreen