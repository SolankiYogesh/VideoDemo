import {
  DeviceEventEmitter,
  FlatList,
  NativeModules,
  SafeAreaView,
  StyleSheet,
  ViewToken,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {VIDEOS, VideoItemType} from './Data/Data';
import VideoItem from './VideoItem';

interface ItemViewToken extends ViewToken {
  item: VideoItemType; // Replace YourItemType with the type of your list items
}

interface Item {
  item: VideoItemType;
  index: number;
}

const VideoScreen = () => {
  const [activeVideo, setActiveVideo] = useState(VIDEOS[0].id);
  const {AudioFocusModule} = NativeModules;
  const [audioFocus, setAudioFocus] = useState(1);

  useEffect(() => {
    AudioFocusModule.startListeningForAudioFocus();
    const subscription = DeviceEventEmitter.addListener(
      'onAudioFocusChange',
      focusChange => {
        console.log('Audio focus changed:', focusChange);
        setAudioFocus(focusChange);
      },
    );
    const onIncomingCall = DeviceEventEmitter.addListener(
      'onIncomingCall',
      (e: any) => {
        console.log('onIncomingCall:', e);
      },
    );
    return () => {
      subscription.remove();
      onIncomingCall.remove();
    };
  }, []);

  const renderItem = useCallback(
    ({item}: Item) => {
      return (
        <VideoItem
          item={item}
          audioFocus={audioFocus}
          active={activeVideo === item.id}
        />
      );
    },
    [activeVideo, audioFocus],
  );

  const onViewableItemsChanged = useCallback(
    (info: {viewableItems: ItemViewToken[]; changed: ItemViewToken[]}) => {
      setActiveVideo(info?.viewableItems[0]?.item?.id);
    },
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={VIDEOS}
        pagingEnabled
        removeClippedSubviews
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 100,
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={i => i.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
