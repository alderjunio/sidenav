import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService, Cliente } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent {
  searchType: string = 'cod_empresa'; // padrão
  searchValue: string = '';
  clientes: Cliente[] = [];
  clienteSelecionado: Cliente | null = null;
  loading = false;
  error = '';

  constructor(private clientesService: ClientesService) {}

  // 🔍 Executa a busca de clientes conforme o tipo selecionado
  buscarCliente() {
    this.error = '';
    this.loading = true;
    this.clienteSelecionado = null;
    this.clientes = [];

    const valor = this.searchValue.trim();
    if (!valor) {
      this.error = 'Digite um valor para pesquisar.';
      this.loading = false;
      return;
    }

    let request$;

    switch (this.searchType) {
      case 'cod_empresa':
        request$ = this.clientesService.getByCodEmpresa(valor);
        break;
      case 'nome':
        request$ = this.clientesService.getByNome(valor);
        break;
      case 'cnpj':
        request$ = this.clientesService.getByCnpj(valor);
        break;
      default:
        request$ = this.clientesService.getByCodEmpresa(valor);
    }

    request$.subscribe({
      next: (res) => {
        this.loading = false;

        if (Array.isArray(res) && res.length > 1) {
          // Vários clientes encontrados
          this.clientes = res;
        } else if (Array.isArray(res) && res.length === 1) {
          // Um único cliente retornado (lista com 1)
          this.clienteSelecionado = res[0];
          this.searchValue = ''; // limpa campo
        } else if (res && !Array.isArray(res)) {
          // Um único objeto retornado
          this.clienteSelecionado = res;
          this.searchValue = ''; // limpa campo
        } else {
          this.error = 'Nenhum cliente encontrado.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erro ao buscar cliente.';
        console.error(err);
      },
    });
  }

  // 📌 Seleciona cliente de uma lista (ao clicar no card)
  selecionarCliente(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.clientes = [];
    this.searchValue = ''; // limpa campo
  }

  // ⌨️ Pressionar Enter executa a busca
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    const el = document.activeElement as HTMLElement;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'SELECT')) {
      this.buscarCliente();
    }
  }
}
