import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { testConnection } from "../database/db";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await testConnection();
        setOk(res);
      } catch (e) {
        setOk(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        {loading ? (
          <>
            <ActivityIndicator />
            <Text style={{ marginTop: 12 }}>Checking DB connection...</Text>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 18, marginBottom: 12 }}>
              DB Connection: {ok ? "✅ Connected" : "❌ Failed"}
            </Text>
            <Button
              title="Re-check"
              onPress={async () => {
                setLoading(true);
                const res = await testConnection();
                setOk(res);
                setLoading(false);
              }}
            />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
