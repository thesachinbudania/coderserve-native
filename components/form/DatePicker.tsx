import WheelPicker from 'react-native-wheel-picker-expo';
import { StyleSheet, Text, View } from 'react-native';

interface PickerItem {
  label: string;
  value: string;
}



interface MonthPickerProps {
  items: PickerItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  width?: number;
}


const ITEM_HEIGHT = 45;

export const dates = Array.from({ length: 31 }, (_, i) => {
  if (i < 9) {
    return `0${i + 1}`;
  }
  else {
    return `${i + 1}`;
  }
});

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const currentYear = new Date().getFullYear();
export const years = Array.from({ length: 100 }, (_, i) => {
  return `${currentYear - i}`;
})



export const DatePicker: React.FC<MonthPickerProps> = ({ items, selectedValue, onValueChange, width = null }) => {
  const initialSelectedIndex = items.findIndex(item => item.value === selectedValue);

  return (
    <View style={{ height: ITEM_HEIGHT * 3 }}>
      <WheelPicker
        items={items}
        initialSelectedIndex={initialSelectedIndex !== -1 ? initialSelectedIndex : 2}
        onChange={({ item }) => onValueChange(item.value)}
        {...width ? { width } : {}}
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
}

export const MonthPicker: React.FC<MonthPickerProps> = ({ items, selectedValue, onValueChange, width = null }) => {
  const initialSelectedIndex = items.findIndex(item => item.value === selectedValue);

  return (
    <View style={{ height: ITEM_HEIGHT * 3 }}>
      <WheelPicker
        items={items}
        initialSelectedIndex={initialSelectedIndex !== -1 ? initialSelectedIndex : 2}
        onChange={({ item }) => onValueChange(item.value)}
        selectedStyle={datePickerStyles.selectedIndicator}
        {...width ? { width } : {}}
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

export const YearPicker: React.FC<MonthPickerProps> = ({ items, width = null, selectedValue, onValueChange }) => {
  const initialSelectedIndex = items.findIndex(item => item.value === selectedValue);

  return (
    <View style={{ height: ITEM_HEIGHT * 3 }}>
      <WheelPicker
        items={items}
        initialSelectedIndex={initialSelectedIndex !== -1 ? initialSelectedIndex : 2}
        onChange={({ item }) => onValueChange(item.value)}
        selectedStyle={datePickerStyles.selectedIndicator}
        {...width ? { width } : {}}
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
}

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
