import { ScrollView, Animated } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import {
  ApodCard,
  ApodCardCover,
  Info,
  Title,
  Body,
} from '../styles/apod-card.styles';

export const ApodInfoCard = ({ image, title, explanation }) => {
  scale = new Animated.Value(1);

  const zoomImage = Animated.event(
    [
      {
        nativeEvent: { scale },
      },
    ],
    { useNativeDriver: true }
  );

  const zoomState = (e) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <ApodCard elevation={5}>
      <PinchGestureHandler
        onGestureEvent={zoomImage}
        onHandlerStateChange={zoomState}
      >
        <ApodCardCover
          key={title}
          source={{ uri: image }}
          style={{ transform: [{ scale }] }}
          resizeMode={'contain'}
        />
      </PinchGestureHandler>
      <ScrollView>
        <Info>
          <Title variant='title'>{title}</Title>
          <Body variant='body'>{explanation}</Body>
        </Info>
      </ScrollView>
    </ApodCard>
  );
};
