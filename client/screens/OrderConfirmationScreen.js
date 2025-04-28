import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { orders } from "../services/api";

const OrderConfirmationScreen = ({ route, navigation }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await orders.getById(route.params.orderId);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/success.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Order Confirmed!</Text>

      <Text style={styles.orderId}>Order ID: {order._id}</Text>

      <Text style={styles.message}>
        Thank you for your purchase. Your order has been received and is being
        processed.
      </Text>

      <View style={styles.details}>
        <Text style={styles.detailTitle}>Order Details:</Text>
        <Text>Status: {order.orderStatus}</Text>
        <Text>Total Amount: ${order.totalAmount.toFixed(2)}</Text>
        <Text>Payment Status: {order.paymentStatus}</Text>
      </View>

      <View style={styles.shipping}>
        <Text style={styles.detailTitle}>Shipping Address:</Text>
        <Text>{order.shippingAddress.address}</Text>
        <Text>
          {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
          {order.shippingAddress.zipCode}
        </Text>
        <Text>{order.shippingAddress.country}</Text>
      </View>

      <Button
        mode="contained"
        onPress={() => navigation.navigate("Products")}
        style={styles.button}
      >
        Continue Shopping
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  details: {
    width: "100%",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  shipping: {
    width: "100%",
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
});

export default OrderConfirmationScreen;
