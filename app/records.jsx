import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from '../lib/supabase';

export default function Records() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filter, setFilter] = useState("All");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newData, setNewData] = useState({
    stdn_id: "",
    stdn_firstname: "",
    stdn_lastname: "",
    stdn_email: "",
    status: "Active",
  });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('student')
        .select('*')
        .order('stdn_id', { ascending: true });

      console.log('DATA:', data);
      console.log('ERROR:', error);

      if (error) throw error;
      if (data) setRecords(data);
    } catch (error) {
      console.error('Fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords =
    filter === "All"
      ? records
      : records.filter((r) => r.status === filter);

  const handleAdd = async () => {
    if (!newData.stdn_firstname || !newData.stdn_id) return;
    try {
      const { error } = await supabase
        .from('student')
        .insert([{
          stdn_id: newData.stdn_id,
          stdn_firstname: newData.stdn_firstname,
          stdn_lastname: newData.stdn_lastname,
          stdn_email: newData.stdn_email,
          status: newData.status,
        }]);

      if (error) throw error;
      setAddModalVisible(false);
      setNewData({ stdn_id: "", stdn_firstname: "", stdn_lastname: "", stdn_email: "", status: "Active" });
      fetchRecords();
    } catch (error) {
      console.error('Add error:', error.message);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.stdn_id);
    setEditData(item);
  };

  const saveEdit = async () => {
    try {
      const { error } = await supabase
        .from('student')
        .update({
          stdn_firstname: editData.stdn_firstname,
          stdn_lastname: editData.stdn_lastname,
          stdn_email: editData.stdn_email,
          status: editData.status,
        })
        .eq('stdn_id', editingId);

      if (error) throw error;
      setEditingId(null);
      fetchRecords();
    } catch (error) {
      console.error('Edit error:', error.message);
    }
  };

  const cancelEdit = () => setEditingId(null);

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('student')
        .delete()
        .eq('stdn_id', deleteId);

      if (error) throw error;
      setDeleteId(null);
      fetchRecords();
    } catch (error) {
      console.error('Delete error:', error.message);
    }
  };

  const renderItem = ({ item }) => {
    const isEditing = editingId === item.stdn_id;

    return (
      <View style={styles.card}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={editData.stdn_firstname}
              placeholder="First Name"
              onChangeText={(text) => setEditData({ ...editData, stdn_firstname: text })}
            />
            <TextInput
              style={styles.input}
              value={editData.stdn_lastname}
              placeholder="Last Name"
              onChangeText={(text) => setEditData({ ...editData, stdn_lastname: text })}
            />
            <TextInput
              style={styles.input}
              value={editData.stdn_email}
              placeholder="Email"
              onChangeText={(text) => setEditData({ ...editData, stdn_email: text })}
            />
            <TextInput
              style={styles.input}
              value={editData.status}
              placeholder="Status"
              onChangeText={(text) => setEditData({ ...editData, status: text })}
            />
            <View style={styles.actions}>
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>
              Student Name:{" "}
              <Text style={styles.value}>
                {item.stdn_firstname} {item.stdn_lastname}
              </Text>
            </Text>
            <Text style={styles.label}>
              Student No.: <Text style={styles.value}>{item.stdn_id}</Text>
            </Text>
            <Text style={styles.label}>
              Email: <Text style={styles.value}>{item.stdn_email}</Text>
            </Text>
            <Text style={styles.label}>
              Status: <Text style={styles.value}>{item.status}</Text>
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => startEdit(item)}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => setDeleteId(item.stdn_id)}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={24} color="#fff" />
        <Text style={styles.headerTitle}>RECORDS</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setAddModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* FILTER */}
      <View style={styles.filterCard}>
        <View style={styles.filterHeader}>
          <Ionicons name="filter" size={14} />
          <Text style={{ marginLeft: 5 }}>Filter</Text>
        </View>
        <View style={styles.dropdownRow}>
          {["All", "Active", "Inactive"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.filterOption, filter === item && styles.filterSelected]}
              onPress={() => setFilter(item)}
            >
              <Text style={{ color: filter === item ? "#fff" : "#000", fontSize: 12 }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* LIST */}
      <View style={styles.listContainer}>
        {loading ? (
          <Text style={{ textAlign: 'center', padding: 20 }}>Loading...</Text>
        ) : (
          <FlatList
            data={filteredRecords}
            keyExtractor={(item) => item.stdn_id?.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
          />
        )}
      </View>

      {/* ADD MODAL */}
      <Modal transparent visible={addModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Student</Text>
            <TextInput
              style={styles.input}
              placeholder="Student ID"
              value={newData.stdn_id}
              onChangeText={(text) => setNewData({ ...newData, stdn_id: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={newData.stdn_firstname}
              onChangeText={(text) => setNewData({ ...newData, stdn_firstname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={newData.stdn_lastname}
              onChangeText={(text) => setNewData({ ...newData, stdn_lastname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newData.stdn_email}
              onChangeText={(text) => setNewData({ ...newData, stdn_email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Status (Active/Inactive)"
              value={newData.status}
              onChangeText={(text) => setNewData({ ...newData, status: text })}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.btnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DELETE MODAL */}
      <Modal transparent visible={deleteId !== null} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this record?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setDeleteId(null)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* NAV */}
<View style={styles.bottomNav}>
  <TouchableOpacity onPress={() => router.push("/Dashboard")} style={styles.navItem}>
    <Ionicons name="home-outline" size={20} color="#666" />
    <Text style={styles.navText}>Home</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => router.push("/audit_log")} style={styles.navItem}>
    <Ionicons name="document-text-outline" size={20} color="#666" />
    <Text style={styles.navText}>Logs</Text>
  </TouchableOpacity>

  <View style={styles.navActive}>
    <Ionicons name="person-outline" size={20} color="#fff" />
    <Text style={styles.navActiveText}>Records</Text>
  </View>

  <TouchableOpacity onPress={() => router.push("/computer")} style={styles.navItem}>
    <Ionicons name="desktop-outline" size={20} color="#666" />
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
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addBtn: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    padding: 6,
  },
  filterCard: {
    backgroundColor: "#D9D9D9",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dropdownRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterOption: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  filterSelected: {
    backgroundColor: "#1A4D5F",
  },
  listContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 15,
    padding: 12,
    flex: 1,
  },
  card: {
    paddingVertical: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 13,
  },
  value: {
    fontWeight: "normal",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 6,
    marginBottom: 6,
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  editBtn: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  saveBtn: {
    backgroundColor: "green",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  cancelBtn: {
    backgroundColor: "gray",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#999",
    marginVertical: 10,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    paddingVertical: 10,
    marginVertical: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
});