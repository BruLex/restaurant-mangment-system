import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';


interface Waiter {
  id: string;
  name: string;
  password: string;
}

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html'
})
export class WaiterComponent implements OnInit, OnDestroy {
    dataSource: MatTableDataSource<Waiter> = new MatTableDataSource<Waiter>();

    currentModel: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    });

    @ViewChild('manageEntityDialog') manageEntityDialogRef!: TemplateRef<HTMLElement>;

    dialogMode: 'add' | 'edit' = 'add';

    private subs: Subscription[] = [];

    constructor(private appService: AppService, private matDialog: MatDialog) {
        appService.setAppConfig({ title: 'Waiters' });
    }

    ngOnInit(): void {
        this.subs.push(
            this.appService.apiRequest({ url: 'waiters', method: 'GET' }).subscribe(resp => {
                this.dataSource.data = resp?.waiters ?? [];
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub?.unsubscribe());
    }

    openDialog(mode: 'edit' | 'add', model?: Waiter): void {
        this.currentModel.reset(model || { name: '', password: '' });
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
                                    url: 'waiters',
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
                                    url: 'waiters',
                                    method: 'PUT',
                                    body: { id: model?.id, ...this.currentModel.value}
                                }).subscribe(resp => {
                                    // tslint:disable-next-line:no-non-null-assertion
                                    model!.name = this.currentModel.value.name;
                                    // tslint:disable-next-line:no-non-null-assertion
                                    model!.password = this.currentModel.value.password;
                                }));
                            break;
                    }
                })
        );
    }

    deleteEntity(record: Waiter): void {
        this.appService.openConfirmDialog({
                message: `Delete "${ record.name }" waiter`,
                onSuccess: () =>
                    this.subs.push(this.appService.apiRequest({ method: 'DELETE', url: `waiters/${ record.id }` }).subscribe(() =>
                        this.dataSource.data = this.dataSource.data.filter(({ id }) => id !== record.id)
                    ))
            }
        );
    }
}
