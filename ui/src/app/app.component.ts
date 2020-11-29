import { Component } from '@angular/core';
import { AppService } from './app.service';

interface NavItem {
    link: string;
    name: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title: string = '';

    readonly navItems: NavItem[] = [
        { link: '/menu', name: 'Menu' },
        { link: '/order', name: 'Orders' },
        { link: '/admin', name: 'Admins' },
        { link: '/waiter', name: 'Waiters' },
    ];

  constructor(private appService: AppService) {
    this.appService.setupRootComponent(this);
  }

}
