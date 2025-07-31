import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {format} from 'date-fns';

import { useSessionStore } from '@/store/useSessionStore';
import { AppTheme } from '@/theme/theme';

type HeaderProps = {
  selectedDate: Date;
};

export const Header = ({selectedDate}:HeaderProps) => {
  const theme = useTheme<AppTheme>();
  const { theme: currentThemeName, toggleTheme } = useSessionStore();

  return (
    <View style={styles.headerContainer}>
      <View>
        <Text variant="headlineSmall">{format(selectedDate, 'do MMMM')}</Text>
        <Text variant="bodyMedium">{format(selectedDate, 'EEEE')}</Text>
      </View>

      <View style={styles.rightContainer}>
        {/* This TouchableOpacity makes the icon tappable */}
        <TouchableOpacity onPress={toggleTheme} style={styles.iconContainer}>
          <Icon
            name={currentThemeName === 'dark' ? 'weather-night' : 'weather-sunny'}
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <Avatar.Image
          size={40}
          source={require('@/assets/pictures/icon.jpeg')}
          style={{ marginLeft: 15 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 5, // Adds a bit of extra space around the icon to make it easier to tap
  },
});