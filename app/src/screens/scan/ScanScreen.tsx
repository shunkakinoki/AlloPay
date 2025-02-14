import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { BarCodeScanningResult, Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Box } from '~/components/layout/Box';
import { Button, Title } from 'react-native-paper';
import { AddrLink, parseAddrLink } from '~/util/addrLink';
import { RootNavigatorScreenProps } from '~/navigation/RootNavigator';
import { Overlay } from './Overlay';

export type ScanScreenParams = {
  onScan: (link: AddrLink) => void;
};

export type ScanScreenProps = RootNavigatorScreenProps<'Scan'>;

export const ScanScreen = ({ route, navigation }: ScanScreenProps) => {
  const { onScan } = route.params;

  const [hasPermission, setHasPermission] = useState(false);
  const [canAskAgain, setCanAskAgain] = useState(false);
  const requestPermissions = useCallback(async () => {
    const { granted, canAskAgain } =
      await Camera.requestCameraPermissionsAsync();

    setHasPermission(granted);
    setCanAskAgain(canAskAgain);
  }, []);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  const [scanned, setScanned] = useState(false);
  const handleScanned = ({ data }: BarCodeScanningResult) => {
    try {
      const addrLink = parseAddrLink(data);
      setScanned(true);
      onScan(addrLink);
      navigation.goBack();
    } catch (e) {
      // The correct QR wasn't scanned, do nothing
    }
  };

  if (!hasPermission) {
    return (
      <Box flex={1} vertical center m={3}>
        <Title style={{ textAlign: 'center' }}>
          Please grant camera permissions in order to scan a QR code
        </Title>
        {canAskAgain && <Button onPress={requestPermissions}>Grant</Button>}
      </Box>
    );
  }

  return (
    <Camera
      onBarCodeScanned={!scanned ? handleScanned : undefined}
      barCodeScannerSettings={{
        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
      }}
      style={StyleSheet.absoluteFill}
      ratio="16:9"
    >
      <Overlay />
    </Camera>
  );
};
