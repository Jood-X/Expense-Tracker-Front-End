import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css'
})
export class Sidebar {
    isSidebarCollapsed = input.required<boolean>();
    changeSidebarState = output<boolean>();
    constructor(private router: Router) {}

    items = [
        {
            routeLink: 'dashboard',
            icon: 'fal fa-home',
            label: 'Dashboard',
        },
        {
            routeLink: 'wallet',
            icon: 'fal fa-solid fa-wallet',
            label: 'Wallets',
        },
        {
            routeLink: 'category',
            icon: 'fal fa-solid fa-icons',
            label: 'Categories',
        },
        {
            routeLink: 'transaction',
            icon: 'fal fa-solid fa-money-bill-wave', 
            label: 'Transactions',
        },
        {
            routeLink: 'recurrings',
            icon: 'fal fa-solid fa-repeat',
            label: 'Recurrings',
        },
        {
            routeLink: 'logout',
            icon: 'fal fa-solid fa-arrow-right',
            label: 'Log Out',
        }
    ];
    toggleSidebar() {
        this.changeSidebarState.emit(!this.isSidebarCollapsed());
    }
    closeSidebar() {
        this.changeSidebarState.emit(true);
    }
    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/signin']);
    }
}