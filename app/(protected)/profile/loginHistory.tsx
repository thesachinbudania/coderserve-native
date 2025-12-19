import PageLayout from '@/components/general/PageLayout';
import { Platform, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SectionOption } from '@/components/general/OptionsSection';
import React from 'react';
import MapView from 'react-native-maps';
import BottomDrawer from '@/components/BottomDrawer';
import BlueButton from '@/components/buttons/BlueButton';
import { useFetch } from '@/helpers/useFetch';
import DataWrapper from '@/components/general/DataWrapper';
import { useRouter } from 'expo-router';


const greyMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#cccccc" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#b0b0b0" }]
  }
];

function LogInfo({ deviceName, firstSignIn, lastActivity }: { deviceName: string, firstSignIn: string, lastActivity: string }) {
  return (
    <View style={logStyles.container}>
      <View>
        <Text style={logStyles.heading}>Device name</Text>
        <Text style={logStyles.info}>{deviceName}</Text>
      </View>
      <View>
        <Text style={logStyles.heading}>First Sign-In</Text>
        <Text style={logStyles.info}>{firstSignIn}</Text>
      </View>
      <View>
        <Text style={logStyles.heading}>Last Activity</Text>
        <Text style={logStyles.info}>{lastActivity}</Text>
      </View>
    </View>
  )
}

const logStyles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    gap: 24,
  },
  heading: {
    fontSize: 9,
    color: '#a6a6a6',
    marginBottom: 4,
  },
  info: {
    fontSize: 13
  }
})

type currentLog = {
  deviceName: string,
  signInTime: string,
  lastActivity: string,
  lat: number,
  long: number,
}

function formatDateTime(isoString: string) {
  const date = new Date(isoString);

  // Format the date (e.g., 20 Jan 2025)
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Format the time (e.g., 10:30 am)
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return `${formattedDate}, ${formattedTime}`;
}

export default function Page() {
  const sheetRef = React.useRef<any>(null);
  const [currentLog, setCurrentLog] = React.useState<currentLog | null>(null);
  const { data, isLoading, error } = useFetch('https://api.coderserve.com/api/accounts/get_login_history/')
  const router = useRouter();
  return (
    <>
      {data && data.results?.length === 0 ? (
        <PageLayout
          headerTitle='Login Activity'
        >
          <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>Your Login Activity Starts Here</Text>
            <Text style={{ textAlign: 'center', fontSize: 13, color: '#737373' }}>You’ve just signed up on this device, and no other logins have been recorded yet.</Text>
            <Text style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#737373' }}>Once you log in from a new device - or sign in again here - your login history will appear right on this page.</Text>
            <View style={{ marginTop: 32, width: '100%' }}>
              <BlueButton
                title='Okay'
                onPress={() => { router.back() }}
              />
            </View>
          </View>
        </PageLayout>
      ) :
        (
          <DataWrapper
            isLoading={isLoading}
            header='Login Activity'
          >
            <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
              <FlatList
                data={data?.results || []}
                renderItem={({ item }) => (
                  <SectionOption
                    title={item.device.device_name}
                    subTitle={`${item.state}, ${item.country}`}
                    onPress={() => {
                      setCurrentLog({
                        deviceName: item.device.device_name,
                        signInTime: item.time,
                        lastActivity: item.device.last_activity,
                        lat: Number(item.lat),
                        long: Number(item.long),
                      })
                      sheetRef.current.open()
                    }}
                  />
                )}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.loginContainer}
              />
            </ScrollView>
          </DataWrapper>
        )}
      <BottomDrawer
        sheetRef={sheetRef}
        draggableIconHeight={0}
        height={552}
      >
        <View style={styles.detailsContainer}>
          {
            currentLog && currentLog.lat && currentLog.long &&
            <>
              <LogInfo
                deviceName={currentLog.deviceName}
                firstSignIn={formatDateTime(currentLog.signInTime)}
                lastActivity={formatDateTime(currentLog.lastActivity)}
              />
              <Text style={[logStyles.heading, { marginTop: 32 }]}>Signed in from a nearby location</Text>
              <View style={styles.mapViewContainer}>
                <MapView
                  style={styles.mapView}
                  customMapStyle={greyMapStyle}
                  initialRegion={{
                    latitude: currentLog.lat,
                    longitude: currentLog.long,
                    latitudeDelta: Platform.OS === 'ios' ? 0.0722 : 0.0121,
                    longitudeDelta: Platform.OS === 'ios' ? 0.0721 : 0.0121,
                  }}
                />
              </View>
            </>

          }
          <BlueButton
            title='Thanks'
            onPress={() => sheetRef.current.close()}
          />
        </View>
      </BottomDrawer>
    </>
  )
}


const styles = StyleSheet.create({
  loginContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mapViewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 32,
  },
  mapView: {
    height: 184,
  },
  loadingView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
