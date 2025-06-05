import { useGlobalModal } from "@/context/ModalContext";
import { changePassword } from "@/src/api/admin";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native"; // Hanya Platform yang diperlukan dari react-native

// Gluestack UI components
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

// Icons from Lucide (lebih modern dari FontAwesome di Gluestack)
import { ArrowLeft, Lock } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export default function SecurityScreen() {
  const router = useRouter();
  const { showModal } = useGlobalModal();
  const { colorScheme } = useColorScheme(); // Ambil skema warna
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [visible, setVisible] = useState(false); // Tidak digunakan di kode yang diberikan
  // const [errorMessage, setErrorMessage] = useState(""); // Dikelola oleh useGlobalModal
  // const [successMessage, setSuccessMessage] = useState(""); // Dikelola oleh useGlobalModal

  const handleChangePassword = async () => {
    // Validasi input
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

    // Panggil API
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
      // Reset form
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
      // Reset form (opsional, tergantung UX yang diinginkan)
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // Helper untuk kelas warna berdasarkan tema
  const textColorClass = colorScheme === "dark" ? "text-white" : "text-gray-900";
  const labelColorClass = colorScheme === "dark" ? "text-gray-300" : "text-gray-700";
  const inputBorderClass = colorScheme === "dark" ? "border-gray-700" : "border-gray-300";
  const inputBgClass = colorScheme === "dark" ? "bg-neutral-800" : "bg-white";
  const mainBgClass = colorScheme === "dark" ? "bg-neutral-900" : "bg-gray-100";


  return (
    <Box className={`flex-1 p-5 items-center ${mainBgClass}`}>
      {/* Tombol Kembali (BackButton) */}
      <Box
        className="w-full max-w-sm flex-row justify-start"
        style={{
          // Sesuaikan posisi tombol kembali, terutama untuk platform web
          // Atau gunakan Header dari Expo Router untuk posisi otomatis
          position: Platform.OS === "web" ? "relative" : "absolute",
          top: Platform.OS === "web" ? 0 : 40, // Top for non-web, adjust as needed for safe area
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
            size="lg" // Sesuaikan ukuran ikon Gluestack
            className={`${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          />
        </Button>
      </Box>

      {/* Konten Utama dalam Card */}
      <Box
        className={`w-full max-w-sm p-5 rounded-lg shadow-md border ${inputBorderClass} ${inputBgClass}`}
        style={{
          // Berikan sedikit margin top agar tidak tertutup tombol kembali di mobile/native
          marginTop: Platform.OS === "web" ? 0 : 100, // Adjust as needed
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
          className="mt-6 py-3 rounded-lg flex-row items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
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