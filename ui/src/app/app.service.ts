import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import type { AppComponent } from './app.component';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
    message: string;
}

export interface ConfirmDialogConfig {
    message: string;
    onSuccess: () => void;
    onFail?: () => void;
}

export interface AppConfig {
    title: string;
}

@Component({
    template: `
        <h1 mat-dialog-title>Confirm</h1>
        <div mat-dialog-content>
            <p>{{ data.message }}</p>
        </div>
        <div mat-dialog-actions>
            <button mat-button [mat-dialog-close]="false">No</button>
            <button mat-button [mat-dialog-close]="true">Yes</button>
        </div>
    `
})
export class ConfirmDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private rootComponent: AppComponent | undefined;
    constructor(private http: HttpClient, private matDialog: MatDialog) {}

    apiRequest(options: { url: string; method: string, body?: object }): Observable<any> {
        return this.http
            .request(options.method, `http://127.0.0.1:3000/${ options.url }`, {
                body: options.body,
                observe: 'body',
                responseType: 'json'
            });
    }

    setAppConfig(config: AppConfig): void {
        if (this.rootComponent) {
            this.rootComponent.title = config.title;
        }
    }


    setupRootComponent(comp: AppComponent): void {
        this.rootComponent = comp;
    }

    openConfirmDialog(config: ConfirmDialogConfig): void {
        const dialogRef: MatDialogRef<ConfirmDialogComponent, any> = this.matDialog.open(ConfirmDialogComponent, {
            data: {
                message: config.message
            }
        });
        dialogRef.afterClosed().subscribe((result: any | undefined): void => {
            if (result) {
                config.onSuccess();
            }
            if (!result && !!config.onFail) {
                config.onFail();
            }
        });
    }
}
