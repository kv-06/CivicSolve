import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingChatButton } from "../../components/FloatingChatButton";

const { width } = Dimensions.get("window");

export default function ReportScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState(null);
  const [media, setMedia] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Road & Transport",
    "Water & Sanitation",
    "Electricity",
    "Garbage & Waste",
    "Public Safety",
    "Health & Medical",
    "Education",
    "Others",
  ];

  const handleChatPress = () => {
    router.push("/chat");
  };

  // Request permissions
  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
    const { status: locationStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (
      cameraStatus !== "granted" ||
      mediaLibraryStatus !== "granted" ||
      audioStatus !== "granted" ||
      locationStatus !== "granted"
    ) {
      Alert.alert(
        "Permissions Required",
        "Please grant all permissions to use this feature."
      );
      return false;
    }
    return true;
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setLocation({
        coords: location.coords,
        address: address[0] || null,
      });

      Alert.alert("Success", "Location captured successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to get location. Please try again.");
    }
  };

  // Image picker
  const pickImage = async (useCamera = false) => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    };

    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      const newMedia = {
        id: Date.now().toString(),
        type: result.assets[0].type || "image",
        uri: result.assets[0].uri,
        name: `media_${Date.now()}.${
          result.assets[0].type === "video" ? "mp4" : "jpg"
        }`,
      };
      setMedia([...media, newMedia]);
    }
  };

  // Audio recording
  const startRecording = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setRecording(undefined);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      const newMedia = {
        id: Date.now().toString(),
        type: "audio",
        uri: uri,
        name: `audio_${Date.now()}.m4a`,
      };
      setMedia([...media, newMedia]);
    } catch (error) {
      Alert.alert("Error", "Failed to save recording");
    }
  };

  // Document picker
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const newMedia = {
          id: Date.now().toString(),
          type: "document",
          uri: result.assets[0].uri,
          name: result.assets[0].name,
        };
        setMedia([...media, newMedia]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  // Remove media
  const removeMedia = (id) => {
    setMedia(media.filter((item) => item.id !== id));
  };

  // Submit issue
  const submitIssue = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your issue.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please provide a description of the issue.");
      return;
    }

    if (!category) {
      Alert.alert("Error", "Please select a category.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically upload to your backend
      const issueData = {
        title: title.trim(),
        description: description.trim(),
        category,
        location,
        media,
        timestamp: new Date().toISOString(),
        status: "reported",
        id: Date.now().toString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Success!",
        "Your issue has been reported successfully. We will look into it soon.",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setTitle("");
              setDescription("");
              setCategory("");
              setLocation(null);
              setMedia([]);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Report Issue</Text>
          <Text style={styles.headerSubtitle}>Help improve your community</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Issue Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a brief title for your issue"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the issue in detail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
            >
              <Ionicons name="location" size={24} color="#2196F3" />
              <Text style={styles.locationText}>
                {location ? "Location captured" : "Get current location"}
              </Text>
            </TouchableOpacity>
            {location && (
              <Text style={styles.locationDetails}>
                {location.address?.street || ""} {location.address?.city || ""}
              </Text>
            )}
          </View>

          {/* Media Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Attachments</Text>
            <View style={styles.mediaButtons}>
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => pickImage(true)}
              >
                <Ionicons name="camera" size={24} color="#2196F3" />
                <Text style={styles.mediaButtonText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => pickImage(false)}
              >
                <Ionicons name="images" size={24} color="#2196F3" />
                <Text style={styles.mediaButtonText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaButton}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <Ionicons
                  name={isRecording ? "stop" : "mic"}
                  size={24}
                  color={isRecording ? "#f44336" : "#2196F3"}
                />
                <Text
                  style={[
                    styles.mediaButtonText,
                    isRecording && { color: "#f44336" },
                  ]}
                >
                  {isRecording ? "Stop" : "Record"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaButton}
                onPress={pickDocument}
              >
                <Ionicons name="document" size={24} color="#2196F3" />
                <Text style={styles.mediaButtonText}>File</Text>
              </TouchableOpacity>
            </View>

            {/* Media Preview */}
            {media.length > 0 && (
              <View style={styles.mediaPreview}>
                <Text style={styles.mediaPreviewTitle}>
                  Attachments ({media.length})
                </Text>
                {media.map((item) => (
                  <View key={item.id} style={styles.mediaItem}>
                    <View style={styles.mediaInfo}>
                      <Ionicons
                        name={
                          item.type === "image"
                            ? "image"
                            : item.type === "video"
                            ? "videocam"
                            : item.type === "audio"
                            ? "musical-notes"
                            : "document"
                        }
                        size={20}
                        color="#666"
                      />
                      <Text style={styles.mediaName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => removeMedia(item.id)}>
                      <Ionicons name="close-circle" size={24} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={submitIssue}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Submitting..." : "Submit Issue"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FloatingChatButton onPress={handleChatPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 5,
  },
  categoryScroll: {
    flexDirection: "row",
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryButtonSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryTextSelected: {
    color: "#fff",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  locationText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  locationDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  mediaButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  mediaButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    width: (width - 60) / 4,
  },
  mediaButtonText: {
    fontSize: 12,
    marginTop: 5,
    color: "#2196F3",
    fontWeight: "500",
  },
  mediaPreview: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
  },
  mediaPreviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  mediaItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  mediaInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mediaName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
