import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  email: string;
  telefone: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = 'http://localhost:3333/api/clientes';

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
}
