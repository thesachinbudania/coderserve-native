import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

type ProgressBarProps = {
  percent: number; // 0 to 100
};

const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => {
  const maxWidth = 96;
  const greenWidth = (percent / 100) * maxWidth;

  return (
    <View style={[progressBarStyles.container, { width: maxWidth }]}>
      <View style={[progressBarStyles.filled, { width: greenWidth }]} />
      <View style={[progressBarStyles.unfilled, { width: maxWidth - greenWidth, left: greenWidth }]} />
    </View>
  );
};

const progressBarStyles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: 'transparent',
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  filled: {
    backgroundColor: '#00bf63',
    height: '100%',
    position: 'absolute',
    left: 0,
  },
  unfilled: {
    backgroundColor: '#eeeeee',
    height: '100%',
    position: 'absolute',
  },
});

interface ModuleCardProps {
  title: string,
  subTitle: string,
  userPoints?: number,
  pointsCount: number,
  onPress?: () => void;
  locked?: boolean;
  available?: boolean;
}

export default function ModuleCard({ title, subTitle, pointsCount, onPress, locked, userPoints = 0, available = true }: ModuleCardProps) {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && !locked && { borderColor: '#006dff' }]}
      onPress={locked ? () => { } : !available ? () => { router.push(`/(freeRoutes)/home/courseUnavailable/${title}`) } : onPress}
    >
      <View style={{ flex: 3 / 7 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{title}</Text>
        <Text style={{ fontSize: 11, color: '#a6a6a6', marginTop: 8 }}>{subTitle}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 4 / 7 }}>
        <Text style={{ fontSize: 11, color: '#a6a6a6', alignSelf: 'flex-end' }}>{pointsCount} points</Text>
        {
          !locked ? (
            userPoints > 0 ? <ProgressBar percent={userPoints / pointsCount * 100} /> :
              <Text style={{ fontSize: 11, color: '#00bf63', alignSelf: 'flex-end' }}>{available ? 'Start Now' : 'Available Soon'}</Text>
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
