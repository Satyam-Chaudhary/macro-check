import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

import { supabase } from '@/lib/supabase';
import { useSessionStore } from '@/store/useSessionStore';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigation = useNavigation();
  const setSession = useSessionStore((state) => state.setSession);
  const theme = useTheme();

  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Signup Error', error.message);
    } else if (data.session) {
      setSession(data.session);
    } else {
      Alert.alert('Signup Success', 'Please check your email for a confirmation link!');
      navigation.navigate('Login' as never);
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LottieView
        source={require('@/assets/animations/signup-animation.json')} 
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text variant="headlineLarge" style={styles.title}>
        Create Account
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Start your new journey with us.
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
        secureTextEntry={!isPasswordVisible}
        disabled={loading}
        right={
          <TextInput.Icon
            icon={isPasswordVisible ? 'eye-off' : 'eye'}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        }
      />
      <Button
        mode="contained"
        onPress={handleSignUp}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        loading={loading}
        disabled={loading}
      >
        Sign Up
      </Button>
      <Button 
        onPress={() => navigation.navigate('Login' as never)} 
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        Already have an account? Login
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