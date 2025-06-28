# 🚀 Guia de Configuração - Lista de Casa

Este guia irá ajudá-lo a configurar o aplicativo Lista de Casa em seu ambiente de desenvolvimento.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd lista-de-casa
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure o GitHub

#### 3.1 Crie um repositório no GitHub
1. Acesse [GitHub](https://github.com)
2. Clique em "New repository"
3. Nome: `lista-de-casa`
4. Deixe público
5. Clique em "Create repository"

#### 3.2 Gere um token de acesso pessoal
1. Vá para [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Clique em "Generate new token (classic)"
3. Dê um nome ao token (ex: "Lista de Casa App")
4. Selecione a permissão **"repo"** (acesso completo aos repositórios)
5. Clique em "Generate token"
6. **Copie o token** (você não poderá vê-lo novamente!)

#### 3.3 Configure o aplicativo
1. Copie o arquivo de exemplo:
   ```bash
   cp src/config/github.example.ts src/config/github.ts
   ```

2. Edite o arquivo `src/config/github.ts`:
   ```typescript
   export const GITHUB_CONFIG = {
     token: 'SEU_TOKEN_AQUI', // Cole o token que você copiou
     owner: 'seu-usuario-github', // Seu nome de usuário do GitHub
     repo: 'lista-de-casa', // Nome do repositório que você criou
     path: 'lista-compras.xlsx',
     branch: 'main'
   };
   ```

## 🚀 Executando o Aplicativo

### Desenvolvimento
```bash
npm start
# ou
yarn start
```

### Android
```bash
npm run android
# ou
yarn android
```

### iOS
```bash
npm run ios
# ou
yarn ios
```

## 📱 Testando no Dispositivo

### Usando Expo Go
1. Instale o app **Expo Go** no seu dispositivo
2. Execute `npm start`
3. Escaneie o QR code com o Expo Go

### Usando Emulador
- **Android**: Instale o Android Studio e configure um emulador
- **iOS**: Instale o Xcode (apenas macOS)

## 🔧 Configuração Avançada

### Configuração via App
1. Abra o aplicativo
2. Toque no ícone de configurações (⚙️) no cabeçalho
3. Preencha as informações do GitHub
4. Toque em "Testar Conexão"
5. Salve a configuração

### Personalização
- **Cores**: Edite os arquivos de estilo nos componentes
- **Ícones**: Modifique a função `getItemIcon` em `ShoppingItemCard.tsx`
- **Intervalos**: Ajuste os tempos em `src/config/environment.ts`

## 🧪 Testes

### Executar testes
```bash
npm test
# ou
yarn test
```

### Testar funcionalidades
1. **Adicionar item**: Toque no botão "+" e adicione um item
2. **Marcar como comprado**: Toque no checkbox do item
3. **Deletar item**: Faça swipe para a esquerda no item
4. **Sincronizar**: Toque no ícone de refresh
5. **Configurar**: Toque no ícone de configurações

## 🐛 Solução de Problemas

### Erro de conexão com GitHub
- Verifique se o token está correto
- Confirme se o repositório existe e é público
- Verifique as permissões do token (deve ter "repo")

### Erro de build
```bash
# Limpar cache
expo start -c

# Reinstalar dependências
rm -rf node_modules
npm install
```

### Erro de gestos
- Certifique-se de que o `react-native-gesture-handler` está configurado
- Reinicie o app se necessário

### Token expirado
- Gere um novo token no GitHub
- Atualize a configuração no app

## 📦 Build para Produção

### Configurar EAS
```bash
npm install -g @expo/eas-cli
eas login
eas build:configure
```

### Build Android
```bash
eas build --platform android
```

### Build iOS
```bash
eas build --platform ios
```

## 🔒 Segurança

- ⚠️ **Nunca** commite o arquivo `src/config/github.ts`
- ⚠️ **Nunca** compartilhe seu token do GitHub
- ✅ O arquivo está no `.gitignore` por segurança
- ✅ Use tokens com permissões mínimas necessárias

## 📞 Suporte

Se você encontrar problemas:

1. Verifique se seguiu todos os passos do guia
2. Consulte a seção "Solução de Problemas"
3. Abra uma issue no repositório do GitHub
4. Verifique os logs do console para erros específicos

## 🎉 Próximos Passos

Após a configuração inicial:

1. **Teste todas as funcionalidades**
2. **Personalize o design** se desejar
3. **Configure notificações** (opcional)
4. **Adicione mais membros da família**
5. **Compartilhe o app** com sua família

---

**🎯 Agora você está pronto para usar o Lista de Casa!** 