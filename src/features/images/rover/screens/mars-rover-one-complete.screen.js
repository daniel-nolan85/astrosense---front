import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { badgeUnlocked } from '../../../../requests/user';
import { BadgeAnimation } from '../../../../components/animations/badge.animation';
import OneRover from '../../../../../assets/svg/badges/one-rover.svg';

const BadgeContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const MarsRoverOneCompleteScreen = ({ navigation, route }) => {
  const { navigate } = navigation;
  let additionalAchievements = route.params?.additionalAchievements || [];

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (user.role !== 'guest') {
      badgeUnlocked(user.token, user._id, 'achievedRedPlanetVoyager')
        .then((res) => {
          dispatch({
            type: 'LOGGED_IN_USER',
            payload: {
              ...user,
              achievedRedPlanetVoyager: res.data.achievedRedPlanetVoyager,
            },
          });
        })
        .catch((err) => console.error(err));
    } else {
      dispatch({
        type: 'LOGGED_IN_USER',
        payload: {
          ...user,
          achievedRedPlanetVoyager: true,
        },
      });
    }
    if (additionalAchievements.length > 1) {
      const firstAchievement = additionalAchievements[0];
      additionalAchievements = additionalAchievements.slice(1);
      navigate(firstAchievement, { additionalAchievements });
    } else if (additionalAchievements.length === 1) {
      navigate(additionalAchievements[0]);
    } else {
      navigate('MarsRoverImagesScreen');
    }
  };

  return (
    <BadgeContainer>
      <BadgeAnimation
        svg={<OneRover width={380} height={380} />}
        title='Red Planet Voyager'
        body={`Congratulations, Commander ${user.name}! You've earned the esteemed 'Red Planet Voyager' badge, marking your exploration of captivating Martian landscapes captured by our intrepid rovers. Like a cosmic explorer gazing upon the Martian frontier, you've delved into the mysteries of the Red Planet. May your curiosity continue to propel you across the vast reaches of our celestial neighbor. Onward, Red Planet Voyager!`}
        handleSubmit={handleSubmit}
      />
    </BadgeContainer>
  );
};
