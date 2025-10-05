import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import WheelPicker from 'react-native-wheel-picker-expo';

const ITEM_HEIGHT = 50;

const { width: screenWidth } = Dimensions.get('window');

// --- Type Definition for a single date item ---
type DatePickerItem = {
  label: string;
  value: string; // ISO Date String
};

// --- Helper Function to Generate Date Items ---
const generateDateItems = (daysRange: number): DatePickerItem[] => {
  const items: DatePickerItem[] = [];
  const today = new Date();
  // Normalize to the start of the day in UTC to prevent timezone issues.
  today.setUTCHours(0, 0, 0, 0);

  for (let i = -daysRange; i <= daysRange; i++) {
    const date = new Date(today.getTime());
    date.setUTCDate(today.getUTCDate() + i);

    let label = '';
    if (i === 0) {
      label = 'Today';
    } else if (i === 1) {
      label = 'Tomorrow';
    } else {
      label = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }

    items.push({
      value: date.toISOString(),
      label: label,
    });
  }
  return items;
};

// --- Component Props Interface ---
interface CustomDatePickerProps {
  /** The currently selected date value as an ISO string. */
  selectedValue: string;
  /** Callback function called when the user selects a new date. */
  onValueChange: (value: string) => void;
  /** Optional number of days to show before and after today. Defaults to 365. */
  daysRange?: number;
}

// --- The Date Picker Component ---
export const DateSelectorStreak: React.FC<CustomDatePickerProps> = ({
  selectedValue,
  onValueChange,
  daysRange = 182,
}) => {
  const items = useMemo(() => generateDateItems(daysRange), [daysRange]);

  // The wheel picker requires an array of strings for its items.
  const dataSource = useMemo(() => items.map(item => item.label), [items]);

  const getInitialIndex = (): number => {
    try {
      const selectedDate = new Date(selectedValue);
      selectedDate.setUTCHours(0, 0, 0, 0);
      const normalizedSelectedValue = selectedDate.toISOString();
      const index = items.findIndex(item => item.value === normalizedSelectedValue);
      return index !== -1 ? index : items.findIndex(item => item.label === 'Today') ?? 0;
    } catch {
      return items.findIndex(item => item.label === 'Today') ?? 0;
    }
  };

  const initialSelectedIndex = getInitialIndex();
  return (
    <View style={{ marginBottom: 32, paddingHorizontal: 128, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eeeeee', borderRadius: 12, overflow: 'hidden', paddingBottom: -32 }}>
      <WheelPicker
        items={items}
        initialSelectedIndex={initialSelectedIndex !== -1 ? initialSelectedIndex : 2}
        width={screenWidth - 160}
        onChange={({ item }) => onValueChange(item.value)}
        selectedStyle={datePickerStyles.selectedIndicator}
        renderItem={(item) => (
          <Text
            style={[
              datePickerStyles.elementTextStyle,
              datePickerStyles.itemText,
            ]}
          >
            {item.label}
          </Text>
        )}
        haptics
      />
    </View>
  );

};
const datePickerStyles = StyleSheet.create({
  selectedLayoutStyle: {
    backgroundColor: 'white',
    borderColor: '#eeeeee',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  containerStyle: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  elementTextStyle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  itemText: {
    height: ITEM_HEIGHT,
    lineHeight: ITEM_HEIGHT,
    textAlign: 'center',
  },
  selectedIndicator: {
    borderWidth: 1,
    borderColor: '#eeeeee',
    fontWeight: 'bold',
  },
})

