import { Component, HostListener, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Main } from './main/main';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Main, CommonModule],
  templateUrl: './app.html',
  styles: [],
})
export class App implements OnInit {
  showSidebar = true;
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const hideOnRoutes = ['/signin', '/signup'];
      this.showSidebar = !hideOnRoutes.includes(event.urlAfterRedirects);
    });
  }
  
  ngOnInit(): void {
    this.isSidebarCollapsed.set(window.innerWidth < 768);
    }
  protected title = 'ExpenseManager';
  screenWidth = signal<number>(window.innerWidth);
  
  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if(this.screenWidth() < 768) {
      this.isSidebarCollapsed.set(true);
    }
  }

  isSidebarCollapsed = signal<boolean>(false);

  changeSidebarState(isSidebarCollapsed: boolean): void{
    this.isSidebarCollapsed.set(isSidebarCollapsed);
  }
}
