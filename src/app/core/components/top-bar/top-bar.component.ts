import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Badge } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Menubar } from 'primeng/menubar';
import { Router, RouterModule } from '@angular/router';
import { ImportsModule } from '../../../imports';

@Component({
  selector: 'app-top-bar',
  imports: [ImportsModule, ButtonModule, Menubar, RouterModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent implements OnInit {
  items: MenuItem[] | undefined;
  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
            {
                label: 'Income',
                icon: 'pi pi-dollar',
                route: '/income'
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
                ]
            },
            {
                label: 'Assets',
                icon: 'pi pi-briefcase',
                route: '/assets'
            },

            


        ];
    }
}
