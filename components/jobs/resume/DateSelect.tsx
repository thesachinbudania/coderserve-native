import { Image, Pressable, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import PopUp from '@/components/messsages/PopUp';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import { MonthPicker, YearPicker } from '@/components/form/DatePicker';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => {
  return `${currentYear - i}`;
})

export default function DateSelect({ placeholder, presentOption = false, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }: { placeholder: string, presentOption?: boolean, selectedMonth: string, selectedYear: string, setSelectedMonth: any, setSelectedYear: any }) {
  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<string>(selectedMonth);
  const [currentYear, setCurrentYear] = React.useState<string>(selectedYear);
  const monthsList = presentOption ? ['--', '--', 'Present'].concat(months) : ['--', '--'].concat(months);
  const yearsList = presentOption ? ['--', '--', '--', 'Present'].concat(years) : ['--', '--', '--'].concat(years);

  const setDate = () => {
    if (currentMonth != '--' && currentYear != '--') {
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear);
    } else {
      setSelectedMonth('');
      setSelectedYear('');
    }
  }

  return (
    <>
      <Pressable onPress={() => {
        Haptics.selectionAsync();
        setPopUpVisible(true);
      }
      }>
        {({ pressed }) => (
          <View style={[styles.menuBox, pressed && { borderColor: '#006dff' }]}>
            <Text style={[styles.boxText, selectedMonth && selectedYear && { color: 'black' }]}>{selectedMonth && selectedYear ? (selectedMonth === 'Present' || selectedYear === 'Present' ? 'Present' : selectedMonth + ' ' + selectedYear) : placeholder}</Text>
            <Image source={pressed ? require('@/components/form/assets/downArrowBlue.png') : require('@/components/form/assets/downArrowBlack.png')} style={styles.downArrow} />
          </View>
        )}
      </Pressable>
      <PopUp
        visible={popUpVisible}
        setVisible={setPopUpVisible}
      >
        <View style={styles.popUpContainer}
        >
          <View style={{ flex: 1 / 2, }}>
            <MonthPicker
              items={monthsList.map((item) => ({ label: item, value: item }))}
              selectedValue={currentMonth}
              onValueChange={(item) => {
                setCurrentMonth(item);
              }}
            />
          </View>
          <View style={{ flex: 1 / 2 }}>
            <YearPicker
              items={yearsList.map((item) => ({ label: item, value: item }))}
              selectedValue={currentYear}
              onValueChange={(item) => {
                setCurrentYear(item);
              }}
            />
          </View>
        </View>
        <BlueButton
          title='Save'
          onPress={() => {
            setDate();
            setPopUpVisible(false);
          }}
          disabled={(currentMonth === selectedMonth && currentYear === selectedYear) || !currentMonth || !currentYear || currentMonth === '--' || currentYear === '--' || (currentMonth === 'Present' && currentYear != 'Present') || (currentYear === 'Present' && currentMonth != 'Present')}
        />
      </PopUp>
    </>
  )
}



const styles = StyleSheet.create({
  menuBox: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
  },
  boxText: {
    fontSize: 15,
    color: '#cfdbe6',
    paddingLeft: 12,
  },
  downArrow: {
    height: 16,
    width: 16,
    marginRight: 12,
  },
  popUpContainer: {
    gap: 16,
    flexDirection: 'row',
    marginBottom: 96,
  },

  selectedText: {
    fontSize: 18,
    color: '#000',
  },
  unselectedText: {
    fontSize: 16,
    color: '#999',
  },

});

