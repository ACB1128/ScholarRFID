import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { DataTable } from 'react-native-paper';

const Dashboard = () => {

  const [records, setRecords] = useState([])

const fetchData = async () => {
  const { data: recordData } = await supabase
    .from('records')
    .select('*')
    .order('id', { ascending: false })
    .limit(5);

  if (recordData) setRecords(recordData);
};
const [aulogs, setauLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  // 🔹 Real-time updates
  useEffect(() => {
  fetchData()

  const interval = setInterval(() => {
    console.log('Refreshing data...')
    fetchData()
  }, 3000)
  

  return () => clearInterval(interval)
}, [])git remote add origin https://github.com/ACB1128/ScholarRFID.git
useEffect(() => {
  fetchLogs();
}, []);

const fetchLogs = async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from('auditlogs')
      .select('*')
      .order('id', { ascending: false })
      .limit(5);
      
      
    if (error) throw error;
    if (data) setauLogs(data);
    
  } catch (error) {
    console.error('Error fetching logs:', error.message);
  } finally {
    setLoading(false);
  }
};
  // 🔹 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/Login')
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.headerRow}>
  <Text style={styles.headerTitle}>DASHBOARD</Text>

  <TouchableOpacity style={styles.logoutTopBtn} onPress={handleLogout}>
    <Text style={styles.logoutTopText}>LOG OUT</Text>
  </TouchableOpacity>
</View>

        <View style={styles.welcomeRow}>
          <Ionicons name="shield-checkmark" size={60} color="#00C2FF" />
          <View>
            <Text style={styles.welcomeText}>WELCOME BACK,</Text>
            <Text style={styles.adminText}>ADMIN!</Text>
          </View>
        </View>

        {/* 🔹 RECENT LOGS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>
          <TouchableOpacity onPress={() => router.push("/audit_log")}>
            <Text style={styles.viewText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <DataTable style={[styles.wholeTable, { marginTop: 18 }]}>
   <ScrollView 
  horizontal={true} 
  showsHorizontalScrollIndicator={true} 
>
  <View style={{ width: 1890 }}> 
    
      <DataTable.Header style={styles.tableHeader}>
        <DataTable.Title style={{ width: 120 }}>Student No.</DataTable.Title>
        <DataTable.Title style={{ width: 120 }}>Date</DataTable.Title>
        <DataTable.Title style={{ width: 120 }}>Login Time</DataTable.Title>
        <DataTable.Title style={{ width: 120 }}>Logout Time</DataTable.Title>
        <DataTable.Title style={{ width: 120 }}>Validity</DataTable.Title>
        <DataTable.Title style={{ width: 120 }}>Remarks</DataTable.Title>
      </DataTable.Header>
        
      <ScrollView style={{ maxHeight: 400 }}>
        {loading ? (
          <Text style={{ textAlign: 'center', padding: 20 }}>Loading...</Text>
        ) : (
          aulogs.map((item) => (
           <DataTable.Row key={item.id} style={styles.tableRow}>
  <DataTable.Cell style={{ width: 120 }}>
    {item.stdn_id || 'N/A'}
  </DataTable.Cell>

  <DataTable.Cell style={{ width: 120 }}>
    {item.login_time
      ? new Date(item.login_time).toLocaleDateString()
      : 'N/A'}
  </DataTable.Cell>

  <DataTable.Cell style={{ width: 120 }}>
    {item.login_time
      ? new Date(item.login_time).toLocaleTimeString()
      : 'N/A'}
  </DataTable.Cell>

  <DataTable.Cell style={{ width: 120 }}>
    {item.logout_time
      ? new Date(item.logout_time).toLocaleTimeString()
      : 'N/A'}
  </DataTable.Cell>

  <DataTable.Cell style={{ width: 120 }}>
    {item.validity || 'N/A'}
  </DataTable.Cell>

  <DataTable.Cell style={{ width: 120 }}>
    {item.remarks || 'N/A'}
  </DataTable.Cell>
</DataTable.Row>
          ))
        )}
      </ScrollView>
    
  </View>
  
</ScrollView> 
</DataTable>   

        {/* 🔹 RECENT RECORDS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Records</Text>
          <TouchableOpacity onPress={() => router.push("/records")}>
            <Text style={styles.viewText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {records.map((record) => (
          <View key={record.id} style={styles.card}>
            <Text>{record.name || "Record"}</Text>
          </View>
        ))}

      </ScrollView>
 <View style={styles.bottomNav}>
  <View style={styles.navActive}>
    <Ionicons name="home-outline" size={20} color="#fff" />
    <Text style={styles.navActiveText}>Home</Text>
  </View>

  <TouchableOpacity
    onPress={() => router.push("/audit_log")}
    style={styles.navItem}
  >
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

  <TouchableOpacity
    onPress={() => router.push("/computer")}
    style={styles.navItem}
  >
    <Ionicons name="desktop-outline" size={20} color="#666" />
    <Text style={styles.navText}>Computer</Text>
  </TouchableOpacity>
</View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1A4D5F", 
    paddingTop: 50, 
    paddingHorizontal: 15 
  },
    
  headerTitle: { 
    color: "#fff", 
    fontSize: 26, 
    fontWeight: "bold", 
    marginBottom: 20 
  },

  welcomeRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 15, 
    marginBottom: 25 
  },

  welcomeText: { 
    color: "#fff", 
    fontSize: 14, 
    letterSpacing: 1 
  },

  adminText: { 
    color: "#fff", 
    fontSize: 22, 
    fontWeight: "bold" 
  },

  sectionHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 10 
  },

  sectionTitle: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },

  viewBtn: { 
    borderWidth: 1, 
    borderColor: "#fff", 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 15 
  },

  viewText: { 
    color: "#fff", 
    fontSize: 12 
  },

  bigCard: { 
    backgroundColor: "#D9D9D9", 
    height: 120, 
    borderRadius: 20, 
    marginTop: 10, 
    marginBottom: 20 
  },

  bottomNav: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    backgroundColor: "#D9D9D9", 
    borderRadius: 20, 
    paddingVertical: 10, 
    marginBottom: 55 
  },

  navItem: { 
    alignItems: "center" 
  },

  navText: { 
    fontSize: 12 
  },

  navItemActive: { 
    alignItems: "center", 
    backgroundColor: "#1A4D5F", 
    padding: 10, 
    borderRadius: 20 
  },

  navTextActive: { 
    color: "#fff", 
    fontSize: 12 
  },

  logoutBtn: { 
    backgroundColor: "#ff4d4d", 
    padding: 12, 
    borderRadius: 10, 
    alignItems: "center", 
    marginVertical: 10 
  },

  logoutText: { 
    color: "#fff", 
    fontWeight: "bold" 
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
  headerRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},

logoutTopBtn: {
  backgroundColor: "#ff4d4d",
  paddingHorizontal: 15,
  paddingVertical: 8,
  borderRadius: 20,
},

logoutTopText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 12,
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
})