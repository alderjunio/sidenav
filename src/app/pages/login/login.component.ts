import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  entrar() {
    console.log('Método entrar() chamado', this.email, this.senha);
    this.loading = true;
    this.erro = '';

    if (!this.email || !this.senha) {
      this.erro = 'Preencha email e senha.';
      this.loading = false;
      return;
    }

    this.authService.login(this.email, this.senha).subscribe({
      next: (res) => {
        console.log('Login bem-sucedido:', res);

        // 👇 Garante que o usuário e o token sejam capturados corretamente
        const usuario = res.usuario || res.user || res?.data?.usuario || null;

        if (usuario) {
          console.log('🟢 Usuário salvo no localStorage:', usuario);
          this.authService.setSession(res.token, usuario);
        } else {
          console.warn('⚠️ Nenhum usuário retornado no login');
        }

        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erro no login', err);
        this.erro = 'Email ou senha inválidos.';
        this.loading = false;
      }
    });
  }
}
