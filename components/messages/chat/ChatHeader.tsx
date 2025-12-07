/**
 * ChatHeader Component
 * 
 * Displays the header bar at the top of the chat screen.
 * Shows the recipient's profile picture, name, and a menu button.
 * Respects safe area insets for devices with notches.
 * 
 * @component
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageLoader from '@/components/ImageLoader';
import IconButton from '@/components/profile/IconButton';
import { useRouter } from 'expo-router';

/**
 * Props for the ChatHeader component
 */
interface ChatHeaderProps {
    /** Display name of the chat recipient */
    first_name: string;
    /** Profile image URL of the chat recipient */
    profile_image: string;
    /** Reference to the bottom sheet menu for chat options */
    menuRef: React.RefObject<any>;
}

/**
 * ChatHeader component renders the top navigation bar in the chat screen.
 * 
 * Features:
 * - Displays user's profile picture using ImageLoader component
 * - Shows the user's first name
 * - Provides a menu button to access chat options (view profile, block, delete, etc.)
 * - Automatically adjusts padding for devices with notches/safe areas
 * 
 * @param {ChatHeaderProps} props - Component props
 */

export function SupportHeader({ title }: { title: string }) {
    const { top } = useSafeAreaInsets();
    const router = useRouter();
    return (
        <View style={[styles.headerContainer, { paddingTop: top + 8, gap: 8, justifyContent: "flex-start", paddingBottom: 8 }]}>
            <IconButton onPress={() => {
                router.back()
            }}>
                <Image style={styles.menuIcon} source={require('@/assets/images/Back.png')} />
            </IconButton>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    )
}

export default function ChatHeader({ first_name, profile_image, menuRef }: ChatHeaderProps) {
    // Get safe area insets to properly position header on notched devices
    const { top } = useSafeAreaInsets();
    return (
        <View style={[styles.headerContainer, { paddingTop: top + 8 }]}>
            {/* Left section: Profile picture and name */}
            <View style={{ flexDirection: 'row', gap: 4 }}>
                {profile_image ? <ImageLoader size={40} uri={profile_image} border={1} /> : null}
                <View style={{ gap: 6, justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerName}>{first_name}</Text>
                </View>
            </View>
            {/* Right section: Menu button */}
            <View style={{ flexDirection: 'row', gap: 16 }}>
                <IconButton
                    onPress={() => {
                        menuRef.current?.open();
                    }}
                >
                    <Image source={require('@/assets/images/profile/home/menu.png')} style={styles.headerIcon} />
                </IconButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: "#f5f5f5"
    },
    headerName: {
        fontSize: 15,
        fontWeight: "600"
    },
    headerIcon: {
        width: 24,
        height: 24
    },
    menuIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },


});
