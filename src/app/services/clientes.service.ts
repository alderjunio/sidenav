import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cliente {
  id: number;
  cod_empresa: number;
  cnpj: string;
  razao_social: string;
  fantasia: string;
  situacao: string;
  logradouro: string;
  numero: number;
  complemento: string;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
  atividade_principal: string;
  atividades_secundarias: string;
  email: string;
  telefone: string;
  empresario: string;
  cpf_empresario: string;
  cod_simples: string;
  login_saatri: string;
  pass_saatri: string;
  pass_sefaz: string;
  inscricao_estadual: string;
  pass_suframa: string;
  qsa: string;
  situacao_na_peace: number;
  emite_nfse: number;
  tributacao_id: number;
  inscricao_municipal: string;
  inscricao_suframa: string;
  processo_mensal: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  getByCodEmpresa(cod: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cod_empresa/${cod}`);
  }

  getByNome(nome: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/nome/${nome}`);
  }

  getByCnpj(cnpj: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cnpj/${cnpj}`);
  }

  updateCliente(id: number, dados: Partial<Cliente>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, dados);
  }
}
