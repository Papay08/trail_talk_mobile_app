import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/colors';
import { fonts } from '../styles/fonts';

export default function SignUpScreen({ route, navigation }) {
  const { role } = route.params;
  
  const [formData, setFormData] = useState({
    role: role,
    studentId: '',
    schoolEmail: '',
    age: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    studentId: '',
    schoolEmail: '',
    age: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateField = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'studentId':
        if (!value.trim()) {
          error = `${role === 'student' ? 'Student ID' : 'Faculty ID'} is required`;
        }
        break;
      
      case 'schoolEmail':
        if (!value.trim()) {
          error = 'School email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      
      case 'age':
        if (!value.trim()) {
          error = 'Age is required';
        } else if (parseInt(value) < 15 || parseInt(value) > 100) {
          error = 'Age must be at least 15 years old';
        }
        break;
      
      case 'password':
        if (!value.trim()) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      
      case 'confirmPassword':
        if (!value.trim()) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      
      default:
        break;
    }
    
    return error;
  };

  const handleFieldChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    setFormData(prev => ({
      ...prev,
      [field]: field === 'age' ? value.replace(/[^0-9]/g, '') : value
    }));
  };

  const handleFieldBlur = (field, value) => {
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {
      studentId: validateField('studentId', formData.studentId),
      schoolEmail: validateField('schoolEmail', formData.schoolEmail),
      age: validateField('age', formData.age),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword)
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form before submitting.');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.schoolEmail,
        password: formData.password,
        options: {
          data: {
            role: formData.role,
            student_id: formData.studentId,
            age: parseInt(formData.age)
          }
        }
      });

      if (error) {
        Alert.alert('Sign Up Failed', error.message);
        return;
      }

      if (data.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              role: formData.role,
              student_id: formData.studentId,
              age: parseInt(formData.age),
              email: formData.schoolEmail
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          Alert.alert('Error', 'Account created but profile setup failed');
          return;
        }
      }

      Alert.alert(
        'Success!', 
        'Your account has been created successfully! Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SignIn')
          }
        ]
      );

    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header with better spacing */}
            <View style={styles.header}>
              <Image 
                source={require('../../assets/signing_signup_icons/trail_talk_logo.png')}
                style={styles.logo}
              />
              <Text style={styles.title}>Sign Up as {role === 'student' ? 'Student' : 'Faculty'}</Text>
              <Text style={styles.subtitle}>Create your account to get started</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {role === 'student' ? 'Student ID' : 'Faculty ID'}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.studentId && styles.inputError
                  ]}
                  placeholder={`Enter your ${role === 'student' ? 'student' : 'faculty'} ID`}
                  placeholderTextColor="#A0A3BD"
                  value={formData.studentId}
                  onChangeText={(text) => handleFieldChange('studentId', text)}
                  onBlur={() => handleFieldBlur('studentId', formData.studentId)}
                  editable={!loading}
                />
                {errors.studentId ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{errors.studentId}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>School Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.schoolEmail && styles.inputError
                  ]}
                  placeholder="Enter your school email"
                  placeholderTextColor="#A0A3BD"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.schoolEmail}
                  onChangeText={(text) => handleFieldChange('schoolEmail', text)}
                  onBlur={() => handleFieldBlur('schoolEmail', formData.schoolEmail)}
                  editable={!loading}
                />
                {errors.schoolEmail ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{errors.schoolEmail}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.age && styles.inputError
                  ]}
                  placeholder="Enter your age"
                  placeholderTextColor="#A0A3BD"
                  keyboardType="numeric"
                  value={formData.age}
                  onChangeText={(text) => handleFieldChange('age', text)}
                  onBlur={() => handleFieldBlur('age', formData.age)}
                  editable={!loading}
                  maxLength={3}
                />
                {errors.age ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{errors.age}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      errors.password && styles.inputError
                    ]}
                    placeholder="Create a password"
                    placeholderTextColor="#A0A3BD"
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(text) => handleFieldChange('password', text)}
                    onBlur={() => handleFieldBlur('password', formData.password)}
                    editable={!loading}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={24} 
                      color="#A0A3BD" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{errors.password}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      errors.confirmPassword && styles.inputError
                    ]}
                    placeholder="Confirm your password"
                    placeholderTextColor="#A0A3BD"
                    secureTextEntry={!showConfirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleFieldChange('confirmPassword', text)}
                    onBlur={() => handleFieldBlur('confirmPassword', formData.confirmPassword)}
                    editable={!loading}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={24} 
                      color="#A0A3BD" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.signUpButton, loading && styles.buttonDisabled]} 
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.signUpButtonText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30, // Added top padding
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40, // Increased spacing
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: colors.black,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    fontFamily: fonts.normal,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.medium,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.normal,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%', // Fixed width
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%', // Fixed width container
  },
  passwordInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    paddingRight: 50, // Space for eye icon
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.normal,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%', // Fixed width
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: fonts.normal,
    marginLeft: 6,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: colors.gray,
    shadowOpacity: 0,
    elevation: 0,
  },
  signUpButtonText: {
    color: colors.white,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: fonts.medium,
  },
  cancelButton: {
    backgroundColor: '#8E2929',
    borderRadius: 12,
    padding: 18,
    width: '100%',
    marginTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: fonts.medium,
  },
});