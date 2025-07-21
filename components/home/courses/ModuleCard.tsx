import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface ModuleCardProps {
  title: string,
  subTitle: string,
  pointsCount: number,
  onPress?: () => void;
  locked?: boolean;
}

export default function ModuleCard({ title, subTitle, pointsCount, onPress, locked }: ModuleCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && !locked && { borderColor: '#006dff' }]}
      onPress={onPress}
    >
      <View style={{ flex: 3 / 7 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{title}</Text>
        <Text style={{ fontSize: 11, color: '#a6a6a6', marginTop: 8 }}>{subTitle}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 4 / 7 }}>
        <Text style={{ fontSize: 11, color: '#a6a6a6', alignSelf: 'flex-end' }}>{pointsCount} points</Text>
        {
          !locked ? (
            <Text style={{ fontSize: 11, color: '#00bf63', alignSelf: 'flex-end' }}>Start now</Text>
          ) : (
            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', gap: 4 }}>
              <Image source={require('@/assets/images/lockGreyed.png')} style={{ width: 14, height: 14, objectFit: 'contain' }} />
              <Text style={{ fontSize: 11, color: '#a6a6a6' }}>Locked</Text>
            </View>
          )
        }

      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

})
