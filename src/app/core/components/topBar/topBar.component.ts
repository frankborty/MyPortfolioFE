import { Component, OnInit, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menubar } from 'primeng/menubar';
import { ImportsModule } from '../../../imports';
import { StatusService } from '../../services/utils/status.service';

@Component({
  selector: 'app-topBar',
  imports: [ImportsModule, ButtonModule, Menubar, RouterModule],
  templateUrl: './topBar.component.html',
  styleUrls: ['./topBar.component.css'],
})
export class TopBarComponent implements OnInit {
  public statusError = signal(false);
  public statusErrorMsg = signal("");
  items: MenuItem[] | undefined;
  constructor(private router: Router, statusService: StatusService) {
    this.statusError = statusService.backEndStatusError;
    this.statusErrorMsg = statusService.backEndStatusErrorMsg;
  }

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
            label: 'Total',
            icon: 'pi pi-th-large',
            route: '/expenses/total',
          },
          {
            label: 'Partial',
            icon: 'pi pi-bolt',
            route: '/expenses/partial',
          }
        ],
      },
      {
        label: 'Assets',
        icon: 'pi pi-briefcase',
        items: [
          {
            label: 'Total',
            icon: 'pi pi-credit-card',
            route: '/assets/total',
          },
          {
            label: 'Financial',
            icon: 'pi pi-sort-alt-slash',
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
