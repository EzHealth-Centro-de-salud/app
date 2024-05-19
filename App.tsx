import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import fonts from "./config/fonts";
import Navigation from "./navigation";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import Toast from "react-native-toast-message";
import CustomToast from "./components/CustomToast";
import { setContext } from "@apollo/client/link/context";

const client = new ApolloClient({
  uri: process.env.EXPO_PUBLIC_BACKEND_URL,
  cache: new InMemoryCache(),
});

export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  return !fontsLoaded ? null : (
    <ApolloProvider client={client}>
      <Navigation />
      <StatusBar />
      <Toast
        config={{
          success: ({ text1, text2 }) => (
            <CustomToast type="success" text1={text1} text2={text2} />
          ),
          error: ({ text1, text2 }) => (
            <CustomToast type="error" text1={text1} text2={text2} />
          ),
        }}
      />
    </ApolloProvider>
  );
}
