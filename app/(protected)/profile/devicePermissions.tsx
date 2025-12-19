import Layout from '@/components/general/PageLayout';
import { Section, SectionOption, SectionContainer } from '@/components/general/OptionsSection';
import React from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Contacts from 'expo-contacts';
import * as MediaLibrary from 'expo-media-library';
import BottomDrawer from '@/components/BottomDrawer';
import { View, Text, Linking } from 'react-native';
import BlueButton from '@/components/buttons/BlueButton';
import FullScreenActivity from '@/components/FullScreenActivity';

export default function ProfileContent() {
  const drawerRef = React.useRef<any>()
  const [permissions, setPermissions] = React.useState({
    notifications: 'Undetermined',
    location: 'Undetermined',
    contacts: 'Undetermined',
    messages: 'Undetermined',
    photos: 'Undetermined'
  });
  const [selectedPermission, setSelectedPermission] = React.useState<{ title: string, status: string, why: string } | null>(null);
  const [loading, setLoading] = React.useState(true);

  async function checkPermissions() {
    setLoading(true);
    const notifications = await Notifications.getPermissionsAsync();
    const location = await Location.getForegroundPermissionsAsync();
    const contacts = await Contacts.getPermissionsAsync();
    const photos = await MediaLibrary.getPermissionsAsync();

    setPermissions({
      notifications: formatStatus(notifications.status),
      location: formatStatus(location.status),
      contacts: formatStatus(contacts.status),
      messages: 'Undetermined', // No direct API for SMS permission check usually needed/available in same way
      photos: formatStatus(photos.status),
    });
    setLoading(false);
  }

  function formatStatus(status: any) {
    if (status === 'granted') return 'Allowed';
    if (status === 'denied') return 'Not allowed';
    return 'Not allowed'; // Default to not allowed for other states for simplicity in UI
  }

  React.useEffect(() => {
    checkPermissions();
  }, [])

  const handlePress = (type: string) => {
    let data = { title: '', status: '', why: '' };
    switch (type) {
      case 'notifications':
        data = { title: 'Notifications', status: permissions.notifications, why: 'To send you important alerts, updates, and messages in real time.' };
        break;
      case 'location':
        data = { title: 'Location', status: permissions.location, why: 'Your location helps us show nearby jobs, events, and relevant content.' };
        break;
      case 'contacts':
        data = { title: 'Contacts', status: permissions.contacts, why: 'Contacts access lets you find people you know and invite them easily.' };
        break;
      case 'messages':
        data = { title: 'Messages (SMS)', status: permissions.messages, why: 'To send SMS for authentication or sharing.' }; // Placeholder text
        break;
      case 'photos':
        data = { title: 'Photos', status: permissions.photos, why: 'Allows you to select photos to upload and share in the app.' };
        break;
    }
    setSelectedPermission(data);
    drawerRef.current.open();
  }


  if (loading) return <FullScreenActivity />

  return (
    <Layout
      headerTitle='Device Permissions'
    >
      <SectionContainer>
        <Section>
          <SectionOption
            title='Notifications'
            subTitle={permissions.notifications}
            onPress={() => handlePress('notifications')}
          />
          <SectionOption
            title='Location'
            subTitle={permissions.location}
            onPress={() => handlePress('location')}
          />
          <SectionOption
            title='Contacts'
            subTitle={permissions.contacts}
            onPress={() => handlePress('contacts')}
          />
          <SectionOption
            title='Messages (SMS)'
            subTitle={permissions.messages}
          />

          <SectionOption
            title='Photos'
            subTitle={permissions.photos}
            onPress={() => handlePress('photos')}
          />
        </Section>
      </SectionContainer>
      <BottomDrawer
        sheetRef={drawerRef}
        draggableIconHeight={0}
      >
        {selectedPermission && (
          <>
            <View style={{ borderRadius: 12, borderWidth: 1, borderColor: '#000', marginHorizontal: 16, padding: 16, marginBottom: 16 }}>
              <Text style={{ fontSize: 11, color: "#a6a6a6", marginBottom: 4 }}>Permission</Text>
              <Text style={{ fontSize: 15, marginBottom: 32 }}>{selectedPermission.title}</Text>
              <Text style={{ fontSize: 11, color: "#a6a6a6", marginBottom: 4 }}>Status</Text>
              <Text style={{ fontSize: 15, marginBottom: 32 }}>{selectedPermission.status}</Text>
              <Text style={{ fontSize: 11, color: "#a6a6a6", marginBottom: 4 }}>Why We Ask</Text>
              <Text style={{ fontSize: 15 }}>{selectedPermission.why}</Text>
            </View>
            <View style={{ marginHorizontal: 16 }}>
              <BlueButton
                title="Update Permission"
                onPress={() => Linking.openSettings()}
              />
            </View>
          </>
        )}
      </BottomDrawer>
    </Layout>
  )
}
