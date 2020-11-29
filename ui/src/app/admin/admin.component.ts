import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';

interface Admin {
    id: string;
    name: string;
    password: string;
}

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit, OnDestroy {
    dataSource: MatTableDataSource<Admin> = new MatTableDataSource<Admin>();

    currentModel: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    });

    @ViewChild('manageEntityDialog') manageEntityDialogRef!: TemplateRef<HTMLElement>;

    dialogMode: 'add' | 'edit' = 'add';

    private subs: Subscription[] = [];

    constructor(private appService: AppService, private matDialog: MatDialog) {
        appService.setAppConfig({ title: 'Admins' });
    }

    ngOnInit(): void {
        this.subs.push(
            this.appService.apiRequest({ url: 'admins', method: 'GET' }).subscribe(resp => {
                this.dataSource.data = resp?.admins ?? [];
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub?.unsubscribe());
    }

    openDialog(mode: 'edit' | 'add', model?: Admin): void {
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
                                    url: 'admins',
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
                                    url: 'admins',
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

    deleteEntity(record: Admin): void {
        this.appService.openConfirmDialog({
                message: `Delete "${ record.name }" admin`,
                onSuccess: () =>
                    this.subs.push(this.appService.apiRequest({ method: 'DELETE', url: `admins/${ record.id }` }).subscribe(() =>
                        this.dataSource.data = this.dataSource.data.filter(({ id }) => id !== record.id)
                    ))
            }
        );
    }
}
