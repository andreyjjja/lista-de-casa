import { ShoppingItem } from '../types';

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getItemIcon = (itemName: string): string => {
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

export const sortItems = (items: ShoppingItem[]): ShoppingItem[] => {
  return items.sort((a, b) => {
    // Primeiro, itens não comprados
    if (!a.comprado && b.comprado) return -1;
    if (a.comprado && !b.comprado) return 1;
    
    // Depois, por data de adição (mais recentes primeiro)
    return new Date(b.dataAdicao).getTime() - new Date(a.dataAdicao).getTime();
  });
};

export const validateItem = (item: Partial<ShoppingItem>): boolean => {
  return !!(item.item && item.item.trim() && item.quantidade && item.quantidade > 0);
}; 