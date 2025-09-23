// components/IssueCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const IssueCard = ({ issue, onPress, showReporter = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "reported":
        return "#f44336";
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

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Road & Transport":
        return "car";
      case "Water & Sanitation":
        return "water";
      case "Electricity":
        return "flash";
      case "Garbage & Waste":
        return "trash";
      case "Public Safety":
        return "shield";
      case "Health & Medical":
        return "medical";
      case "Education":
        return "school";
      default:
        return "help-circle";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
      default:
        return "#666";
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(issue)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryContainer}>
          <Ionicons
            name={getCategoryIcon(issue.category)}
            size={16}
            color="#2196F3"
          />
          <Text style={styles.categoryText}>{issue.category}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(issue.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(issue.status)}</Text>
        </View>
      </View>

      {issue.images && issue.images.length > 0 && (
        <Image source={{ uri: issue.images[0] }} style={styles.issueImage} />
      )}

      <View style={styles.cardContent}>
        <Text style={styles.issueTitle} numberOfLines={2}>
          {issue.title}
        </Text>
        <Text style={styles.issueDescription} numberOfLines={2}>
          {issue.shortDescription}
        </Text>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>
            {issue.location.address}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.reporterInfo}>
          <View style={styles.reporterAvatar}>
            <Text style={styles.reporterInitial}>
              {showReporter
                ? issue.reportedBy.name.charAt(0).toUpperCase()
                : "A"}
            </Text>
          </View>
          <View style={styles.reporterDetails}>
            <Text style={styles.reporterName}>
              {showReporter
                ? issue.reportedBy.name
                : issue.assignedTo.authority}
            </Text>
            <Text style={styles.timeAgo}>{getTimeAgo(issue.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {issue.escalationCount > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={14} color="#f44336" />
              <Text style={styles.statText}>{issue.escalationCount}</Text>
            </View>
          )}

          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={14} color="#666" />
            <Text style={styles.statText}>{issue.supportCount}</Text>
          </View>

          <View
            style={[
              styles.priorityDot,
              { backgroundColor: getPriorityColor(issue.priority) },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 12,
    color: "#2196F3",
    marginLeft: 4,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  issueImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#f0f0f0",
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    lineHeight: 22,
  },
  issueDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  reporterInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  reporterAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  reporterInitial: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  reporterDetails: {
    marginLeft: 8,
    flex: 1,
  },
  reporterName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  timeAgo: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  statText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 2,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
});

export default IssueCard;
