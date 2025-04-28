import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useStripe, CardField } from "@stripe/stripe-react-native";
import { cart, orders, stripe } from "../services/api";

const CheckoutScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const { confirmPayment } = useStripe();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cart.get();
      setCartItems(response.data);
      calculateTotal(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
    setTotal(total);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create payment intent
      const { data } = await stripe.createPaymentIntent(total);

      // Confirm payment
      const { error, paymentIntent } = await confirmPayment(data.clientSecret, {
        type: "Card",
        billingDetails: {
          address: {
            line1: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.zipCode,
            country: shippingAddress.country,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Create order
      await orders.create(shippingAddress, paymentIntent.id);

      // Clear cart
      await cart.clear();

      // Navigate to confirmation
      navigation.replace("OrderConfirmation", { orderId: paymentIntent.id });
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Shipping Information</Text>

      <TextInput
        label="Address"
        value={shippingAddress.address}
        onChangeText={(text) =>
          setShippingAddress({ ...shippingAddress, address: text })
        }
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="City"
        value={shippingAddress.city}
        onChangeText={(text) =>
          setShippingAddress({ ...shippingAddress, city: text })
        }
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="State"
        value={shippingAddress.state}
        onChangeText={(text) =>
          setShippingAddress({ ...shippingAddress, state: text })
        }
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="ZIP Code"
        value={shippingAddress.zipCode}
        onChangeText={(text) =>
          setShippingAddress({ ...shippingAddress, zipCode: text })
        }
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="Country"
        value={shippingAddress.country}
        onChangeText={(text) =>
          setShippingAddress({ ...shippingAddress, country: text })
        }
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.title}>Payment Information</Text>

      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
      />

      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <Button
        mode="contained"
        onPress={handlePayment}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Place Order
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  input: {
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default CheckoutScreen;
