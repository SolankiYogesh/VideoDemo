import {Dimensions, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import React, {useEffect, useState} from 'react';
import {VideoItemType} from './Data/Data';
import Video from 'react-native-video';

interface VideoItemProps {
  active: boolean;
  item: VideoItemType;
  audioFocus: number;
}

const VideoItem = (props: VideoItemProps) => {
  const {active, item, audioFocus} = props;
  const [isPlay, setISPlay] = useState(false);

  useEffect(() => {
    setISPlay(active && audioFocus !== -2);
  }, [active, audioFocus]);

  return (
    <TouchableWithoutFeedback
      onPress={() => setISPlay(!isPlay)}
      style={styles.container}>
      <Video
        source={{
          uri: item?.url,
        }}
        repeat
        style={styles.container}
        paused={!isPlay}
        poster={item?.thumbnail}
        resizeMode="contain"
        posterResizeMode="contain"
      />
    </TouchableWithoutFeedback>
  );
};

export default VideoItem;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
