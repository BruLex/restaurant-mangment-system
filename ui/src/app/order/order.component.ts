import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

interface Dish {
    id: string;
    name: string;
    unit: string;
    price: number;
}

interface DishOrder {
    dish: Dish;
    count: number;
}

interface Order {
    dishes: DishOrder[];
}

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
    dataSource: MatTableDataSource<Dish> = new MatTableDataSource<Dish>();

    @ViewChild('manageEntityDialog') manageEntityDialogRef!: TemplateRef<HTMLElement>;

    private subs: Subscription[] = [];

    constructor(private appService: AppService, private matDialog: MatDialog) {
        appService.setAppConfig({ title: 'Orders' });
    }

    ngOnInit(): void {
        this.subs.push(
            this.appService.apiRequest({ url: 'orders', method: 'GET' }).subscribe(resp => {
                this.dataSource.data = resp ?? [];
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub?.unsubscribe());
    }

    countTotal(order: Order): number {
        return order.dishes.reduce((total, dishOrder) => (total + (dishOrder.count * (dishOrder.dish?.price || 0))), 0);
    }
}
