import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';  // Pastikan kamu mengimpor hook ini

interface ModalProps {
  visible: boolean;
  hideModal: () => void;
  message: string;
}

const ModalComponent: React.FC<ModalProps> = ({ visible, hideModal, message }) => {
  const colorScheme = useColorScheme();  // Mengambil nilai tema (dark atau light)

  // Menentukan warna berdasarkan tema
  const modalBackgroundColor = colorScheme === 'dark' ? '#333333' : '#ffffff';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#333333';
  const buttonColor = colorScheme === 'dark' ? '#3b82f6' : '#2563eb';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={hideModal}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)' }]}>
        <View style={[styles.modalContainer, { backgroundColor: modalBackgroundColor }]}>
          <Text style={[styles.modalText, { color: textColor }]}>{message}</Text>
          <Button 
            title="Close" 
            onPress={hideModal} 
            color={buttonColor}  // Menggunakan warna tombol berdasarkan tema
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',  // Default opacity background for light mode
  },
  modalContainer: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
  },
});

export default ModalComponent;
