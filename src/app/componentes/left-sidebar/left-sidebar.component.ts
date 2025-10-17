import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
})
export class LeftSidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  usuario: any = null;

  items = [
    {
      routeLink: 'dashboard',
      icon: 'fal fa-home',
      label: 'Dashboard',
    },
    {
      routeLink: 'products',
      icon: 'fal fa-box-open',
      label: 'Products',
    },
    {
      routeLink: 'clientes',
      icon: 'fal fa-file',
      label: 'Clientes',
    },
    {
      routeLink: 'settings',
      icon: 'fal fa-cog',
      label: 'Settings',
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
  }

  alternarMenu(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
