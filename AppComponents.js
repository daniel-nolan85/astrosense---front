import { useState, useEffect, useContext } from 'react';
import { Snackbar } from 'react-native-paper';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';
import {
  useFonts as useAudiowide,
  Audiowide_400Regular,
} from '@expo-google-fonts/audiowide';
import {
  useFonts as useQuestrial,
  Questrial_400Regular,
} from '@expo-google-fonts/questrial';
import Toast from 'react-native-toast-message';
import { useSelector, useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';
import io from 'socket.io-client';
import { theme } from './src/infrastructure/theme';
import { PlanetsContextProvider } from './src/services/planets/planets.context';
import { ImagesContextProvider } from './src/services/images/images.context';
import { GamesContextProvider } from './src/services/games/games.context';
import { SettingsContextProvider } from './src/services/settings/settings.context';
import { Navigation } from './src/infrastructure/navigation';
import { currentUser } from './src/requests/auth';
import { incrementNotifsCount } from './src/requests/user';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const AppComponents = () => {
  const [visible, setVisible] = useState(false);
  const [snack, setSnack] = useState('');

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const socket = io(process.env.SOCKET_IO_URL, { path: '/socket.io' });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        const idToken = await user.accessToken;
        currentUser(idToken).then((res) => {
          dispatch({
            type: 'LOGGED_IN_USER',
            payload: {
              token: idToken,
              _id: res.data._id,
              email: res.data.email,
              role: res.data.role,
              noficationToken: res.data.noficationToken,
              nofications: res.data.nofications,
              newNotificationsCount: res.data.newNotificationsCount,
              xp: res.data.xp,
              rank: res.data.rank,
              bio: res.data.bio,
              profileImage: res.data.profileImage,
              lastLoginDate: res.data.lastLoginDate,
              createdAt: res.data.createdAt,
              daysInSpace: res.data.daysInSpace,
              name: res.data.name,
              allies: res.data.allies,
              explorers: res.data.explorers,
              blockeds: res.data.blockeds,
              textSpeed: res.data.textSpeed,
              viewedRovers: res.data.viewedRovers,
              viewedRoverCameras: res.data.viewedRoverCameras,
              viewedRoverDateTypes: res.data.viewedRoverDateTypes,
              achievedCosmicPioneer: res.data.achievedCosmicPioneer,
              achievedAdventurousExplorer: res.data.achievedAdventurousExplorer,
              achievedStellarVoyager: res.data.achievedStellarVoyager,
              achievedAstroPioneer: res.data.achievedAstroPioneer,
              achievedCosmicTrailblazer: res.data.achievedCosmicTrailblazer,
              achievedCelestialNomad: res.data.achievedCelestialNomad,
              achievedGalacticWayfarer: res.data.achievedGalacticWayfarer,
              achievedInterstellarVoyager: res.data.achievedInterstellarVoyager,
              achievedStellarCenturion: res.data.achievedStellarCenturion,
              achievedVoyagerExtraordinaire:
                res.data.achievedVoyagerExtraordinaire,
              achievedRedPlanetVoyager: res.data.achievedRedPlanetVoyager,
              achievedMarsRoverMaestro: res.data.achievedMarsRoverMaestro,
              achievedMartianLensMaster: res.data.achievedMartianLensMaster,
              achievedCosmicChronologist: res.data.achievedCosmicChronologist,
              achievedCosmicCadet: res.data.achievedCosmicCadet,
              achievedStarNavigator: res.data.achievedStarNavigator,
              achievedGalacticSage: res.data.achievedGalacticSage,
              achievedNovaScholar: res.data.achievedNovaScholar,
              achievedQuasarVirtuoso: res.data.achievedQuasarVirtuoso,
              achievedSupernovaSavant: res.data.achievedSupernovaSavant,
              achievedLightSpeedExplorer: res.data.achievedLightSpeedExplorer,
              achievedOdysseyTrailblazer: res.data.achievedOdysseyTrailblazer,
              achievedInfinityVoyager: res.data.achievedInfinityVoyager,
            },
          }).catch((err) => console.error(err));
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit('setup', user._id);
      socket.on('post liked', (userId) => {
        incrementNotifsNum(userId, 'liked your post');
      });
      socket.on('comment added', (userId) => {
        incrementNotifsNum(userId, 'commented on your post');
      });
    }
  }, [user && user.token]);

  const incrementNotifsNum = async (userId, message) => {
    await incrementNotifsCount(user.token, user._id, userId, message)
      .then((res) => {
        const newNotifications = res.data.newNotificationsCount;
        setSnack(newNotifications[newNotifications.length - 1].message);
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            ...user,
            newNotificationsCount: newNotifications,
          },
        });
        setVisible(true);
        setTimeout(() => {
          setSnack('');
          setVisible(false);
        }, 1500);
      })
      .catch((err) => console.error(err));
  };

  const [audiowideLoaded] = useAudiowide({ Audiowide_400Regular });
  const [questrialLoaded] = useQuestrial({ Questrial_400Regular });
  if (!audiowideLoaded || !questrialLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <SettingsContextProvider>
          <GamesContextProvider>
            <PlanetsContextProvider>
              <ImagesContextProvider>
                <Navigation />
              </ImagesContextProvider>
            </PlanetsContextProvider>
          </GamesContextProvider>
        </SettingsContextProvider>
      </ThemeProvider>
      <ExpoStatusBar style='auto' />
      <Toast />
      <Snackbar
        wrapperStyle={{ top: 40 }}
        visible={visible}
        style={{ backgroundColor: '#009999', padding: 5 }}
      >
        {snack}
      </Snackbar>
    </SafeAreaProvider>
  );
};
