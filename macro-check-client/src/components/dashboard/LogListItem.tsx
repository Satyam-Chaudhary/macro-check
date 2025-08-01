import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, List, IconButton, useTheme ,ActivityIndicator} from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { Log } from '@/schemas/analytics'; 
import { AppTheme } from '@/theme/theme';

type LogListItemProps = {
  log: Log;
  onDelete: (log: Log) => void;
  isDeleting?: Boolean;
};

export const LogListItem = ({ log, onDelete, isDeleting = false}: LogListItemProps) => {
  const theme = useTheme<AppTheme>();
  

 const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    return (
      <View style={[styles.deleteAction, { borderTopRightRadius: 20, borderBottomRightRadius: 20 }]}>
        {isDeleting ? (
          <ActivityIndicator animating={true} color={theme.colors.onError} />
        ) : (
          <IconButton
            icon="delete"
            iconColor={theme.colors.onError}
            containerColor={theme.colors.error}
            size={24}
            onPress={() => onDelete(log)}
          />
        )}
      </View>
    );
  };

  return (
    <View style={[{ backgroundColor: theme.colors.tertiarySurface }, styles.logContainer]}>
    <Swipeable renderRightActions={renderRightActions}>
      <List.Item
        title={log.description}
        description={log.meal_type}
        right={() => (
          <View style={styles.calorieContainer}>
            <Text style={styles.calorieText}>{log.calories.toFixed(0)} kcal</Text>
          </View>
        )}
      />
    </Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
    logContainer:{
        marginHorizontal: 3,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 1,
    },
  deleteAction: {
    backgroundColor: '#E57373',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,

  },
  calorieText: {
    alignSelf: 'center',
    marginRight: 0,
    marginLeft: 5,
  },
  calorieContainer: {
    justifyContent: 'center', 
    paddingRight: 0,
  },
});