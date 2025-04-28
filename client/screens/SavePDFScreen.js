import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { orders } from "../services/api";

const SavePDFScreen = () => {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    try {
      setLoading(true);

      // Fetch order data from the backend
      const response = await orders.getAll();
      const ordersData = response.data;

      // Generate HTML content for the PDF
      const htmlContent = `
        <h1>Order Summary</h1>
        <ul>
          ${ordersData
            .map(
              (order) => `
            <li>
              <strong>Order ID:</strong> ${order._id}<br />
              <strong>Total Amount:</strong> $${order.totalAmount.toFixed(
                2
              )}<br />
              <strong>Status:</strong> ${order.orderStatus}<br />
            </li>
          `
            )
            .join("")}
        </ul>
      `;

      // Create the PDF
      const options = {
        html: htmlContent,
        fileName: "OrderSummary",
        directory: "Documents",
      };

      const file = await RNHTMLtoPDF.convert(options);

      Alert.alert("PDF Saved", `PDF has been saved to: ${file.filePath}`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={loading ? "Generating PDF..." : "Save Orders as PDF"}
        onPress={generatePDF}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default SavePDFScreen;
