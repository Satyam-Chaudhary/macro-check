import React, { useState, forwardRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  useTheme,
  RadioButton,
} from 'react-native-paper';
import {
  BottomSheetModal,
  BottomSheetScrollView, // 1. Import BottomSheetScrollView
} from '@gorhom/bottom-sheet';
import { AppTheme } from '@/theme/theme';

export type LogSheetRef = {
  present: () => void;
};

export const LogScreen = forwardRef<LogSheetRef>((props, ref) => {
  const theme = useTheme<AppTheme>();
  const [mode, setMode] = useState('ai');
  const [mealType, setMealType] = useState('Breakfast');
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['65%', '80%'], []);

  React.useImperativeHandle(ref, () => ({
    present: () => bottomSheetModalRef.current?.present(),
  }));

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.onSurfaceVariant,
      }}
    >
      
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        <Text variant="headlineSmall" style={styles.title}>
          Add Food Log
        </Text>
        <SegmentedButtons
          value={mode}
          onValueChange={setMode}
          buttons={[
            { value: 'ai', label: 'AI Log', icon: 'robot-outline' },
            { value: 'manual', label: 'Manual Log', icon: 'pencil-outline' },
          ]}
          style={{ marginBottom: 20 }}
        />

        {mode === 'ai' ? (
          <View>
            <TextInput
              label="Describe your meal..."
              multiline
              numberOfLines={4}
              style={{ marginBottom: 10, minHeight: 100 }}
            />
            <Button mode="contained">Log with AI</Button>
          </View>
        ) : (
          <View>
            <TextInput label="Description" style={styles.input} />

            
            <View style={[styles.radioContainer, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Text style={styles.radioLabel}>Meal Type</Text>
              <RadioButton.Group onValueChange={newValue => setMealType(newValue)} value={mealType}>
                <View style={styles.radioGroup}>
                  <View style={styles.radioButtonItem}>
                    <RadioButton value="Breakfast" />
                    <Text>Breakfast</Text>
                  </View>
                  <View style={styles.radioButtonItem}>
                    <RadioButton value="Lunch" />
                    <Text>Lunch</Text>
                  </View>
                  <View style={styles.radioButtonItem}>
                    <RadioButton value="Dinner" />
                    <Text>Dinner</Text>
                  </View>
                  <View style={styles.radioButtonItem}>
                    <RadioButton value="Snack" />
                    <Text>Snack</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            <TextInput label="Calories" style={styles.input} keyboardType="numeric" />
            <TextInput label="Protein (g)" style={styles.input} keyboardType="numeric" />
            <TextInput label="Carbs (g)" style={styles.input} keyboardType="numeric" />
            <TextInput label="Fat (g)" style={styles.input} keyboardType="numeric" />
            <Button mode="contained" style={{ marginTop: 10 }}>Log Manually</Button>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    paddingBottom: 250, 
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  radioContainer: {
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#888', 
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});