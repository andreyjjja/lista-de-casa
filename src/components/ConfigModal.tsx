import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GitHubConfig } from '../types';
import StorageService from '../services/storageService';
import { testGitHubConnection } from '../utils/testUtils';

interface ConfigModalProps {
  visible: boolean;
  onClose: () => void;
  onConfigSaved: (config: GitHubConfig) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ visible, onClose, onConfigSaved }) => {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('lista-de-casa');
  const [branch, setBranch] = useState('main');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadCurrentConfig();
  }, [visible]);

  const loadCurrentConfig = async () => {
    try {
      const config = await StorageService.loadGitHubConfig();
      if (config) {
        setToken(config.token || '');
        setOwner(config.owner || '');
        setRepo(config.repo || 'lista-de-casa');
        setBranch(config.branch || 'main');
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const handleTestConnection = async () => {
    if (!token || !owner || !repo) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setTesting(true);
    try {
      const config = { token, owner, repo, branch, path: 'lista-compras.xlsx' };
      const isConnected = await testGitHubConnection(config);
      
      if (isConnected) {
        Alert.alert('Sucesso', 'Conexão com GitHub estabelecida com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao GitHub. Verifique suas credenciais.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao testar conexão. Verifique sua conexão com a internet.');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!token || !owner || !repo) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const config: GitHubConfig = {
        token,
        owner,
        repo,
        path: 'lista-compras.xlsx',
        branch,
      };

      await StorageService.saveGitHubConfig(config);
      onConfigSaved(config);
      onClose();
      Alert.alert('Sucesso', 'Configuração salva com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar configuração.');
    }
  };

  const handleCancel = () => {
    setToken('');
    setOwner('');
    setRepo('lista-de-casa');
    setBranch('main');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Configurar GitHub</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Configure suas credenciais do GitHub para sincronizar a lista de compras.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Token de Acesso *</Text>
            <TextInput
              style={styles.input}
              value={token}
              onChangeText={setToken}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              placeholderTextColor="#999"
              secureTextEntry={true}
            />
            <Text style={styles.helpText}>
              Obtenha em: GitHub Settings → Developer settings → Personal access tokens
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuário GitHub *</Text>
            <TextInput
              style={styles.input}
              value={owner}
              onChangeText={setOwner}
              placeholder="seu-usuario-github"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Repositório *</Text>
              <TextInput
                style={styles.input}
                value={repo}
                onChangeText={setRepo}
                placeholder="lista-de-casa"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Branch</Text>
              <TextInput
                style={styles.input}
                value={branch}
                onChangeText={setBranch}
                placeholder="main"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.testButton} 
              onPress={handleTestConnection}
              disabled={testing}
            >
              {testing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="wifi" size={20} color="#fff" />
              )}
              <Text style={styles.testButtonText}>
                {testing ? 'Testando...' : 'Testar Conexão'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="save" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    marginBottom: 16,
  },
  testButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ConfigModal; 