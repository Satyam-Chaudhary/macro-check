import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

type OnboardingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const theme = useTheme();

  return (
    <ImageBackground
      style={styles.background}
      source={require('@/assets/pictures/OverboardingImage.png')}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        
        <View style={styles.contentContainer}>
          <Text variant="headlineLarge" style={[styles.title, { color: '#FFFFFF' }]}>
            Welcome to Macro-Check
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: '#FFFFFF' }]}>
            Your smart assistant for a healthier lifestyle.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Get Started
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
            labelStyle={{ color: theme.colors.surface }}
          >
            I already have an account
          </Button>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40, 
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 30,
    maxWidth: '90%',
    alignSelf: 'center',
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  buttonLabel: {
    fontSize: 16,
  },
});