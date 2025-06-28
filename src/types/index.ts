export interface ShoppingItem {
  id: string;
  item: string;
  quantidade: number;
  comprado: boolean;
  dataAdicao: string;
  adicionadoPor: string;
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  path: string;
  branch: string;
}

export interface ExcelData {
  items: ShoppingItem[];
  lastUpdated: string;
}

export interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: Omit<ShoppingItem, 'id' | 'dataAdicao'>) => void;
}

export interface ShoppingItemCardProps {
  item: ShoppingItem;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
} 