import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface Dish {
    id: string;
    name: string;
    unit: string;
    price: number;
}

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
    dataSource: MatTableDataSource<Dish> = new MatTableDataSource<Dish>();

    currentModel: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        unit: new FormControl('', [Validators.required, Validators.minLength(1)]),
        price: new FormControl(0.0, [Validators.required, Validators.min(0.000001), Validators.max(999999999.999999)])
    });

    dishToBuy: Dish | undefined;
    makeOrderModel: FormControl = new FormControl(1, [Validators.min(1), Validators.required]);

    @ViewChild('manageEntityDialog') private manageEntityDialogRef!: TemplateRef<HTMLElement>;
    @ViewChild('enterCount') private enterCountRef!: TemplateRef<HTMLElement>;

    dialogMode: 'add' | 'edit' = 'add';

    private subs: Subscription[] = [];

    constructor(private appService: AppService, private matDialog: MatDialog) {
        appService.setAppConfig({ title: 'Menu' });
    }

    ngOnInit(): void {
        this.subs.push(
            this.appService.apiRequest({ url: 'dishes', method: 'GET' }).subscribe(resp => {
                this.dataSource.data = resp?.dishes ?? [];
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub?.unsubscribe());
    }

    openDialog(mode: 'add'): void;
    openDialog(mode: 'edit', model: Dish): void;
    openDialog(mode: 'edit' | 'add', model?: Dish): void {
        this.currentModel.reset(model || { name: '', unit: '', price: 0.0 });
        this.dialogMode = mode;
        this.subs.push(
            this.matDialog
                .open(this.manageEntityDialogRef, { width: '500px' })
                .afterClosed()
                .pipe(filter(value => !!value))
                .subscribe((): void => {
                    switch (mode) {
                        case 'add':
                            this.subs.push(
                                this.appService.apiRequest({
                                    url: 'dishes',
                                    method: 'POST',
                                    body: this.currentModel.value
                                }).subscribe(({ id }) => {
                                    this.dataSource.data = [...this.dataSource.data, { id, ...this.currentModel.value }];
                                })
                            );
                            break;
                        case 'edit':
                            this.subs.push(
                                this.appService.apiRequest({
                                    url: 'dishes',
                                    method: 'PUT',
                                    body: { id: model?.id, ...this.currentModel.value }
                                }).subscribe(() => {
                                    // @ts-ignore
                                    model.name = this.currentModel.value.name;
                                    // @ts-ignore
                                    model.price = this.currentModel.value.price;
                                    // @ts-ignore
                                    model.unit = this.currentModel.value.unit;
                                }));
                            break;
                    }
                })
        );
    }

    deleteEntity(record: Dish): void {
        this.appService.openConfirmDialog({
                message: `Delete "${ record.name }" dish`,
                onSuccess: () =>
                    this.subs.push(this.appService.apiRequest({ method: 'DELETE', url: `dishes/${ record.id }` }).subscribe(() =>
                        this.dataSource.data = this.dataSource.data.filter(({ id }) => id !== record.id)
                    ))
            }
        );
    }

    makeOrder(record: Dish): void {
        this.dishToBuy = record;
        this.makeOrderModel.reset();
        this.subs.push(
            this.matDialog
                .open(this.enterCountRef, { width: '500px' })
                .afterClosed()
                .pipe(filter(value => !!value))
                .subscribe((): void => {

                    this.subs.push(this.appService.apiRequest({
                        method: 'POST', url: `orders`, body: {
                            dishes: [{ count: this.makeOrderModel.value, dish: this.dishToBuy?.id }]
                        }
                    }).subscribe(() =>
                        this.dataSource.data = this.dataSource.data.filter(({ id }) => id !== record.id)
                    ));
                })
        );
    }
}
