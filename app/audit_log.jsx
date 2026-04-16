import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform
} from "react-native";
import { supabase } from '../lib/supabase'
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DataTable } from 'react-native-paper';

export default  function AuditLogsScreen() {
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
const [studentNo, setStudentNo] = useState("");
  const [showTime, setShowTime] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const onTimeChange = (event, selectedTime) => {
    setShowTime(false);
    if (selectedTime) setTime(selectedTime);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDate(false);
    if (selectedDate) setDate(selectedDate);
  };
  const [logs, setLogs] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchLogs();
}, [studentNo, status, date, time]);

const fetchLogs = async () => {
  try {
    setLoading(true);

    let query = supabase
      .from('auditlogs')
      .select('*')
      .order('id', { ascending: false });

if (studentNo.trim() !== "") {
  const parsedStudentNo = Number(studentNo);

  if (!isNaN(parsedStudentNo)) {
    query = query.eq('stdn_id', parsedStudentNo);
  }
}

if (status !== "") {
  query = query.ilike('validity', status);
}
if (date) {
  const selectedDate = date.toISOString().split('T')[0];

  query = query
    .gte('login_time', `${selectedDate}T00:00:00`)
    .lte('login_time', `${selectedDate}T23:59:59`);
}

if (time && !isNaN(time.getTime())) {
  const selectedHour = time.getHours();
  const selectedMinute = time.getMinutes();

  const baseDate = date
    ? date.toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  query = query.gte(
    'login_time',
    `${baseDate}T${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}:00`
  );
}

const { data, error } = await query;

    if (error) throw error;

    setLogs(data || []);
  } catch (error) {
    console.error('Error fetching logs:', error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AUDIT LOGS</Text>
        </View>

        {/* FILTER CARD */}
        <View style={styles.card}>
          <Text style={styles.filterTitle}>Filter</Text>

          <View style={styles.row}>
            <TextInput
  placeholder="Student No."
  style={styles.input}
  placeholderTextColor="#666"
  value={studentNo}
  onChangeText={setStudentNo}
/>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Status" value="" />
                <Picker.Item label="Valid" value="valid" />
                <Picker.Item label="Invalid" value="invalid" />
              </Picker>
            </View>
          </View>

          {/* TIME & DATE */}
<View style={styles.row}>
  <TouchableOpacity
    style={styles.dropdown}
    onPress={() => setShowTime(true)}
  >
    <Text style={styles.dropdownText}>
      {time
        ? time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Select Time"}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.dropdown}
    onPress={() => setShowDate(true)}
  >
    <Text style={styles.dropdownText}>
      {date ? date.toLocaleDateString() : "Select Date"}
    </Text>
  </TouchableOpacity>
</View>

          {/* PICKERS */}
          {showTime && (
            <DateTimePicker
              value={time || new Date()}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}

          {showDate && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

<TouchableOpacity style={styles.button} onPress={fetchLogs}>
  <Text style={styles.buttonText}>APPLY</Text>
</TouchableOpacity>
        </View>

        {/* TABLE HEADER */}
        
<DataTable style={styles.wholeTable}>
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
          logs.map((item) => (
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

        <View style={styles.navActive}>
          <Ionicons name="document-text-outline" size={20} color="#fff" />
          <Text style={styles.navActiveText}>Logs</Text>
        </View>

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
          <Ionicons name="home-outline" size={20} color="#666" />
          <Text style={styles.navText}>Computer</Text>
        </TouchableOpacity>
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
});