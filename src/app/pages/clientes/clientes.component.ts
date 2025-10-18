import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService, Cliente } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css', './clientes.mobile.component.css'],
})
export class ClientesComponent implements AfterViewInit {
  @ViewChild('inputPesquisa') inputPesquisa!: ElementRef;

  searchType: string = 'cod_empresa';
  searchValue: string = '';
  clientes: Cliente[] = [];
  clienteSelecionado: Cliente | null = null;
  loading = false;
  error = '';

  // 🆕 Variáveis para o modal
  showModal = false;
  clienteEditando: Partial<Cliente> = {
  cod_empresa: 0,
  razao_social: '',
  fantasia: '',
  cnpj: '',
  telefone: '',
  email: '',
  logradouro: '',
};


  constructor(private clientesService: ClientesService) {}

  // 🧭 Dá foco no campo de pesquisa ao carregar o componente
  ngAfterViewInit() {
    setTimeout(() => this.inputPesquisa?.nativeElement.focus(), 0);
  }

  // 🔍 Busca clientes
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
          this.clientes = res;
        } else if (Array.isArray(res) && res.length === 1) {
          this.clienteSelecionado = res[0];
          this.searchValue = '';
        } else if (res && !Array.isArray(res)) {
          this.clienteSelecionado = res;
          this.searchValue = '';
        } else {
          this.error = 'Nenhum cliente encontrado.';
        }

        setTimeout(() => this.inputPesquisa?.nativeElement.focus(), 0);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erro ao buscar cliente.';
        console.error(err);
      },
    });
  }

  // 📌 Seleciona cliente da lista
  selecionarCliente(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.clientes = [];
    this.searchValue = '';
    setTimeout(() => this.inputPesquisa?.nativeElement.focus(), 0);
  }

  // 🧭 Pressionar Enter executa busca
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    const el = document.activeElement as HTMLElement;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'SELECT')) {
      this.buscarCliente();
    }
  }

  // 🆕 Modal de edição
  abrirModalEdicao() {
    if (!this.clienteSelecionado) return;
    this.showModal = true;
    // Cria uma cópia para editar sem alterar o original
    this.clienteEditando = { ...this.clienteSelecionado };
  }

  fecharModal() {
    this.showModal = false;
  }

  salvarEdicao() {
  if (this.clienteSelecionado && this.clienteEditando) {
    this.clientesService.updateCliente(this.clienteSelecionado.cod_empresa, this.clienteEditando)
      .subscribe({
        next: () => {
          alert('Cliente atualizado com sucesso!');
          this.clienteSelecionado = { ...this.clienteSelecionado, ...this.clienteEditando } as Cliente;
          this.fecharModal();
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao atualizar cliente');
        }
      });
  }
}

}
