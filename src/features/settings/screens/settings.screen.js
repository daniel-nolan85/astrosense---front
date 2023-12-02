import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { List, Avatar, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { getAuth, signOut, updatePassword } from 'firebase/auth';
import { app } from '../../../../firebase';
import { SafeArea } from '../../../components/utils/safe-area.component';
import {
  AvatarContainer,
  UserInfoContainer,
  SettingsItem,
} from '../styles/settings.styles';
import Astronaut from '../../../../assets/svg/astronaut.svg';
import Achievements from '../../../../assets/svg/achievements.svg';
import Password from '../../../../assets/svg/password.svg';
import Speech from '../../../../assets/svg/speech.svg';
import Logout from '../../../../assets/svg/logout.svg';
import { Text } from '../../../components/typography/text.component';
import { AchievementsModal } from '../components/achievements-modal.component';
import { UpdatePasswordModal } from '../components/update-password-modal.component';
import { TextSpeedModal } from '../components/text-speed-modal.component';
import { updateTextSpeed } from '../../../requests/user';
import { updateUserName } from '../../../requests/user';

export const SettingsScreen = () => {
  const [passwordIsLoading, setPasswordIsLoading] = useState(false);
  const [textSpeedIsLoading, setTextSpeedIsLoading] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTextSpeed, setShowTextSpeed] = useState(false);
  const [password, setPassword] = useState('');
  const [textSpeed, setTextSpeed] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('');

  const { Icon } = Avatar;
  const { Section } = List;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user.textSpeed === 100) {
      setTextSpeed('slow');
    } else if (user.textSpeed === 50) {
      setTextSpeed('medium');
    } else {
      setTextSpeed('fast');
    }
  }, []);

  const auth = getAuth();

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = () => {
    setIsEditing(false);
    updateUserName(user.token, user._id, userName)
      .then((res) => {
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            ...user,
            name: res.data.name,
          },
        });
      })
      .catch((err) => console.error(err));
  };

  const closeAchievementsModal = () => {
    setShowAchievements(false);
  };

  const updateUserPassword = async () => {
    setPasswordIsLoading(true);
    const fbUser = auth.currentUser;
    await updatePassword(fbUser, password)
      .then(() => {
        setPasswordIsLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Launch credentials updated successfully',
          text2: `Your account is now fortified with a new password. Safe travels, Commander ${user.name}!`,
        });
        setShowPassword(false);
        setPassword('');
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.error('errorMessage => ', errorMessage);
        setPasswordIsLoading(false);
        setShowPassword(false);
        setPassword('');
        if (errorCode === 'auth/requires-recent-login') {
          Toast.show({
            type: 'error',
            text1: 'Recent sign-in is required',
            text2: 'Please sign in again to proceed with the password update.',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Update Failed',
            text2: errorMessage || 'An error occurred during password update.',
          });
        }
      });
  };

  const closePasswordModal = () => {
    setShowPassword(false);
    setPassword('');
  };

  const updateUserTextSpeed = async () => {
    setTextSpeedIsLoading(true);
    updateTextSpeed(user.token, user._id, textSpeed)
      .then((res) => {
        setTextSpeedIsLoading(false);
        setShowTextSpeed(false);
        Toast.show({
          type: 'success',
          text1: 'Your cosmic reading speed has been adjusted',
          text2:
            'Navigate through the cosmos at your own pace. Enjoy the journey, Commander!',
        });
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            ...user,
            textSpeed: res.data.textSpeed,
          },
        });
      })
      .catch((err) => {
        setTextSpeedIsLoading(false);
        setShowTextSpeed(false);
        console.error(err);
      });
  };

  const closeTextSpeedModal = () => {
    setShowTextSpeed(false);
  };

  const logout = async () => {
    await signOut(auth);
    dispatch({
      type: 'LOGOUT',
      payload: null,
    });
  };
  return (
    <SafeArea>
      <AvatarContainer>
        <Icon
          icon={() => <Astronaut width={180} height={180} />}
          backgroundColor='#eeeeef'
        />
      </AvatarContainer>
      <UserInfoContainer>
        {isEditing ? (
          <TextInput
            value={userName}
            onChangeText={(text) => setUserName(text)}
            onBlur={handleSavePress}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={handleEditPress}>
            <Text variant='title'>{user.name}</Text>
          </TouchableOpacity>
        )}
      </UserInfoContainer>
      <Section>
        <SettingsItem
          title={<Text variant='body'>Achievements</Text>}
          left={() => <Achievements width={32} height={32} />}
          onPress={() => setShowAchievements(true)}
        />
        <SettingsItem
          title={<Text variant='body'>Change password</Text>}
          left={() => <Password width={32} height={32} />}
          onPress={() => setShowPassword(true)}
        />
        <SettingsItem
          title={<Text variant='body'>Change conversation speed</Text>}
          left={() => <Speech width={32} height={32} />}
          onPress={() => setShowTextSpeed(true)}
        />
        <SettingsItem
          title={<Text variant='body'>Logout</Text>}
          left={() => <Logout width={32} height={32} />}
          onPress={logout}
        />
      </Section>
      <AchievementsModal
        showAchievements={showAchievements}
        closeAchievementsModal={closeAchievementsModal}
      />
      <UpdatePasswordModal
        password={password}
        setPassword={setPassword}
        updateUserPassword={updateUserPassword}
        showPassword={showPassword}
        closePasswordModal={closePasswordModal}
      />
      <TextSpeedModal
        textSpeed={textSpeed}
        setTextSpeed={setTextSpeed}
        updateUserTextSpeed={updateUserTextSpeed}
        showTextSpeed={showTextSpeed}
        closeTextSpeedModal={closeTextSpeedModal}
      />
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    overflow: 'hidden',
  },
});
