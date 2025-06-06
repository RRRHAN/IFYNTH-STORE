import { useGlobalModal } from "@/context/ModalContext";
import { changePassword } from "@/src/api/admin";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { ArrowLeft, Lock } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export default function SecurityScreen() {
  const router = useRouter();
  const { showModal } = useGlobalModal();
  const { colorScheme } = useColorScheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showModal({
        title: "Update password failed!",
        message: "Please fill all password fields.",
        type: "error",
        autoClose: true,
        duration: 1500,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showModal({
        title: "Update password failed!",
        message: "New password and confirm password do not match.",
        type: "error",
        autoClose: true,
        duration: 1500,
      });
      return;
    }
    const result = await changePassword(
      currentPassword,
      newPassword,
      confirmPassword
    );

    if (result.success) {
      showModal({
        title: "Password Updated Successfully!",
        message: result.message || "You have successfully updated your password.",
        type: "success",
        autoClose: true,
        duration: 1500,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      showModal({
        title: "Password Update Failed!",
        message: result.message || "Invalid current password or something went wrong.",
        type: "error",
        autoClose: true,
        duration: 1500,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const textColorClass = colorScheme === "dark" ? "text-white" : "text-gray-900";
  const labelColorClass = colorScheme === "dark" ? "text-gray-300" : "text-gray-700";
  const inputBorderClass = colorScheme === "dark" ? "border-gray-700" : "border-gray-300";
  const inputBgClass = colorScheme === "dark" ? "bg-neutral-800" : "bg-white";
  const mainBgClass = colorScheme === "dark" ? "bg-neutral-900" : "bg-gray-100";


  return (
    <Box className={`flex-1 p-5 items-center ${mainBgClass}`}>
      <Box
        className="w-full max-w-sm flex-row justify-start"
        style={{
          position: Platform.OS === "web" ? "relative" : "absolute",
          top: Platform.OS === "web" ? 0 : 40,
          left: Platform.OS === "web" ? 0 : 20,
          zIndex: 10,
        }}
      >
        <Button
          variant="link"
          action="secondary"
          onPress={() => router.replace("/setting")}
          className="p-0"
        >
          <ButtonIcon
            as={ArrowLeft}
            size="lg"
            className={`${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          />
        </Button>
      </Box>
      <Box
        className={`w-full max-w-sm p-5 rounded-lg shadow-md border ${inputBorderClass} ${inputBgClass}`}
        style={{
          marginTop: Platform.OS === "web" ? 0 : 100,
        }}
      >
        <Heading size="xl" className={`mb-5 text-center ${textColorClass}`}>
          Security Settings
        </Heading>

        <Text className={`mt-2 mb-1 ${labelColorClass}`}>Current Password</Text>
        <Input
          variant="outline"
          size="md"
          className={`w-full ${inputBorderClass} ${inputBgClass}`}
        >
          <InputField
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="Enter current password"
            className={`${textColorClass}`}
          />
        </Input>

        <Text className={`mt-4 mb-1 ${labelColorClass}`}>New Password</Text>
        <Input
          variant="outline"
          size="md"
          className={`w-full ${inputBorderClass} ${inputBgClass}`}
        >
          <InputField
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Enter new password"
            className={`${textColorClass}`}
          />
        </Input>

        <Text className={`mt-4 mb-1 ${labelColorClass}`}>Confirm New Password</Text>
        <Input
          variant="outline"
          size="md"
          className={`w-full ${inputBorderClass} ${inputBgClass}`}
        >
          <InputField
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirm new password"
            className={`${textColorClass}`}
          />
        </Input>

        <Button
          action="primary"
          onPress={handleChangePassword}
          className="mt-6 py-2 rounded-lg flex-row items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        >
          <ButtonIcon as={Lock} size="md" className="mr-2 text-white" />
          <ButtonText className="text-white text-base font-semibold">
            Change Password
          </ButtonText>
        </Button>
      </Box>
    </Box>
  );
}