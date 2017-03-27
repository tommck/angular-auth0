import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, ReplaySubject } from 'rxjs';
import Auth0LockStatic from 'auth0-lock';
import 'rxjs/add/operator/filter';

import { tokenNotExpired } from 'angular2-jwt';
import { Auth0StorageService } from './auth0.storage.service';

@Injectable()
export class Auth0Service {
    public auth$: ReplaySubject<Auth0AuthResult> = new ReplaySubject<Auth0AuthResult>();
    private logout$: Subject<any> = new Subject();

    constructor(
        private lock: Auth0LockStatic,
        private storage: Auth0StorageService,
        private router: Router) {

        const resumeAuth$ = this.router
            .events
            .filter(event => event.constructor.name === 'NavigationEnd')
            .filter(event => (/access_token|id_token|error/).test(event.url))
            .flatMap(() => this.resumeAuth$())
            .map((authResult: Auth0AuthResult) => {
                return {
                    idToken: authResult.idToken,
                    accessToken: authResult.accessToken,
                    refreshToken: authResult.refreshToken,
                    state: authResult.state,
                    idTokenPayload: authResult.idTokenPayload
                };
            })
            .do(x => this.storage.store('auth_result', x));

        Observable.merge(
            resumeAuth$,
            this.logout$
                .do(() => this.storage.remove('auth_result'))
        ).subscribe(x => this.auth$.next(x));


    }

    init() {
        if (this.authenticated()) {
            this.auth$.next(this.storage.get<Auth0AuthResult>('auth_result'));
        } else {
            this.auth$.next(null);
        }
    }

    login() {
        this.lock.show();
    }

    authenticated() {
        const authResult = this.storage.get<Auth0AuthResult>('auth_result');
        return authResult ? this.tokenNotExpired(null, authResult.idToken) : false;
    }

    logout(remoteLogout?: boolean) {
        this.logout$.next(null);
        if (remoteLogout) {
            this.lock.logout({});
        }
    }

    tokenNotExpired(tokenName?: string, jwt?: string) {
        tokenNotExpired(tokenName, jwt);
    }

    resumeAuth$() {
        return new Observable(observer => {
            this.lock.resumeAuth(window.location.hash, (error, authResult) => {
                if (error) {
                    observer.error(error);
                } else {
                    observer.next(authResult);
                    observer.complete();
                }
            });
        });
    }
}

export interface Auth0AuthResult {
    idToken: string;
    accessToken: string;
    refreshToken: string;
    state: string;
    idTokenPayload: { aud: string, exp: number, iat: number, iss: string, sub: string };
    data: any;
}
