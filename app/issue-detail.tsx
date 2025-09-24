// app/issue-detail.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mockApi } from "../utils/mockApi";

const { width, height } = Dimensions.get("window");

export default function IssueDetailScreen() {
  const { issueId, fromMyIssues, fromDiscover } = useLocalSearchParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [escalating, setEscalating] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [supporting, setSupporting] = useState(false);
  const [hasEscalated, setHasEscalated] = useState(false);
  const [hasSupported, setHasSupported] = useState(false);
  const [hasReported, setHasReported] = useState(false);


  useEffect(() => {
    loadIssueDetails();
  }, []);

  const loadIssueDetails = async () => {
    try {
      setLoading(true);
      const response = await mockApi.getIssueById(issueId);

      if (response.success) {
        setIssue(response.data);
      } else {
        Alert.alert("Error", response.error);
        router.back();
      }
    } catch (error) {
      console.error("Error loading issue details:", error);
      Alert.alert("Error", "Failed to load issue details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (hasEscalated) return;

    Alert.alert(
      "Escalate Issue",
      "Are you sure you want to escalate this issue to higher authorities?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Escalate", onPress: performEscalation },
      ]
    );
  };

  const performEscalation = async () => {
    try {
      setEscalating(true);
      const response = await mockApi.escalateIssue(issueId);

      if (response.success) {
        setHasEscalated(true);
        setIssue((prev) => ({
          ...prev,
          escalationCount: prev.escalationCount + 1,
        }));
        Alert.alert("Success", response.message);
      } else {
        Alert.alert("Error", response.error);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to escalate issue");
    } finally {
      setEscalating(false);
    }
  };

  const handleReport = async () => {
    Alert.alert("Report Issue", "Why are you reporting this issue?", [
      { text: "Cancel", style: "cancel" },
      { text: "Spam", onPress: () => performReport("spam") },
      { text: "Inappropriate", onPress: () => performReport("inappropriate") },
      { text: "Fake", onPress: () => performReport("fake") },
    ]);
  };

  const performReport = async (reason) => {
    try {
      setReporting(true);
      const response = await mockApi.reportIssue(issueId, reason);

      if (response.success) {
        Alert.alert("Success", response.message);
        setHasReported(true);
      } else {
        Alert.alert("Error", response.error);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to report issue");
    } finally {
      setReporting(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this civic issue: "${issue.title}"\n\nLocation: ${
          typeof issue.location === "object"
            ? issue.location.address
            : issue.location
        }\nStatus: ${
          issue.status
        }\n\nHelp resolve community issues by supporting this report.`,
        title: "Civic Issue - " + issue.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

 
  const getStatusColor = (status) => {
    switch (status) {
      case "reported":
        return "#f44336";
      case "under_review":
        return "#ff7043";
      case "in_progress":
        return "#ff9800";
      case "resolved":
        return "#4caf50";
      case "closed":
        return "#2e7d32";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "reported":
        return "Reported";
      case "under_review":
        return "Under Review";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const renderStatusTimeline = () => {
    if (!issue.timeline) return null;

    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>Issue Progress</Text>

        <View style={styles.timeline}>
          {issue.timeline.map((step, index) => (
            <View key={index} style={styles.timelineStep}>
              {/* Timeline Line */}
              <View style={styles.timelineLineContainer}>
                <View
                  style={[
                    styles.timelineCircle,
                    step.active
                      ? styles.activeTimelineCircle
                      : styles.inactiveTimelineCircle,
                  ]}
                />
                {index < issue.timeline.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      step.active
                        ? styles.activeTimelineLine
                        : styles.inactiveTimelineLine,
                    ]}
                  />
                )}
              </View>

              {/* Timeline Content */}
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineStatus,
                    step.active
                      ? styles.activeTimelineStatus
                      : styles.inactiveTimelineStatus,
                  ]}
                >
                  {getStatusText(step.status)}
                </Text>
                <Text style={styles.timelineMessage}>{step.message}</Text>
                {step.date && (
                  <Text style={styles.timelineDate}>
                    {new Date(step.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderActionButtons = () => {
    const isFromDiscover = fromDiscover === "true";

    if (isFromDiscover) {
      

    return (
      <View style={styles.discoverActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.escalateButton,
            hasEscalated && styles.escalatedButton,
          ]}
          onPress={handleEscalate}
          disabled={escalating || hasEscalated}
        >
          <Ionicons
            name="arrow-up-circle"
            size={20}
            color={hasEscalated ? "#fff" : "#3498db"}
          />
          <Text
            style={[
              styles.actionButtonText,
              hasEscalated && styles.escalatedButtonText,
            ]}
          >
            {escalating
              ? "Escalating..."
              : hasEscalated
              ? "Escalated"
              : "Escalate"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
              styles.actionButton,
              styles.reportButton,
              hasReported && styles.reportedButton, // Apply reported style
            ]}
            onPress={handleReport}
            disabled={reporting || hasReported}
          >
            <Ionicons
              name="alert-circle"
              size={20}
              color={hasReported ? "#fff" : "#e67e22"}
            />
            <Text
              style={[
                styles.actionButtonText,
                hasReported && styles.reportedButtonText, // Change text color
              ]}
            >
              {reporting ? "Reporting..." : hasReported ? "Reported" : "Report"}
            </Text>
          </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}
        >
          <Ionicons name="share" size={20} color="#27ae60" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    );

  }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading issue details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!issue) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Issue not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Issue Details" }} />
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />


      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Issue Image */}
        {issue.image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: issue.image }} style={styles.issueImage} />
          </View>
        )}

        <View style={styles.content}>
          {/* Issue Title */}
          <Text style={styles.issueTitle}>{issue.title}</Text>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(issue.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(issue.status)}</Text>
          </View>

          {/* Issue Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={16} color="#666" />
              <Text style={styles.infoText}>
                Reported by:{" "}
                {typeof issue.reportedBy === "object"
                  ? issue.reportedBy.name
                  : issue.reportedBy}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.infoText}>
                {typeof issue.location === "object"
                  ? issue.location.address
                  : issue.location}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.infoText}>
                {new Date(issue.reportedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="business" size={16} color="#666" />
              <Text style={styles.infoText}>
                Authority:{" "}
                {typeof issue.authority === "object"
                  ? issue.authority.name
                  : issue.authority}
              </Text>
            </View>
          </View>

          {/* Issue Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{issue.description}</Text>
          </View>

          {/* Timeline */}
          {renderStatusTimeline()}

          {/* Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {issue.escalationCount || 0}
              </Text>
              <Text style={styles.statLabel}>Escalations</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{issue.viewCount || 0}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {renderActionButtons()}
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backIcon: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 250,
  },
  issueImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  issueTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    lineHeight: 28,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  timelineContainer: {
    marginBottom: 24,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineStep: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineLineContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  timelineCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeTimelineCircle: {
    backgroundColor: "#3498db",
  },
  inactiveTimelineCircle: {
    backgroundColor: "#ddd",
  },
  timelineLine: {
    width: 2,
    height: 30,
    marginTop: 4,
  },
  activeTimelineLine: {
    backgroundColor: "#3498db",
  },
  inactiveTimelineLine: {
    backgroundColor: "#ddd",
  },
  timelineContent: {
    flex: 1,
    paddingTop: -2,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  activeTimelineStatus: {
    color: "#3498db",
  },
  inactiveTimelineStatus: {
    color: "#999",
  },
  timelineMessage: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: "#999",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  myIssuesActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  discoverActions: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  supportButton: {
    borderColor: "#e74c3c",
    backgroundColor: "#fff",
  },
  supportedButton: {
    backgroundColor: "#e74c3c",
  },
  supportedButtonText: {
    color: "#fff",
  },
  escalateButton: {
    borderColor: "#3498db",
    backgroundColor: "#fff",
    flex: 0.32,
  },
  escalatedButton: {
    backgroundColor: "#3498db",
  },
  escalatedButtonText: {
    color: "#fff",
  },
  reportButton: {
    borderColor: "#e67e22",
    backgroundColor: "#fff",
    flex: 0.32,
  },
  reportedButton: {
    backgroundColor: "#e67e22",
  },
  reportedButtonText: {
    color: "#fff",
  },
  shareButton: {
    borderColor: "#27ae60",
    backgroundColor: "#fff",
    flex: 0.32,
  },
});
