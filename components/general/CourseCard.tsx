import React from "react";
import { Pressable, Text, View, Image, StyleSheet } from "react-native";

const CourseCard = ({ name, time, onPress = () => { }, available = true }: { name: string, onPress?: () => void, time: string, available?: boolean }) => {
  return (
    <Pressable
      style={({ pressed }) => [courseCardStyles.container, pressed && { borderColor: '#006dff' }]}
      onPress={onPress}
    >
      <View style={courseCardStyles.logoContainer}>
        <Image source={require('@/assets/images/jobs/otherCertifications.png')} style={courseCardStyles.logo} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ fontSize: 15 }}>{name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Image source={require('@/assets/images/home/time.png')} style={{ width: 12, height: 12 }} />
            <Text style={{ fontSize: 11, color: '#a6a6a6' }}>{time}</Text>
          </View>
          <Text style={{ fontSize: 11, color: '#00bf53' }}>{available ? 'Start now' : 'Available Soon'}</Text>
        </View>
      </View>
    </Pressable>
  )
}

const courseCardStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#f5f5f5',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  logoContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  logo: {
    width: 32,
    height: 32,
  }
})

export default CourseCard;
