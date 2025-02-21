import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { id: string };
  CreateProfile: { qrCode?: string }; 
};

export function Scanner() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Camera access is required to scan QR codes.");
      }
    })();
  }, []);

  // const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
  //   setScanned(true);

  //   try {
  //     const response = await fetch(`http://192.168.56.1:5000/memorial/${data}`);
  //     const result = await response.json();

  //     if (response.ok) {
  //       navigation.navigate('Profile', { id: data });
  //     } else {
  //       Alert.alert('User Not Found', 'This user does not exist. Redirecting to create profile.');
  //       navigation.navigate('CreateProfile', { qrCode: data });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching memorial:', error);
  //     Alert.alert('Error', 'There was an error fetching the profile.');
  //   }
  // };
  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    console.log("Scanned QR Code:", data); // Debugging log

    // ✅ Extract ID from the scanned URL (handles both direct ID and full URL)
    const match = data.match(/(\d+)$/); // Extracts last number from URL
    const profileId = match ? match[1] : data;

    try {
        // ✅ Directly navigate to the Profile screen
        navigation.navigate('Profile', { id: profileId });
    } catch (error) {
        console.error('Error fetching memorial:', error);
        Alert.alert('Error', 'There was an error opening the profile.');
    }
  };


  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
        <Button title="Grant Permission" onPress={() => BarCodeScanner.requestPermissionsAsync()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scan a QR Code</Text>
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  header: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});
