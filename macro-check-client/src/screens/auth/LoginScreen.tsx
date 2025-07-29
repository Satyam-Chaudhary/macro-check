import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import { supabase } from '@/lib/supabase';
import { useSessionStore } from '@/store/useSessionStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const navigation = useNavigation();
  const setSession = useSessionStore((state) => state.setSession);
  const theme = useTheme();

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Login Error', error.message);
    } else if (data.session) {
      setSession(data.session);
    }
    setLoading(false);
  };
  
  const handleGoogleSignIn = async () => {
    Alert.alert('Coming Soon!', 'Google Sign-In will be added shortly.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LottieView
        source={require('@/assets/animations/login-animation.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text variant="headlineLarge" style={styles.title}>
        Welcome Back
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Sign in to continue your journey.
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={loading}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry={!isPasswordVisible} // Toggle based on state
        disabled={loading}
        // 2. Show/Hide Password Icon
        right={
          <TextInput.Icon
            icon={isPasswordVisible ? 'eye-off' : 'eye'}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        }
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        loading={loading}
        disabled={loading}
      >
        Login
      </Button>
      <Button
        icon="google"
        mode="outlined"
        onPress={handleGoogleSignIn}
        style={styles.button}
        disabled={loading}
      >
        Sign in with Google
      </Button>
      <Button 
        onPress={() => navigation.navigate('SignUp' as never)} 
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        Don't have an account? Sign Up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  lottie: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    paddingVertical: 4,
  },
  buttonLabel: {
    fontSize: 16,
  },
});