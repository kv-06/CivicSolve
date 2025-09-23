// app/(tabs)/my-issues.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FloatingChatButton } from "../../components/FloatingChatButton";
import IssueCard from "../../components/IssueCard";
import { mockApi } from "../../utils/mockApi";

export default function MyIssuesScreen() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    reported: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  useEffect(() => {
    loadMyIssues();
  }, []);

  const loadMyIssues = async () => {
    try {
      setLoading(true);
      const response = await mockApi.getMyIssues();

      if (response.success) {
        setIssues(response.data);
        calculateStats(response.data);
      }
    } catch (error) {
      console.error("Error loading issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (issuesData) => {
    const stats = {
      total: issuesData.length,
      reported: issuesData.filter((issue) => issue.status === "reported")
        .length,
      inProgress: issuesData.filter((issue) => issue.status === "in_progress")
        .length,
      resolved: issuesData.filter((issue) => issue.status === "resolved")
        .length,
      closed: issuesData.filter((issue) => issue.status === "closed").length,
    };
    setStats(stats);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyIssues();
    setRefreshing(false);
  };

  const handleIssuePress = (issue) => {
    router.push({
      pathname: "/issue-detail",
      params: {
        issueId: issue.id,
        fromMyIssues: "true",
      },
    });
  };

  const handleChatPress = () => {
    router.push("/chat");
  };

  const renderStatsCard = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Your Issues Overview</Text>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.totalCard]}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Issues</Text>
        </View>

        <View style={[styles.statCard, styles.reportedCard]}>
          <Text style={[styles.statNumber, { color: "#f44336" }]}>
            {stats.reported}
          </Text>
          <Text style={styles.statLabel}>Reported</Text>
        </View>

        <View style={[styles.statCard, styles.progressCard]}>
          <Text style={[styles.statNumber, { color: "#ff9800" }]}>
            {stats.inProgress}
          </Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>

        <View style={[styles.statCard, styles.resolvedCard]}>
          <Text style={[styles.statNumber, { color: "#4caf50" }]}>
            {stats.resolved}
          </Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Issues Reported</Text>
      <Text style={styles.emptyMessage}>
        You haven't reported any civic issues yet.
      </Text>
      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => router.push("/(tabs)/report")}
      >
        <Text style={styles.reportButtonText}>Report Your First Issue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderIssue = ({ item }) => (
    <IssueCard issue={item} onPress={handleIssuePress} showReporter={false} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading your issues...</Text>
        </View>
        <FloatingChatButton onPress={handleChatPress} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Issues</Text>
        <Text style={styles.headerSubtitle}>
          Track your reported civic issues
        </Text>
      </View>

      {/* Content */}
      <FlatList
        data={issues}
        renderItem={renderIssue}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={issues.length > 0 ? renderStatsCard : null}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196F3"]}
            tintColor="#2196F3"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          issues.length === 0 ? styles.emptyContentContainer : null
        }
      />

      <FloatingChatButton onPress={handleChatPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  statsContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  totalCard: {
    backgroundColor: "#e3f2fd",
  },
  reportedCard: {
    backgroundColor: "#ffebee",
  },
  progressCard: {
    backgroundColor: "#fff3e0",
  },
  resolvedCard: {
    backgroundColor: "#e8f5e8",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  reportButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  reportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
