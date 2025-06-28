import axios from 'axios';
import * as XLSX from 'xlsx';
import { GitHubConfig, ExcelData, ShoppingItem } from '../types';

class GitHubService {
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  // Baixar o arquivo Excel do GitHub
  async downloadExcelFile(): Promise<ExcelData> {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${this.config.owner}/${this.config.repo}/${this.config.branch}/${this.config.path}`;
      
      const response = await axios.get(rawUrl, {
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3.raw'
        }
      });

      const workbook = XLSX.read(response.data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      
      if (!sheetName) {
        throw new Error('Nenhuma planilha encontrada no arquivo Excel');
      }
      
      const worksheet = workbook.Sheets[sheetName];
      
      if (!worksheet) {
        throw new Error('Planilha não encontrada no arquivo Excel');
      }
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const items: ShoppingItem[] = jsonData.map((row: any) => ({
        id: row.id || this.generateId(),
        item: row.Item || row.item || '',
        quantidade: parseInt(row.Quantidade || row.quantidade || '1'),
        comprado: row.Comprado === 'true' || row.Comprado === true,
        dataAdicao: row['Data Adição'] || row.dataAdicao || new Date().toISOString(),
        adicionadoPor: row['Adicionado Por'] || row.adicionadoPor || 'Família'
      }));

      return {
        items,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao baixar arquivo Excel:', error);
      // Retorna dados vazios se o arquivo não existir
      return {
        items: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // Fazer upload do arquivo Excel para o GitHub
  async uploadExcelFile(data: ExcelData): Promise<boolean> {
    try {
      // Criar workbook
      const workbook = XLSX.utils.book_new();
      
      // Preparar dados para o Excel
      const excelData = data.items.map(item => ({
        'ID': item.id,
        'Item': item.item,
        'Quantidade': item.quantidade,
        'Comprado': item.comprado ? 'true' : 'false',
        'Data Adição': item.dataAdicao,
        'Adicionado Por': item.adicionadoPor
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Compras');

      // Gerar buffer do arquivo
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      const base64Content = Buffer.from(excelBuffer).toString('base64');

      // Verificar se o arquivo já existe
      const fileExists = await this.checkFileExists();
      
      if (fileExists) {
        // Atualizar arquivo existente
        await this.updateFile(base64Content);
      } else {
        // Criar novo arquivo
        await this.createFile(base64Content);
      }

      return true;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo Excel:', error);
      return false;
    }
  }

  private async checkFileExists(): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.path}`,
        {
          headers: {
            'Authorization': `token ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  private async getFileSha(): Promise<string> {
    const response = await axios.get(
      `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.path}`,
      {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    return response.data.sha;
  }

  private async updateFile(content: string): Promise<void> {
    const sha = await this.getFileSha();
    
    await axios.put(
      `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.path}`,
      {
        message: `Atualizar lista de compras - ${new Date().toLocaleString('pt-BR')}`,
        content: content,
        sha: sha,
        branch: this.config.branch
      },
      {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
  }

  private async createFile(content: string): Promise<void> {
    await axios.put(
      `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.path}`,
      {
        message: `Criar lista de compras - ${new Date().toLocaleString('pt-BR')}`,
        content: content,
        branch: this.config.branch
      },
      {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

export default GitHubService; 