import { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { SafeArea } from '../../../components/utils/safe-area.component';
import { Text } from '../../../components/typography/text.component';
import Posts from '../../../../assets/svg/posts.svg';
import PostsInactive from '../../../../assets/svg/posts-inactive.svg';
import Star from '../../../../assets/svg/star.svg';
import StarInactive from '../../../../assets/svg/star-inactive.svg';
import Achievements from '../../../../assets/svg/achievements.svg';
import AchievementsInactive from '../../../../assets/svg/achievements-inactive.svg';
import { fetchUsersPosts } from '../../../requests/post';
import { ProfileCard } from '../components/profile-card.component';
import { ProfileButtons } from '../components/profile-buttons.component';
import { PostsRoute } from '../components/posts-route.component';
import { StarsRoute } from '../components/stars-route.component';
import { AchievementsRoute } from '../components/achievements-route.component';

const SafeAreaView = styled(SafeArea)`
  flex: 1;
  background-color: #fff;
`;

export const ProfileScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'first',
      title: 'Posts',
      icon: <Posts width={32} height={32} />,
      inactiveIcon: <PostsInactive width={32} height={32} />,
    },
    {
      key: 'second',
      title: 'Stars',
      icon: <Star width={32} height={32} />,
      inactiveIcon: <StarInactive width={32} height={32} />,
    },
    {
      key: 'third',
      title: 'Missions',
      icon: <Achievements width={32} height={32} />,
      inactiveIcon: <AchievementsInactive width={32} height={32} />,
    },
  ]);

  useEffect(() => {
    if (token) {
      usersPosts();
    }
  }, [token]);

  const { token, _id, profileImage, name, rank, bio } = useSelector(
    (state) => state.user
  );

  const usersPosts = async () => {
    await fetchUsersPosts(token, _id)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => console.error(err));
  };

  const renderScene = SceneMap({
    first: () => <PostsRoute posts={posts} />,
    second: () => <StarsRoute />,
    third: () => <AchievementsRoute />,
  });

  const layout = useWindowDimensions();

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: '#009999',
      }}
      renderIcon={({ route, focused }) =>
        focused ? route.icon : route.inactiveIcon
      }
      style={{
        backgroundColor: '#fff',
        height: 64,
      }}
      renderLabel={({ focused, route }) => (
        <Text style={[{ color: focused ? '#009999' : 'gray' }]}>
          {route.title}
        </Text>
      )}
    />
  );

  const { navigate } = navigation;

  return (
    <SafeAreaView>
      <ProfileCard
        userId={_id}
        profileImage={profileImage}
        name={name}
        rank={rank}
        bio={bio}
      />
      <ProfileButtons
        userId={_id}
        name={name}
        rank={rank}
        navigate={navigate}
      />
      <View
        style={{
          flex: 1,
          marginHorizontal: 22,
        }}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
};
