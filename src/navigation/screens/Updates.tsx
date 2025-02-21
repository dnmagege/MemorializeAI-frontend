import React from 'react';
import { Text, StyleSheet, View, Linking, TouchableOpacity } from 'react-native';

export function Updates() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Want to Contasct Us! The links will work as follows:</Text>

      {/* WhatsApp Link */}
      <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/1234567890')}>
        <Text style={styles.link}>📞 WhatsApp: +1234567890</Text>
      </TouchableOpacity>

      {/* Email Link */}
      <TouchableOpacity onPress={() => Linking.openURL('mailto:example@email.com')}>
        <Text style={styles.link}>📧 Email: example@email.com</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

