import React, { useState, forwardRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useGoals } from '@/hooks/useGoals';
import { useDashboard } from '@/context/DashboardContext';
import { format } from 'date-fns';


export type SetGoalSheetRef = {
  present: () => void;
};

export const SetGoalScreen = forwardRef<SetGoalSheetRef>((props, ref) => {
  const theme = useTheme();
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['70%'], []);
  const { selectedDate } = useDashboard();

  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const { setGoal, isLoading } = useGoals(() => {
    bottomSheetModalRef.current?.dismiss();
  });

  React.useImperativeHandle(ref, () => ({
    present: () => bottomSheetModalRef.current?.present(),
  }));

  const handleSaveGoal = () => {
    setGoal({
      date: format(selectedDate, 'yyyy-MM-dd'),
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat),
    });
  };


  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.onSurfaceVariant }}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        <Text variant="headlineSmall" style={styles.title}>Set Goal for {format(selectedDate, 'do MMMM')}</Text>
        <TextInput label="Calories" value={calories} onChangeText={setCalories} style={styles.input} keyboardType="numeric" disabled={isLoading} />
        <TextInput label="Protein (g)" value={protein} onChangeText={setProtein} style={styles.input} keyboardType="numeric" disabled={isLoading} />
        <TextInput label="Carbs (g)" value={carbs} onChangeText={setCarbs} style={styles.input} keyboardType="numeric" disabled={isLoading} />
        <TextInput label="Fat (g)" value={fat} onChangeText={setFat} style={styles.input} keyboardType="numeric" disabled={isLoading} />
        <Button mode="contained" style={{ marginTop: 10 }} onPress={handleSaveGoal} loading={isLoading} disabled={isLoading}>
          Save Goal
        </Button>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: { padding: 20, paddingBottom: 270 },
  title: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 10 },
});