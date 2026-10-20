import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Button } from '../components';
import { colors, styles } from '../theme';

export default function VideoScreen({ course }) {
  const player = useVideoPlayer(course.trailerUrl);
  return <ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.heading}>Trailer khóa học</Text>
    <Text style={styles.subtitle}>{course.title}</Text>
    <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: '#101827', marginBottom: 16 }}>
      <VideoView player={player} style={{ width: '100%', height: 225 }} nativeControls
        contentFit="contain" fullscreenOptions={{ enable: true }} />
    </View>
    <View style={[styles.horizontal, { marginBottom: 15 }]}>
      <Button title="▶ Phát" onPress={() => player.play()} style={{ flex: 1 }} />
      <Button title="⏸ Tạm dừng" variant="outline" onPress={() => player.pause()} style={{ flex: 1 }} />
    </View>
    <Text style={{ color: colors.sub, lineHeight: 21 }}>
      Nguồn video được đọc từ trường trailerUrl trên MockAPI. Phải là đường dẫn file MP4 có thể truy cập công khai.
    </Text>
    <Text style={[styles.small, { marginTop: 14 }]} selectable>{course.trailerUrl}</Text>
  </ScrollView>;
}
