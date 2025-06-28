// Exemplo de configuração do GitHub
// Copie este arquivo para github.ts e preencha com seus dados

export const GITHUB_CONFIG = {
  // Token de acesso pessoal do GitHub
  // Obtenha em: https://github.com/settings/tokens
  token: '',
  
  // Seu nome de usuário do GitHub
  owner: 'andreyjjja',
  
  // Nome do repositório (deve ser público)
  repo: 'lista-de-casa',
  
  // Caminho do arquivo Excel no repositório
  path: 'lista-compras.xlsx',
  
  // Branch do repositório (geralmente 'main' ou 'master')
  branch: 'main'
};

// Instruções para obter o token:
// 1. Vá para https://github.com/settings/tokens
// 2. Clique em "Generate new token (classic)"
// 3. Dê um nome ao token (ex: "Lista de Casa App")
// 4. Selecione a permissão "repo" (acesso completo aos repositórios)
// 5. Clique em "Generate token"
// 6. Copie o token gerado e cole no campo 'token' acima
// 7. Salve o arquivo como github.ts

// ⚠️ IMPORTANTE: Nunca compartilhe seu token ou commite este arquivo no Git!
// O arquivo github.ts deve estar no .gitignore 

// ⚠️ ATENÇÃO: Se você já committou seu token no histórico do GitHub, siga estas instruções para removê-lo:

// 1. Faça backup do seu repositório (opcional, mas recomendado)
// git clone --mirror https://github.com/andreyjjja/lista-de-casa.git lista-de-casa-mirror
// cd lista-de-casa-mirror

// 2. Rode o BFG para remover todos os tokens do tipo 'ghp_'
// java -jar ../bfg.jar --replace-text <(echo 'ghp_==REMOVED') .

// 3. Limpe e compacte o repositório
// git reflog expire --expire=now --all && git gc --prune=now --aggressive

// 4. Force o push para o GitHub
// git push --force