import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Avatar = ({ name, size = 30, backgroundColor = '#ccc' }) => {
  const initials = name ? name.split(' ').map(part => part[0]).join('').toUpperCase() : '';
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
      <Text style={[styles.text, { fontSize: size / 2 }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Avatar;