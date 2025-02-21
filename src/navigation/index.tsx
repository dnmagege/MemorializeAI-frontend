import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderButton, Text } from '@react-navigation/elements';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import bell from '../assets/bell.png';
import newspaper from '../assets/newspaper.png';
import { Home } from './screens/Home';
import { Profile } from './screens/Profile';
import  Settings  from './screens/Settings';
import { Updates } from './screens/Updates';
import { NotFound } from './screens/NotFound';
import { Scanner } from './screens/Scanner';
import { RootStackParamList } from './types';
import { UpdateProfile } from './screens/UpdateProfile'; // ✅ Import UpdateProfile
import { Admin } from './screens/Admin'; 
import  AdminLogin  from "./screens/AdminLogin";

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'MemorializeAI',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    Help: {
      screen: Updates,
      options: {
        tabBarIcon: ({ color, size }) => (
          <Image
            source={bell}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    Admin: {
      screen: AdminLogin,
      options: {
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
    Profile: {
      screen: Profile,
      linking: {
        path: ':id',
        parse: {
          user: (value) => value.replace(/^@/, ''),
        },
        stringify: {
          id: (value) => `@${value}`,
        },
      },
    },
    // Settings: {
    //   screen: Settings,
    //   options: ({ navigation }) => ({
    //     presentation: 'modal',
    //     headerRight: () => (
    //       <HeaderButton onPress={navigation.goBack}>
    //         <Text>Close</Text>
    //       </HeaderButton>
    //     ),
    //   }),
    // },
    Settings: {
      screen: Settings,  // ✅ Ensure Settings is registered here
      options: {
        title: "Create Profile",
      },
    },
    // Scanner: {
    //   screen: Scanner,
    //   options: ({ navigation }) => ({
    //     presentation: 'modal',
    //     headerRight: () => (
    //       <HeaderButton onPress={navigation.goBack}>
    //         <Text>Close</Text>
    //       </HeaderButton>
    //     ),
    //   }),
    // },
    Scanner: {
      screen: Scanner,  // ✅ Ensure Scanner is properly defined
      options: {
        title: "QR Scanner",
      },
    },
  
    NotFound: {
      screen: NotFound,
      options: {
        title: '404',
      },
      linking: {
        path: '*',
      },
    },
    UpdateProfile: {  // ✅ Add UpdateProfile to navigation
      screen: UpdateProfile,
      options: {
        title: "Edit Profile",
      },
    },
    AdminLogin: { 
      screen: AdminLogin, 
      options: { 
        title: "Admin Login" , 
      } 
    },
    AdminDashboard: { screen: Admin, 
      options: { 
        title: "Admin Dashboard" ,
      } 
    },
  },

});

export const Navigation = createStaticNavigation(RootStack);

// type RootStackParamList = StaticParamList<typeof RootStack>;
type AppStackParamList = StaticParamList<typeof RootStack> & RootStackParamList;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
