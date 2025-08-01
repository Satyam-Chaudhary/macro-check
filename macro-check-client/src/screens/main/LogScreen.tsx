import React, { useState, forwardRef, useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  useTheme,
  RadioButton,
} from "react-native-paper";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useFoodLogs } from "@/hooks/useFoodLogs";
import { format } from "date-fns";
import { useDashboard } from "@/context/DashboardContext";

export type LogSheetRef = { present: () => void };

export const LogScreen = forwardRef<LogSheetRef>((props, ref) => {
  const theme = useTheme();
  const { selectedDate } = useDashboard();

  const [mode, setMode] = useState("ai");
  const [mealType, setMealType] = useState("Breakfast");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["65%", "90%"], []);

  const resetForm = () => {
    setDescription("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
  };

    const { logManually, isManualLoading, logWithAi, isAiLoading } = useFoodLogs({
    onSuccessCallback: () => {
      bottomSheetModalRef.current?.dismiss();
      resetForm();
    },
  })

  React.useImperativeHandle(ref, () => ({
    present: () => bottomSheetModalRef.current?.present(),
  }));

  const handleManualSubmit = () => {
    logManually({
      date: format(selectedDate, "yyyy-MM-dd"),
      description,
      meal_type: mealType,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat),
    });
  };

  const handleAiSubmit = () => {
    logWithAi({
      date: format(selectedDate, "yyyy-MM-dd"),
      description,
      meal_type: mealType,
    });
  };

  const isLoading = isManualLoading || isAiLoading;

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
            { value: "ai", label: "AI Log", icon: "robot-outline" },
            { value: "manual", label: "Manual Log", icon: "pencil-outline" },
          ]}
          style={{ marginBottom: 20 }}
        />
        {mode === "ai" ? (
          <View>
            <TextInput
              label="Describe your meal..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={{ marginBottom: 10, minHeight: 100 }}
              disabled={isLoading}
            />
            <View
              style={[
                styles.radioContainer,
                { backgroundColor: theme.colors.surfaceDisabled },
              ]}
            >
              <Text style={styles.radioLabel}>Meal Type</Text>
              <RadioButton.Group
                onValueChange={(newValue) => setMealType(newValue)}
                value={mealType}
              >
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
            <Button
              mode="contained"
              onPress={handleAiSubmit}
              loading={isAiLoading}
              disabled={isLoading}
            >
              Log with AI
            </Button>
          </View>
        ) : (
          <View>
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              disabled={isLoading}
            />
            <View
              style={[
                styles.radioContainer,
                { backgroundColor: theme.colors.surfaceDisabled },
              ]}
            >
              <Text style={styles.radioLabel}>Meal Type</Text>
              <RadioButton.Group
                onValueChange={(newValue) => setMealType(newValue)}
                value={mealType}
              >
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
            <TextInput
              label="Calories"
              value={calories}
              onChangeText={setCalories}
              style={styles.input}
              keyboardType="numeric"
              disabled={isLoading}
            />
            <TextInput
              label="Protein (g)"
              value={protein}
              onChangeText={setProtein}
              style={styles.input}
              keyboardType="numeric"
              disabled={isLoading}
            />
            <TextInput
              label="Carbs (g)"
              value={carbs}
              onChangeText={setCarbs}
              style={styles.input}
              keyboardType="numeric"
              disabled={isLoading}
            />
            <TextInput
              label="Fat (g)"
              value={fat}
              onChangeText={setFat}
              style={styles.input}
              keyboardType="numeric"
              disabled={isLoading}
            />
            <Button
              mode="contained"
              style={{ marginTop: 10 }}
              onPress={handleManualSubmit}
              loading={isManualLoading}
              disabled={isLoading}
            >
              Log Manually
            </Button>
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
    textAlign: "center",
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
    color: "#888",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  radioButtonItem: {
    flexDirection: "row",
    alignItems: "center",
  },
});
