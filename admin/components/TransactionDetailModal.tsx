import React, { useState } from "react";
import { Modal, View, Button, Image, TouchableOpacity } from "react-native";
import { Transaction } from "@/app/types/transaction";
import { ThemedText } from "./ThemedText";
import ParallaxScrollView from "./ParallaxScrollView";
import styles from "@/app/styles/transactionDetailStyles";
import { formatDate } from "@/hooks/helpers/formatDate";

type Props = {
  transaction: Transaction;
  visible: boolean;
  onClose: () => void;
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <ThemedText style={styles.subHeader}>{title}</ThemedText>
    {children}
  </View>
);

const TransactionDetailModal: React.FC<Props> = ({
  transaction,
  visible,
  onClose,
}) => {
  const [fullImageVisible, setFullImageVisible] = useState(false);

  if (!transaction) return null;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
        transparent
      >
        <View style={styles.modalOverlay}>
          <ParallaxScrollView
            headerBackgroundColor={{ light: "white", dark: "black" }}
            contentContainerStyle={{
              backgroundColor: "gray",
              padding: 20,
            }}
          >
            <ThemedText style={styles.title}>Transaction Details</ThemedText>

            <Section title="Basic Info">
              <ThemedText>ID: {transaction.ID}</ThemedText>
              <ThemedText>
                Customer Name: {transaction.ShippingAddress.Name}
              </ThemedText>
              <ThemedText>
                Total Amount: Rp{" "}
                {parseInt(transaction.TotalAmount || "0").toLocaleString()}
              </ThemedText>
              <ThemedText>
                Payment Method: {transaction.PaymentMethod}
              </ThemedText>
              <ThemedText>Status: {transaction.Status}</ThemedText>
              <ThemedText>
                Order At: {formatDate(transaction.CreatedAt)}
              </ThemedText>
            </Section>

            <View style={styles.separator} />

            <Section title="Shipping Address">
              <ThemedText>Name: {transaction.ShippingAddress.Name}</ThemedText>
              <ThemedText>
                Phone: {transaction.ShippingAddress.PhoneNumber}
              </ThemedText>
              <ThemedText>
                Address: {transaction.ShippingAddress.Address}
              </ThemedText>
              <ThemedText>
                Zip Code: {transaction.ShippingAddress.ZipCode}
              </ThemedText>
              <ThemedText>
                Destination Label:{" "}
                {transaction.ShippingAddress.DestinationLabel}
              </ThemedText>
              <ThemedText>
                Courier: {transaction.ShippingAddress.Courir}
              </ThemedText>
              <ThemedText>
                Shipping Cost: Rp{" "}
                {parseInt(
                  transaction.ShippingAddress.ShippingCost || "0"
                ).toLocaleString()}
              </ThemedText>
            </Section>

            <View style={styles.separator} />

            <Section title="Items">
              {transaction.TransactionDetails &&
              transaction.TransactionDetails.length > 0 ? (
                <View style={styles.tableContainer}>
                  <View style={styles.tableRow}>
                    <ThemedText style={styles.tableHeader}>Product</ThemedText>
                    <ThemedText style={styles.tableHeader}>Size</ThemedText>
                    <ThemedText style={styles.tableHeader}>Qty</ThemedText>
                    <ThemedText style={styles.tableHeader}>
                      Total Price
                    </ThemedText>
                  </View>
                  {transaction.TransactionDetails.map((detail, idx) => {
                    const quantity = parseInt(detail.Quantity, 10) || 0;
                    const totalPrice = (detail.Product.Price || 0) * quantity;
                    return (
                      <View key={idx} style={styles.tableRow}>
                        <ThemedText style={styles.tableCell}>
                          {detail.Product.Name}
                        </ThemedText>
                        <ThemedText style={styles.tableCell}>
                          {detail.Size}
                        </ThemedText>
                        <ThemedText style={styles.tableCell}>
                          {detail.Quantity}
                        </ThemedText>
                        <ThemedText style={styles.tableCell}>
                          Rp {totalPrice.toLocaleString()}{" "}
                        </ThemedText>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <ThemedText>No items available</ThemedText>
              )}
            </Section>

            <View style={styles.separator} />

            {transaction.PaymentProof ? (
              <Section title="Payment Proof">
                <TouchableOpacity onPress={() => setFullImageVisible(true)}>
                  <Image
                    source={{
                      uri: `http://localhost:7777${transaction.PaymentProof}`,
                    }}
                    style={styles.paymentProofImage}
                  />
                </TouchableOpacity>
              </Section>
            ) : (
              <ThemedText>No payment proof available</ThemedText>
            )}

            <View style={styles.closeButtonContainer}>
              <Button title="Close" onPress={onClose} />
            </View>
          </ParallaxScrollView>
        </View>
      </Modal>

      <Modal
        visible={fullImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullImageVisible(false)}
      >
        <View style={styles.fullImageOverlay}>
          <Image
            source={{ uri: `http://localhost:7777${transaction.PaymentProof}` }}
            style={styles.fullImage}
          />
          <Button title="Close" onPress={() => setFullImageVisible(false)} />
        </View>
      </Modal>
    </>
  );
};

export default TransactionDetailModal;
