import React, { useState, useCallback } from 'react';
import { Text, View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import ListPageLayout from '@/components/general/ListPageLayout';
import { Section, SectionContainer, SectionOption } from '@/components/general/OptionsSection';
import { useRouter, useFocusEffect } from 'expo-router';
import protectedApi from '@/helpers/axios';
import SmallTextButton from '@/components/buttons/SmallTextButton';
import errorHandler from '@/helpers/general/errorHandler';

interface Ticket {
    id: string;
    status: string;
    ticket_id: string;
    // Add other fields if needed, but only ID and Status requested for table
}

export default function HelpCentre() {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        setTickets([]);
        try {
            setLoading(true);
            const response = await protectedApi.get('/talks/support/tickets/');
            setTickets(response.data.results);
        } catch (error: any) {
            errorHandler(error);
            console.log('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTickets();
        }, [])
    );

    const renderTicketRow = ({ item, index }: { item: Ticket, index: number }) => (
        <View style={[styles.row, index === tickets.length - 1 && { borderBottomWidth: 1, borderBottomRightRadius: 12, borderBottomLeftRadius: 12 }]}>
            <Text style={[styles.cell, styles.sNoCell]}>{index + 1}</Text>
            <View style={styles.idCell}>
                <SmallTextButton
                    style={{ flex: 2 / 4, paddingHorizontal: 8, textAlign: 'center', justifyContent: 'center', alignItems: 'center', fontSize: 13 }}
                    title={`T${item.ticket_id}`}
                    onPress={() => router.push(`/(protected)/profile/helpCentre/tickets/${item.ticket_id}`)} />
            </View>
            <Text style={[styles.cell, styles.statusCell]}>
                <Text style={{
                    color: item.status.toLowerCase() === 'open' ? '#00bf63' :
                        (item.status.toLowerCase() === 'closed' ? '#ff5757' : '#737373'),
                    fontWeight: '500'
                }}>
                    {item.status === 'open' ? 'Open' : item.status === 'closed' ? 'Closed' : 'Pending'}
                </Text>
            </Text>
        </View>
    );

    return (
        <ListPageLayout headerTitle='Help Center'>
            <FlatList
                ListHeaderComponent={() => <View style={{ marginTop: 24 }}>
                    <SectionContainer>
                        <Section>
                            <SectionOption
                                title='FAQs'
                                subTitle='Quick answers to common questions'
                                onPress={() => router.push('/(protected)/profile/helpCentre/faqs')}
                            />
                            <SectionOption
                                title='Get Support'
                                subTitle='Chat with our support team.'
                                onPress={() => router.push('/(protected)/profile/helpCentre/initiateSupport')}
                            />
                        </Section>
                    </SectionContainer>
                    <View style={{ marginTop: 48 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Support History</Text>
                        {loading ? (
                            <View style={styles.emptyContainer}>
                                <ActivityIndicator size='small' color='#202020' />
                            </View>
                        ) : tickets.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>You haven't created any support requests yet.</Text>
                            </View>
                        ) : (
                            <View style={[styles.row, styles.headerRow]}>
                                <Text style={[styles.headerCell, styles.sNoCell]}>S.No</Text>
                                <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
                                <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
                            </View>
                        )}
                    </View>
                </View>}
                data={tickets}
                renderItem={renderTicketRow}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={[{ marginHorizontal: 16, }]}
            />
        </ListPageLayout>
    )
}

const styles = StyleSheet.create({
    centerContainer: {
        padding: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 16,
        borderRadius: 12,
        borderColor: '#f5f5f5',
        borderWidth: 1,
        marginTop: 8,
        height: 210,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyText: {
        fontSize: 11,
        textAlign: 'center',
        color: "#d9d9d9"
    },
    tableContainer: {
        marginTop: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f5f5f5',
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        padding: 16,
        alignItems: 'center',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#f5f5f5',
    },
    headerRow: {
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#f5f5f5',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        marginTop: 8
    },
    separator: {
        height: 1,
        backgroundColor: '#f5f5f5',
    },
    cell: {
        fontSize: 13,
    },
    headerCell: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#737373',
    },
    sNoCell: {
        flex: 1 / 4,
        textAlign: 'center',
    },
    idCell: {
        flex: 2 / 4,
        paddingHorizontal: 8,
        textAlign: 'center',
    },
    statusCell: {
        flex: 1 / 4,
        textAlign: 'center',
    }
});