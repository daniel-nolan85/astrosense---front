import { useCallback, useContext } from 'react';
import { Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  ModalWrapper,
  ModalView,
  CloseIcon,
  AdminWrapper,
  OptionContainer,
  Option,
  GradientBackground,
  OptionText,
} from '../styles/settings.styles';
import { SafeArea } from '../../../components/utils/safe-area.component';
import Close from '../../../../assets/svg/close.svg';
import {
  fetchReportedPosts,
  fetchAllPosts,
  fetchAllUsers,
} from '../../../requests/admin';
import { SettingsContext } from '../../../services/settings/settings.context';

export const AdminModal = ({ showAdmin, closeAdminModal, navigate }) => {
  const { setReportedPosts, setPosts, setUsers } = useContext(SettingsContext);

  const { token } = useSelector((state) => state.user);

  useFocusEffect(
    useCallback(() => {
      getReportedPosts();
      getPosts();
      getUsers();
    }, [])
  );

  const getReportedPosts = async () => {
    await fetchReportedPosts(token)
      .then((res) => {
        console.log('reportedPosts => ', res.data);
        setReportedPosts(res.data);
      })
      .catch((err) => console.error(err));
  };

  const getPosts = async () => {
    await fetchAllPosts(token)
      .then((res) => {
        console.log('posts => ', res.data);
        setPosts(res.data);
      })
      .catch((err) => console.error(err));
  };

  const getUsers = async () => {
    await fetchAllUsers(token)
      .then((res) => {
        console.log('users => ', res.data);
        setUsers(res.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <SafeArea>
        <Modal visible={showAdmin} transparent={true} animationType='slide'>
          <ModalWrapper>
            <ModalView>
              <CloseIcon onPress={closeAdminModal}>
                <Close />
              </CloseIcon>
              <AdminWrapper>
                <OptionContainer>
                  <Option
                    onPress={() => {
                      navigate('ReportedPostsScreen', {
                        navigate,
                      });
                      closeAdminModal();
                    }}
                  >
                    <GradientBackground>
                      <OptionText variant='body'>Reported Posts</OptionText>
                    </GradientBackground>
                  </Option>
                  <Option
                    onPress={() => {
                      navigate('PostsScreen', { navigate });
                      closeAdminModal();
                    }}
                  >
                    <GradientBackground>
                      <OptionText variant='body'>Posts</OptionText>
                    </GradientBackground>
                  </Option>
                  <Option
                    onPress={() => {
                      navigate('UsersScreen', { navigate });
                      closeAdminModal();
                    }}
                  >
                    <GradientBackground>
                      <OptionText variant='body'>Users</OptionText>
                    </GradientBackground>
                  </Option>
                </OptionContainer>
              </AdminWrapper>
            </ModalView>
          </ModalWrapper>
        </Modal>
      </SafeArea>
    </>
  );
};
