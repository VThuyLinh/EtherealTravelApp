import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import WebView from 'react-native-webview';
import StyleAll from '../../style/StyleAll'; // Giả sử bạn có file style này

const IframeVideo360 = ({ navigation, route }) => {
  const [foods, setFoods] = React.useState(route.params?.foods || []);
  const [places, setPlaces] = React.useState(route.params?.places || []);
  const url = route.params?.url;
  const youtubeEmbedCode = `${url}`;
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Thực hiện logic làm mới dữ liệu ở đây (ví dụ: gọi API)
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Giả lập thời gian làm mới
  }, []);

  return (
    <ScrollView
      style={[StyleAll.container, StyleAll.margin, styles.container]} // Thêm styles.container vào đây
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.videoContainer}>
        <WebView
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{ html: `${youtubeEmbedCode}` }}
        />
      </View>

      {refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={'pink'} />
          <Text style={styles.loadingText}>Đang làm mới...</Text>
        </View>
      )}

      <View style={styles.section}>
        <View>
        <Text style={styles.sectionTitle}>Các món ăn nên thử</Text>
        {foods && foods.length > 0 ? (
          foods.map((f, index) => (
            <Text key={index} style={styles.listItem}>{f}</Text>
          ))
        ) : (
          <Text style={styles.emptyText}>Chưa có thông tin về món ăn.</Text>
        )}
        </View>
        <View>
        <Text style={styles.sectionTitle}>Các địa điểm nổi bật</Text>
        {places && places.length > 0 ? (
          places.map((p, index) => (
            <Text key={index} style={styles.listItem}>{p}</Text>
          ))
        ) : (
          <Text style={styles.emptyText}>Chưa có thông tin về địa điểm.</Text>
        )}
      </View>
      </View>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo ScrollView chiếm toàn bộ không gian
  },
  webview: {
    width: '100%', // WebView chiếm hết chiều rộng container
    aspectRatio: 16 / 9,
    marginLeft:10,
    // Tỷ lệ khung hình video phổ biến
  },
  videoContainer: {
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 8, // Bo tròn góc video
    overflow: 'hidden', // Ẩn các phần thừa khi bo tròn góc
    backgroundColor: '#f5f5f5', // Màu nền cho container video
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
   
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  listItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    marginLeft:10,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: 'pink',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  },
});

export default IframeVideo360;