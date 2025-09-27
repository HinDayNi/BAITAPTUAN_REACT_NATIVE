import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Photo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export default function Gallery() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGridView, setIsGridView] = useState<boolean>(false);

  const goBack = () => {
    router.back();
  };

  // Lấy dữ liệu hình ảnh từ API
  const fetchPhotos = async () => {
    try {
      setLoading(true);

      // Sử dụng JSONPlaceholder API cho photos
      const response = await fetch(
        "https://68d786892144ea3f6da59393.mockapi.io/gallery"
      );

      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu từ server");
      }

      const data = await response.json();
      setPhotos(data);

      // Lấy 5 ảnh đầu làm featured photos cho horizontal list
      setFeaturedPhotos(data.slice(0, 5));
    } catch (error: any) {
      console.error("Fetch Error:", error);
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Toggle giữa ListView và GridView
  const toggleViewMode = () => {
    setIsGridView(!isGridView);
  };

  // Render item cho ListView (1 cột)
  const renderListItem = ({ item }: { item: Photo }) => (
    <View style={styles.listItem}>
      <Image source={{ uri: item.thumbnailUrl }} style={styles.listImage} />
      <View style={styles.listContent}>
        <Text style={styles.listTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.listId}>ID: {item.id}</Text>
      </View>
    </View>
  );

  // Render item cho GridView (2 cột)
  const renderGridItem = ({ item }: { item: Photo }) => (
    <View style={styles.gridItem}>
      <Image source={{ uri: item.thumbnailUrl }} style={styles.gridImage} />
      <Text style={styles.gridTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </View>
  );

  // Render item cho Horizontal List (nổi bật)
  const renderFeaturedItem = ({ item }: { item: Photo }) => (
    <View style={styles.featuredItem}>
      <Image source={{ uri: item.url }} style={styles.featuredImage} />
      <Text style={styles.featuredTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </View>
  );

  // Khi load dữ liệu thì hiển thị ActivityIndicator
  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Gallery App</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.loadingText}>Đang tải hình ảnh...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gallery App ({photos.length})</Text>
          <TouchableOpacity onPress={fetchPhotos} style={styles.refreshButton}>
            <Feather name="refresh-cw" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Bao toàn bộ trong ScrollView */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Tiêu đề và mô tả */}
          <View style={styles.headerContent}>
            <Text style={styles.title}>Bài tập 5: Gallery App</Text>
            <Text style={styles.description}>
              Hiển thị danh sách hình ảnh từ API với nhiều layout khác nhau
            </Text>
          </View>

          {/* Horizontal List: scroll ngang các item nổi bật */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Ảnh Nổi Bật</Text>
            <Text style={styles.sectionSubtitle}>Cuộn ngang để xem thêm →</Text>

            <FlatList
              data={featuredPhotos}
              renderItem={renderFeaturedItem}
              keyExtractor={(item) => `featured-${item.id}`}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            />
          </View>

          {/* Toggle Button: chuyển đổi giữa ListView và GridView */}
          <View style={styles.toggleSection}>
            <Text style={styles.sectionTitle}>📸 Tất Cả Ảnh</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleViewMode}
            >
              <Feather
                name={isGridView ? "list" : "grid"}
                size={20}
                color="white"
              />
              <Text style={styles.toggleText}>
                {isGridView ? "ListView" : "GridView"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* FlatList: ListView (1 cột) hoặc GridView (2 cột) */}
          <View style={styles.section}>
            <FlatList
              data={photos}
              renderItem={isGridView ? renderGridItem : renderListItem}
              keyExtractor={(item) => item.id}
              numColumns={isGridView ? 2 : 1}
              key={isGridView ? "grid" : "list"} // Force re-render khi thay đổi layout
              showsVerticalScrollIndicator={false}
              scrollEnabled={false} // ScrollView chính sẽ handle scroll
              contentContainerStyle={styles.galleryContainer}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  refreshButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FF6B35",
    fontWeight: "500",
  },
  headerContent: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    fontStyle: "italic",
  },
  toggleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  toggleButton: {
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  toggleText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Featured Photos (Horizontal List)
  featuredContainer: {
    paddingVertical: 8,
  },
  featuredItem: {
    marginHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredImage: {
    width: 200,
    height: 150,
    resizeMode: "cover",
  },
  featuredTitle: {
    padding: 12,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  // Gallery Container
  galleryContainer: {
    paddingBottom: 20,
  },

  // ListView (1 cột)
  listItem: {
    flexDirection: "row",
    backgroundColor: "white",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
  listContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  listTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 4,
    lineHeight: 20,
  },
  listId: {
    fontSize: 12,
    color: "#666",
  },

  // GridView (2 cột)
  gridItem: {
    flex: 0.5,
    backgroundColor: "white",
    margin: 6,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gridImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  gridTitle: {
    padding: 8,
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
    lineHeight: 16,
  },
});
