import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingChatButton } from "../../components/FloatingChatButton";
// import DateTimePicker from "@react-native-community/datetimepicker";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await mockApiCall();

      if (response.success) {
        setProfile(response.data);
        setEditedProfile(response.data);
      } else {
        Alert.alert("Error", "Failed to load profile");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Mock API call - replace with your actual API
  const mockApiCall = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      data: {
        _id: "68d22f643d735aa3cc0c3194",
        name: "Sanjay Mehta",
        phone: "9123456789",
        citizenId: "CIT-EB-003",
        dob: "1987-01-12T00:00:00.000+00:00",
        location: "T. Nagar, Chennai",
        gender: "Male",
        email: "sanjay.mehta@example.com",
        avatar: "https://via.placeholder.com/100x100/4285f4/ffffff?text=SM",
      },
    };
  };

  const handleEdit = () => {
    setEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedProfile({ ...profile });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Replace with your actual API call
      const response = await mockSaveApiCall(editedProfile);

      if (response.success) {
        setProfile(editedProfile);
        setEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Mock save API call - replace with your actual API
  const mockSaveApiCall = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { success: true, message: "Profile updated successfully" };
  };

  const handleChatPress = () => {
    router.push("/chat");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const updateField = (field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderEditableField = (
    label,
    field,
    placeholder,
    keyboardType = "default"
  ) => {
    const value = editing ? editedProfile[field] : profile[field];

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {editing ? (
          <TextInput
            style={styles.textInput}
            value={value || ""}
            onChangeText={(text) => updateField(field, text)}
            placeholder={placeholder}
            keyboardType={keyboardType}
          />
        ) : (
          <Text style={styles.fieldValue}>{value || "Not provided"}</Text>
        )}
      </View>
    );
  };

  const renderGenderField = () => {
    const currentGender = editing ? editedProfile.gender : profile.gender;

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Gender</Text>
        {editing ? (
          <View style={styles.genderContainer}>
            {["Male", "Female", "Other"].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderOption,
                  currentGender === gender && styles.selectedGender,
                ]}
                onPress={() => updateField("gender", gender)}
              >
                <Text
                  style={[
                    styles.genderText,
                    currentGender === gender && styles.selectedGenderText,
                  ]}
                >
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.fieldValue}>
            {currentGender || "Not specified"}
          </Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
        <FloatingChatButton onPress={handleChatPress} />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load profile</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <FloatingChatButton onPress={handleChatPress} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {!editing ? (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="pencil" size={20} color="#4285f4" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.savingButton]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            {editing && (
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.profileName}>
            {editing ? editedProfile.name : profile.name}
          </Text>
          <Text style={styles.citizenId}>ID: {profile.citizenId}</Text>
        </View>

        {/* Profile Fields */}
        <View style={styles.fieldsContainer}>
          {renderEditableField("Full Name", "name", "Enter your full name")}
          {renderEditableField(
            "Email Address",
            "email",
            "Enter your email",
            "email-address"
          )}
          {renderEditableField(
            "Phone Number",
            "phone",
            "Enter your phone number",
            "phone-pad"
          )}
          {renderEditableField("Location", "location", "Enter your location")}
          {renderGenderField()}

          {/* Date of Birth - Editable */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Date of Birth</Text>
            {editing ? (
              <TextInput
                style={styles.textInput}
                value={
                  editedProfile.dob
                    ? new Date(editedProfile.dob).toISOString().split("T")[0]
                    : ""
                }
                onChangeText={(text) => {
                  // Convert YYYY-MM-DD back to ISO string
                  const isoDate = text ? new Date(text).toISOString() : "";
                  updateField("dob", isoDate);
                }}
                placeholder="YYYY-MM-DD"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.fieldValue}>{formatDate(profile.dob)}</Text>
            )}
          </View>

        </View>

        {/* Account Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Account Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Issues Reported</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Issues Resolved</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <FloatingChatButton onPress={handleChatPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#4285f4",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    color: "#4285f4",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 4,
  },
  editActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#4285f4",
    borderRadius: 6,
  },
  savingButton: {
    backgroundColor: "#9bb5ff",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
  },
  editAvatarButton: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4285f4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  citizenId: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fieldsContainer: {
    backgroundColor: "#fff",
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: "#444",
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  textInput: {
    fontSize: 16,
    color: "#444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  genderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genderOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedGender: {
    backgroundColor: "#4285f4",
    borderColor: "#4285f4",
  },
  genderText: {
    fontSize: 14,
    color: "#666",
  },
  selectedGenderText: {
    color: "#fff",
  },
  statsContainer: {
    backgroundColor: "#fff",
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4285f4",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  bottomSpace: {
    height: 100,
  },
});
