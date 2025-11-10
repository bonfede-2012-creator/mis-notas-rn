import { router, useNavigation } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../lib/firebase";

const g = StyleSheet.create({
  screen:{ flex:1, backgroundColor:"#EEF2FF", padding:16 },
  card:{ backgroundColor:"#fff", borderRadius:12, borderWidth:1, borderColor:"#CBD5E1", padding:16, marginBottom:12 },
  title:{ fontSize:22, fontWeight:"700", color:"#0F172A", marginBottom:12 },
  btn:{ backgroundColor:"#5A6BFF", paddingVertical:12, borderRadius:10, alignItems:"center" },
  btnText:{ color:"#fff", fontWeight:"700" },
  listItem:{ backgroundColor:"#fff", borderRadius:12, borderWidth:1, borderColor:"#CBD5E1", padding:16, marginBottom:10 },
  noteTitle:{ fontSize:16, fontWeight:"700", color:"#0F172A" },
  noteMeta:{ fontSize:12, color:"#64748B", marginTop:4 }
});

export default function Notas() {
  const [notes, setNotes] = useState([]);
  const navigation = useNavigation();
  const [uid, setUid] = useState(null);

  useEffect(() => {
    navigation.setOptions({ title: "Notas" });
  }, [navigation]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u || !u.emailVerified) { router.replace("/"); return; }
      setUid(u.uid);
      const r = ref(db, `notes/${u.uid}`);
      return onValue(r, (snap) => {
        const val = snap.val() || {};
        const arr = Object.entries(val).map(([id, n]) => ({ id, ...n }))
          .sort((a,b) => (b.updatedAt||0)-(a.updatedAt||0));
        setNotes(arr);
      });
    });
    return unsub;
  }, []);

  return (
    <View style={g.screen}>
      <View style={g.card}>
        <Text style={g.title}>Tus notas</Text>
        <TouchableOpacity style={g.btn} onPress={() => router.push("/editar")}>
          <Text style={g.btnText}>Nueva nota</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: "/editar", params: { id: item.id } })}>
            <View style={g.listItem}>
              <Text style={g.noteTitle}>{item.title || "(Sin título)"}</Text>
              <Text style={g.noteMeta}>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ""}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
