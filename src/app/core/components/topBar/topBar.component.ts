import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menubar } from 'primeng/menubar';
import { ImportsModule } from '../../../imports';

@Component({
  selector: 'app-topBar',
  imports: [ImportsModule, ButtonModule, Menubar, RouterModule],
  templateUrl: './topBar.component.html',
  styleUrls: ['./topBar.component.css'],
})
export class TopBarComponent implements OnInit {
  items: MenuItem[] | undefined;
  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Income',
        icon: 'pi pi-dollar',
        route: '/income',
      },
      {
        label: 'Expenses',
        icon: 'pi pi-money-bill',
        items: [
          {
            label: 'Partial',
            icon: 'pi pi-bolt',
            route: '/expenses/partial',
          },
          {
            label: 'Total',
            icon: 'pi pi-th-large',
            route: '/expenses/total',
          },
        ],
      },
      {
        label: 'Assets',
        icon: 'pi pi-briefcase',
        items: [
          {
            label: 'Total',
            icon: 'pi pi-th-large',
            route: '/assets/total',
          },
          {
            label: 'Financial',
            icon: 'pi pi-bolt',
            route: '/assets/financial',
          },
        ],
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        route: '/settings',
      },
    ];
  }
}
