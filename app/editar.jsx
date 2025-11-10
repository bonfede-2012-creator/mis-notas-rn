import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { get, push, ref, remove, update } from "firebase/database";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../lib/firebase";

const g = StyleSheet.create({
  screen:{ flex:1, backgroundColor:"#EEF2FF", padding:16 },
  card:{ backgroundColor:"#fff", borderRadius:12, borderWidth:1, borderColor:"#CBD5E1", padding:16, maxWidth:800, alignSelf:"center", width:"100%" },
  title:{ fontSize:22, fontWeight:"700", color:"#0F172A", marginBottom:12 },
  input:{ borderWidth:1, borderColor:"#CBD5E1", borderRadius:10, padding:12, backgroundColor:"#fff", marginBottom:10 },
  btn:{ backgroundColor:"#5A6BFF", paddingVertical:12, borderRadius:10, alignItems:"center", marginTop:8 },
  btnDanger:{ backgroundColor:"#EF4444", marginTop:8, borderRadius:10, alignItems:"center", paddingVertical:12 },
  btnText:{ color:"#fff", fontWeight:"700" }
});

export default function Editar() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [uid, setUid] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    navigation.setOptions({ title: id ? "Editar" : "Nueva" });
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u || !u.emailVerified) { router.replace("/"); return; }
      setUid(u.uid);
      if (id) {
        const snap = await get(ref(db, `notes/${u.uid}/${id}`));
        const n = snap.val();
        if (n) { setTitle(n.title || ""); setContent(n.content || ""); }
      }
    });
    return unsub;
  }, [id]);

  const save = async () => {
    const now = Date.now();
    if (id) {
      await update(ref(db, `notes/${uid}/${id}`), { title, content, updatedAt: now });
    } else {
      const r = ref(db, `notes/${uid}`);
      await push(r, { title, content, updatedAt: now });
    }
    router.back();
  };

  const del = async () => {
    if (!id) return router.back();
    Alert.alert("Borrar nota", "¿Seguro que querés borrar esta nota?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: "destructive", onPress: async () => {
          await remove(ref(db, `notes/${uid}/${id}`));
          router.back();
        } }
    ]);
  };

  return (
    <View style={g.screen}>
      <View style={g.card}>
        <Text style={g.title}>{id ? "Editar nota" : "Nueva nota"}</Text>
        <TextInput placeholder="Título" value={title} onChangeText={setTitle} style={g.input} />
        <TextInput
          placeholder="Contenido"
          value={content}
          onChangeText={setContent}
          multiline
          style={[g.input, { height: 200, textAlignVertical: "top" }]}
        />
        <TouchableOpacity style={g.btn} onPress={save}><Text style={g.btnText}>Guardar</Text></TouchableOpacity>
        {id && <TouchableOpacity style={g.btnDanger} onPress={del}><Text style={g.btnText}>Borrar</Text></TouchableOpacity>}
      </View>
    </View>
  );
}
