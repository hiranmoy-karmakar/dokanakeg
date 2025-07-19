import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

const PhonePad = () => {
  const [input, setInput] = useState('');

  const handlePress = (value) => {
    setInput(prev => prev + value);
  };

  const handleDelete = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const renderButton = (label, onPress = () => handlePress(label)) => (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={!label}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={input}
        editable={false}
        placeholder="Enter number"
        keyboardType="numeric"
      />

      <View style={styles.pad}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item) => renderButton(item))}
          </View>
        ))}
        <View style={styles.row}>
          {renderButton('')} {/* blank * button */}
          {renderButton('0')}
          {renderButton('⌫', handleDelete)} {/* backspace */}
        </View>
      </View>
    </View>
  );
};

export default PhonePad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    height: 60,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    marginBottom: 20,
    borderRadius: 10,
  },
  pad: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  button: {
    width: 80,
    height: 80,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 28,
    color: '#333',
  },
});
