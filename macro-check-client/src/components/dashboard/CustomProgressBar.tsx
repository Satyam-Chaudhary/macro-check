import React from 'react';
import { View, StyleSheet } from 'react-native';

type CustomProgressBarProps = {
  progress: number;
  color: string;
  trackColor: string;
};

export const CustomProgressBar = ({ progress, color, trackColor }: CustomProgressBarProps) => {
  const cappedProgress = Math.min(1, progress);
  return (
    <View style={[styles.progressBarTrack, { backgroundColor: trackColor }]}>
      <View style={[styles.progressBarFill, { backgroundColor: color, width: `${(cappedProgress * 100)}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarTrack: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});