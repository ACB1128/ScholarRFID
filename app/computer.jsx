import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { supabase } from '../lib/supabase'
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { DataTable } from 'react-native-paper';

export default function ComputerScreen(){
  const router = useRouter();
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchComputers();
}, []);

const fetchComputers = async () => {
  try {
    setLoading(true);

    const { data, error } = await supabase
      .from('computers')
      .select(`
        id,
        currentuser,
        student:student!computers_currentuser_fkey (
          stdn_firstname,
          stdn_lastname
        )
      `)
      .order('id', { ascending: true });

    if (error) throw error;

    if (data) setComputers(data);

  } catch (error) {
    console.error('Error fetching computers:', error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>COMPUTERS</Text>
        </View>

{loading ? (
  <Text style={{ color: "#fff", textAlign: "center" }}>Loading...</Text>
) : (
  <DataTable style={styles.wholeTable}>

      <View style={{ width: "100%" }}>

        <DataTable.Header style={styles.tableHeader}>
<DataTable.Title style={{ flex: 0.8 }}>PC</DataTable.Title>
<DataTable.Title style={{ flex: 2 }}>User</DataTable.Title>
<DataTable.Title style={{ flex: 1.3 }}>ID</DataTable.Title>
<DataTable.Title style={{ flex: 1.5 }}>Status</DataTable.Title>
        </DataTable.Header>

        {computers.map((computer) => (
<DataTable.Row key={computer.id} style={styles.tableRow}>
  <DataTable.Cell style={{ flex: 0.8 }}>
    {computer.id}
  </DataTable.Cell>

  <DataTable.Cell style={{ flex: 2 }}>
    <Text numberOfLines={1} ellipsizeMode="tail">
      {computer.student
        ? `${computer.student.stdn_firstname} ${computer.student.stdn_lastname}`
        : "No Active User"}
    </Text>
  </DataTable.Cell>

  <DataTable.Cell style={{ flex: 1.3 }}>
    {computer.currentuser || "N/A"}
  </DataTable.Cell>

  <DataTable.Cell style={{ flex: 1.5 }}>
    <Text
      style={{
        color: computer.currentuser ? "red" : "green",
        fontWeight: "bold",
      }}
    >
      {computer.currentuser ? "Occupied" : "Available"}
    </Text>
  </DataTable.Cell>
</DataTable.Row>
        ))}

      </View>
  </DataTable>
)}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => router.push("/Dashboard")}
          style={styles.navItem}
        >
          <Ionicons name="home-outline" size={20} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/audit_log")} style={styles.navItem}>
                 <Ionicons name="document-text-outline" size={20} color="#666" />
                  <Text style={styles.navText}>Logs</Text>
                </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/records")}
          style={styles.navItem}
        >
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.navText}>Records</Text>
        </TouchableOpacity>
        
        <View style={styles.navActive}>
          <Ionicons name="document-text-outline" size={20} color="#fff" />
          <Text style={styles.navActiveText}>Computer</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A4D5F",
    paddingHorizontal: 15,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#d9d9d9",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  filterTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  picker: {
    height: 40,
    width: "100%",
  },
  dropdown: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: "#0c3b44",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tableHeader: {
    backgroundColor: "#c0c0c0",
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    
  },
  tableRow: {
    backgroundColor: "#d9d9d9",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    minHeight: 50, 
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 14
  },
  wholeTable:{
    borderRadius:20,
    overflow: "hidden",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 50,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#666",
  },
  navActive: {
    alignItems: "center",
    backgroundColor: "#1A4D5F",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  navActiveText: {
    color: "#fff",
    fontSize: 12,
  },
  computerCard: {
  backgroundColor: "#D9D9D9",
  borderRadius: 20,
  padding: 15,
  marginBottom: 15,
},

computerTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},

computerText: {
  fontSize: 14,
  marginBottom: 5,
},
wholeTable: {
  borderRadius: 20,
  overflow: "hidden",
},

tableHeader: {
  backgroundColor: "#C0C0C0",
},

tableRow: {
  backgroundColor: "#D9D9D9",
  borderBottomWidth: 1,
  borderBottomColor: "#CCC",
},
});