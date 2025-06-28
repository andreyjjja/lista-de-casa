import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { ShoppingItemCardProps } from '../types';

const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({
  item,
  onToggleComplete,
  onDelete,
}) => {
  const translateX = new Animated.Value(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.setValue(event.translationX);
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        // Swipe para deletar
        Alert.alert(
          'Confirmar exclusão',
          `Deseja remover "${item.item}" da lista?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Deletar', onPress: () => onDelete(item.id), style: 'destructive' },
          ]
        );
      }
      
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    });

  const getItemIcon = (itemName: string) => {
    const name = itemName.toLowerCase();
    
    if (name.includes('fruta') || name.includes('maçã') || name.includes('banana') || name.includes('laranja')) {
      return 'nutrition';
    } else if (name.includes('leite') || name.includes('queijo') || name.includes('iogurte')) {
      return 'cafe';
    } else if (name.includes('pão') || name.includes('arroz') || name.includes('feijão')) {
      return 'restaurant';
    } else if (name.includes('água') || name.includes('refrigerante') || name.includes('suco')) {
      return 'water';
    } else if (name.includes('sabão') || name.includes('detergente') || name.includes('limpeza')) {
      return 'sparkles';
    } else {
      return 'cart';
    }
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={[styles.card, item.comprado && styles.completedCard]}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => onToggleComplete(item.id)}
          >
            <Ionicons
              name={getItemIcon(item.item)}
              size={24}
              color={item.comprado ? '#4CAF50' : '#666'}
            />
          </TouchableOpacity>
          
          <View style={styles.content}>
            <Text style={[styles.itemName, item.comprado && styles.completedText]}>
              {item.item}
            </Text>
            <Text style={styles.quantity}>
              Qtd: {item.quantidade}
            </Text>
            <Text style={styles.addedBy}>
              Adicionado por: {item.adicionadoPor}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => onToggleComplete(item.id)}
          >
            <Ionicons
              name={item.comprado ? 'checkmark-circle' : 'ellipse-outline'}
              size={28}
              color={item.comprado ? '#4CAF50' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedCard: {
    backgroundColor: '#f8f9fa',
    opacity: 0.7,
  },
  iconContainer: {
    marginRight: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  addedBy: {
    fontSize: 12,
    color: '#999',
  },
  checkbox: {
    marginLeft: 12,
  },
});

export default ShoppingItemCard; 