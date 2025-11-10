// app/index.jsx
import { useEffect } from "react";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";

const DEST = "https://mis-notas-391b7.web.app/";

export default function Index() {
  useEffect(() => {
    if (Platform.OS === "web") {
      // web: redirección inmediata en la misma pestaña
      window.location.replace(DEST);
    } else {
      // nativo: abre el navegador del sistema
      Linking.openURL(DEST);
    }
  }, []);

  // Fallback por si el navegador bloquea algo
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Abriendo Mis Notas…</Text>
      <TouchableOpacity
        onPress={() => (Platform.OS === "web" ? (window.location.href = DEST) : Linking.openURL(DEST))}
        style={{ backgroundColor: "#5A6BFF", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Ir ahora</Text>
      </TouchableOpacity>
    </View>
  );
}
