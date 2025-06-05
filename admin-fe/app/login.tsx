import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { loginAdmin } from "@/src/api/admin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { AlertCircleIcon, CheckIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useGlobalModal } from "../context/ModalContext";

export default function LoginScreen() {
  const router = useRouter();
  const { showModal, hideModal, showLoading, hideLoading, isLoading } =
    useGlobalModal();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    setUsernameError("");
    setPasswordError("");

    let isValid = true;

    if (!username) {
      setUsernameError("Username is required.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 5) {
      setPasswordError("Password must be at least 5 characters long.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    showLoading("Authenticating...");

    try {
      const result = await loginAdmin(username, password);

      if (result.success) {
        showModal({
          title: "Login Success!",
          message: result.message || "You have successfully logged in.",
          type: "success",
          autoClose: true,
          duration: 1500,
        });

        if (rememberMe) {
          await AsyncStorage.setItem("is_logged_in", "true");
        } else {
          await AsyncStorage.removeItem("is_logged_in");
        }
        setIsLoggedIn(true);
      } else {
        showModal({
          title: "Login Failed!",
          message: result.message || "Invalid credentials. Please try again.",
          type: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.error("Login API call failed:", error);
      showModal({
        title: "Error!",
        message: "An unexpected error occurred. Please try again.",
        type: "error",
        confirmButtonText: "OK",
      });
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    const checkRememberMeStatus = async () => {
      const storedRememberMe = await AsyncStorage.getItem("is_logged_in");
      if (storedRememberMe === "true") {
        setRememberMe(true);
      }
    };
    checkRememberMeStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const navTimer = setTimeout(() => {
        router.replace("/");
      }, 1800);
      return () => clearTimeout(navTimer);
    }
  }, [isLoggedIn, router]);
  const mainBackgroundClass = 'bg-white dark:bg-neutral-900';
  const cardBackgroundClass = 'bg-neutral-100 dark:bg-neutral-800';
  const headingTextColorClass = 'text-neutral-900 dark:text-white';
  const subtitleTextColorClass = 'text-neutral-600 dark:text-neutral-400';
  const labelTextColorClass = 'text-neutral-800 dark:text-white';
  const inputFieldClass = 'text-neutral-900 placeholder-neutral-500 border-neutral-400 dark:text-white dark:placeholder-neutral-500 dark:border-neutral-700';
  const helperTextColorClass = 'text-neutral-600 dark:text-neutral-400';
  const checkboxIndicatorClass = 'bg-neutral-300 border-neutral-500 group-hover:bg-neutral-400 group-active:bg-neutral-400 dark:bg-neutral-700 dark:border-neutral-500 dark:group-hover:bg-neutral-600 dark:group-active:bg-neutral-600';
  const checkboxLabelClass = 'text-neutral-700 group-hover:text-neutral-900 group-active:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-neutral-200 dark:group-active:text-neutral-200';
  const linkTextColorClass = 'text-blue-700 dark:text-blue-500';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={`flex-1 ${mainBackgroundClass}`}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box className="items-center mb-6 mt-12">
          <Image
            source={require("@/assets/images/logo.png")}
            alt="App Logo"
            className="w-20 h-20 mb-4"
          />
        </Box>

        <Box
          className={`
            ${cardBackgroundClass}
            rounded-xl
            p-6
            shadow-lg
            w-11/12
            max-w-md
            mb-12
          `}
        >
          {/* Header Card */}
          <Box className="items-center mb-6">
            <Heading className={`${headingTextColorClass} text-3xl font-bold mb-2`}>Login</Heading>
            <Text className={`${subtitleTextColorClass} text-base text-center`}>
              Welcome back! Please login to your account.
            </Text>
          </Box>

          <VStack space="xl" className="w-full">
            {/* Form Input Username */}
            <FormControl isInvalid={!!usernameError} isRequired={true}>
              <FormControlLabel>
                <FormControlLabelText className={`${labelTextColorClass} text-sm font-medium`}>
                  Username
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" size="md" isDisabled={isLoading}>
                <InputField
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChangeText={setUsername}
                  className={`${inputFieldClass}`}
                  keyboardType="default"
                  autoCapitalize="none"
                />
              </Input>
              {usernameError && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText className="text-red-500 text-xs ml-1">
                    {usernameError}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Form Input Password */}
            <FormControl isInvalid={!!passwordError} isRequired={true}>
              <FormControlLabel>
                <FormControlLabelText className={`${labelTextColorClass} text-sm font-medium`}>
                  Password
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" size="md" isDisabled={isLoading}>
                <InputField
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  className={`${inputFieldClass}`}
                  secureTextEntry={true}
                />
              </Input>
              {passwordError && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText className="text-red-500 text-xs ml-1">
                    {passwordError}
                  </FormControlErrorText>
                </FormControlError>
              )}
              <FormControlHelper>
                <FormControlHelperText className={`${helperTextColorClass} text-xs`}>
                  Must be at least 5 characters.
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>

            {/* Checkbox Remember Me */}
            <Box className="flex-row justify-between items-center w-full group">
              <Checkbox
                value="rememberMe"
                aria-label="Remember Me Checkbox"
                isChecked={rememberMe}
                onChange={setRememberMe}
                size="md"
              >
                <CheckboxIndicator className={`${checkboxIndicatorClass} mr-2`}>
                  <CheckboxIcon as={CheckIcon} className="text-blue-500" />
                </CheckboxIndicator>
                <CheckboxLabel className={`${checkboxLabelClass}`}>
                  Remember Me
                </CheckboxLabel>
              </Checkbox>
            </Box>

            {/* Tombol Login */}
            <Button
              size="md"
              variant="solid"
              action="primary"
              isDisabled={isLoading}
              onPress={handleLogin}
              className="bg-blue-600 active:bg-blue-700 hover:bg-blue-500 mt-4"
            >
              <ButtonText className="text-white text-base font-semibold">
                {isLoading ? "Logging in..." : "Login"}
              </ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}