import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<{ Home: undefined; Updates: undefined }>;
  Profile: { id: string };  // ✅ Profile now correctly expects 'id'
  CreateProfile: { qrCode?: string };
  UpdateProfile: { id: string };  // ✅ Ensure "UpdateProfile" is included
  // Settings: undefined;
  Settings: { qrCode?: string } | undefined;  // ✅ Fix: Make params optional
  Scanner: undefined;  // ✅ Ensure Scanner is correctly defined
  NotFound: undefined;
  Admin: undefined;
  AdminLogin: undefined;
  
};
