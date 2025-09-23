// app/(tabs)/discover.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FloatingChatButton } from "../../components/FloatingChatButton";
import IssueCard from "../../components/IssueCard";
import { apiService } from "../../utils/apiService";

const CATEGORIES = [
  "All",
  "Road & Transport",
  "Water & Sanitation",
  "Electricity",
  "Garbage & Waste",
  "Public Safety",
  "Health & Medical",
  "Education",
  "Others",
];

const STATUSES = ["All", "reported", "in_progress", "resolved", "closed"];
const PRIORITIES = ["All", "high", "medium", "low"];
const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Most Supported", value: "support" },
  { label: "High Priority", value: "priority" },
];

export default function DiscoverScreen() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    status: "All",
    priority: "All",
    sortBy: "newest",
  });

  useEffect(() => {
    loadIssues();
  }, [filters]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchText !== filters.search) {
        setFilters((prev) => ({ ...prev, search: searchText }));
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchText]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllIssues(filters);

      if (response.success) {
        setIssues(response.data);
      }
    } catch (error) {
      console.error("Error loading issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIssues();
    setRefreshing(false);
  };

  const handleIssuePress = (issue) => {
    router.push({
      pathname: "/issue-detail",
      params: {
        issueId: issue.id,
        fromDiscover: "true",
      },
    });
  };

  const handleChatPress = () => {
    router.push("/chat");
  };

  const applyFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "All",
      status: "All",
      priority: "All",
      sortBy: "newest",
    });
    setSearchText("");
    setShowFilters(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category !== "All") count++;
    if (filters.status !== "All") count++;
    if (filters.priority !== "All") count++;
    if (filters.search) count++;
    return count;
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search issues, locations, categories..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            getActiveFilterCount() > 0 && styles.activeFilterButton,
          ]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={16} color="#2196F3" />
          <Text style={styles.filterButtonText}>Filter</Text>
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {getActiveFilterCount()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSort(true)}
        >
          <Ionicons name="swap-vertical" size={16} color="#2196F3" />
          <Text style={styles.sortButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.modalClearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Category</Text>
            <View style={styles.filterOptions}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    filters.category === category && styles.activeFilterOption,
                  ]}
                  onPress={() => setFilters((prev) => ({ ...prev, category }))}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.category === category &&
                        styles.activeFilterOptionText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Status</Text>
            <View style={styles.filterOptions}>
              {STATUSES.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    filters.status === status && styles.activeFilterOption,
                  ]}
                  onPress={() => setFilters((prev) => ({ ...prev, status }))}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.status === status &&
                        styles.activeFilterOptionText,
                    ]}
                  >
                    {status === "All"
                      ? "All"
                      : status
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Priority Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Priority</Text>
            <View style={styles.filterOptions}>
              {PRIORITIES.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.filterOption,
                    filters.priority === priority && styles.activeFilterOption,
                  ]}
                  onPress={() => setFilters((prev) => ({ ...prev, priority }))}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.priority === priority &&
                        styles.activeFilterOptionText,
                    ]}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSort}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowSort(false)}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Sort By</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.modalContent}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.sortOption}
              onPress={() => {
                setFilters((prev) => ({ ...prev, sortBy: option.value }));
                setShowSort(false);
              }}
            >
              <Text style={styles.sortOptionText}>{option.label}</Text>
              {filters.sortBy === option.value && (
                <Ionicons name="checkmark" size={20} color="#2196F3" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderIssue = ({ item }) => (
    <IssueCard issue={item} onPress={handleIssuePress} showReporter={true} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Issues Found</Text>
      <Text style={styles.emptyMessage}>
        {filters.search
          ? `No issues found for "${filters.search}"`
          : "No civic issues match your current filters."}
      </Text>
      {getActiveFilterCount() > 0 && (
        <TouchableOpacity
          style={styles.clearFiltersButton}
          onPress={clearFilters}
        >
          <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Issues</Text>
        <Text style={styles.headerSubtitle}>
          Explore civic issues in your community
        </Text>
      </View>

      {/* Search and Filters */}
      {renderSearchBar()}

      {/* Loading State */}
      {loading && issues.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading issues...</Text>
        </View>
      ) : (
        /* Issues List */
        <FlatList
          data={issues}
          renderItem={renderIssue}
          keyExtractor={(item) => item.id}
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
            issues.length === 0
              ? styles.emptyContentContainer
              : { paddingBottom: 100 }
          }
        />
      )}

      {/* Modals */}
      {renderFilterModal()}
      {renderSortModal()}

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
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#2196F3",
    flex: 0.48,
    justifyContent: "center",
  },
  activeFilterButton: {
    backgroundColor: "#2196F3",
  },
  filterButtonText: {
    color: "#2196F3",
    marginLeft: 4,
    fontWeight: "500",
  },
  filterBadge: {
    backgroundColor: "#f44336",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#2196F3",
    flex: 0.48,
    justifyContent: "center",
  },
  sortButtonText: {
    color: "#2196F3",
    marginLeft: 4,
    fontWeight: "500",
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
  clearFiltersButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  clearFiltersButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#666",
  },
  modalClearText: {
    fontSize: 16,
    color: "#f44336",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 20,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeFilterOption: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#666",
  },
  activeFilterOptionText: {
    color: "#fff",
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  applyButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sortOptionText: {
    fontSize: 16,
    color: "#333",
  },
});
