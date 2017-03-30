import {
    inject,
    TestBed
} from '@angular/core/testing';

import { Auth0Service } from './auth0.service';
import { Auth0StorageService } from './auth0.storage.service';
import Auth0LockStatic from 'auth0-lock';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as angular2Jwt from 'angular2-jwt';

describe('Auth0 service', () => {
    const events = new Subject<{}>();

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            { provide: Router, useValue: { events: events } },
            { provide: Auth0StorageService, useValue: { store: () => {}, get: () => {}, remove: () => {} } },
            { provide: Auth0LockStatic, useValue: { show: () => {}, logout: () => {}, resumeAuth: () => {} } },
            Auth0Service
        ]}));

    it('should exist', inject([ Auth0Service ], (service: Auth0Service) => {
        expect(service).toBeTruthy();
    }));

    describe('auth$', () => {
        it('should emit initial authentication data when authenticated', inject([
            Auth0Service,
            Auth0StorageService
        ], (service: Auth0Service, storage: Auth0StorageService) => {

            const expectedAuthResult = {
                prop: 'val'
            };
            let authResult;

            spyOn(storage, 'get').and.returnValue(expectedAuthResult);
            spyOn(service, 'authenticated').and.returnValue(true);

            service.auth$.subscribe(x => authResult = x);
            service.init();

            expect(authResult).toEqual(expectedAuthResult);
        }));

        it('should emit null when not authenticated', inject([
            Auth0Service,
            Auth0StorageService
        ], (service: Auth0Service, storage: Auth0StorageService) => {

            const expectedAuthResult = {};
            let authResult;

            spyOn(storage, 'get').and.returnValue(expectedAuthResult);
            spyOn(service, 'authenticated').and.returnValue(false);

            service.auth$.subscribe(x => authResult = x);
            service.init();

            expect(authResult).toBeNull();
        }));

        it('should emit on route', inject([
            Auth0Service,
            Router,
            Auth0StorageService
        ], (service: Auth0Service, router: Router, storage: Auth0StorageService) => {
            const expectedAuthResult = {
                idToken: '',
                accessToken: '',
                refreshToken: '',
                state: '',
                idTokenPayload: undefined
            };
            let authResult;

            spyOn(service, 'resumeAuth$').and.returnValue(Observable.of(expectedAuthResult));
            spyOn(storage, 'store').and.stub();

            service.auth$.subscribe(x => authResult = x);
            events.next({
                constructor: {
                    name: 'NavigationEnd'
                },
                url: 'access_token'
            });

            expect(authResult).toEqual(expectedAuthResult);
        }));
    });

    describe('resumeAuth$', () => {
        it('should emit and complete when `lock.resumeAuth()` calls the callback fn', inject([
            Auth0Service,
            Auth0LockStatic
        ], (service: Auth0Service, lock: Auth0LockStatic) => {

            const expectedAuthResult = {
                idToken: '',
                accessToken: '',
                refreshToken: '',
                state: '',
                idTokenPayload: undefined
            };

            spyOn(lock, 'resumeAuth').and.callFake((hash, cb) => {
                cb(null, expectedAuthResult);
            });

            let result,
                isCompleted;
            service.resumeAuth$()
                .subscribe(x => result = x, undefined, () => isCompleted = true);

            expect(result).toBe(expectedAuthResult);
            expect(isCompleted).toBe(true);
        }));

        it('should error when `lock.resumeAuth()` calls the callback fn with an `error` argument', inject([
            Auth0Service,
            Auth0LockStatic
        ], (service: Auth0Service, lock: Auth0LockStatic) => {

            const expectedAuthResult = {
                idToken: '',
                accessToken: '',
                refreshToken: '',
                state: '',
                idTokenPayload: undefined
            };

            spyOn(lock, 'resumeAuth').and.callFake((hash, cb) => {
                cb('error', expectedAuthResult);
            });

            let hasErrored = false;
            service.resumeAuth$()
                .subscribe(undefined, () => hasErrored = true);

            expect(hasErrored).toBe(true);
        }));
    });

    describe('login', () => {
        it('should call `Auth0LockStatic.show()`', inject([
            Auth0Service,
            Auth0LockStatic
        ], (service: Auth0Service, lock: Auth0LockStatic) => {


            spyOn(lock, 'show').and.stub();

            service.login();

            expect(lock.show).toHaveBeenCalled();
        }));
    });

    describe('logout', () => {
        it('should make `auth$` emit `null`', inject([
            Auth0Service,
            Auth0LockStatic
        ], (service: Auth0Service, lock: Auth0LockStatic) => {

            let authResult;

            service.auth$.subscribe(x => authResult = x);

            service.logout();

            expect(authResult).toBeNull();
        }));

        it('should call `Auth0LockStatic.logout()` on remoteAuth = true', inject([
            Auth0Service,
            Auth0LockStatic
        ], (service: Auth0Service, lock: Auth0LockStatic) => {
            spyOn(lock, 'logout').and.stub();

            service.logout(true);

            expect(lock.logout).toHaveBeenCalled();
        }));

        it('should remove `auth_result` from `Auth0StorageService`', inject([
            Auth0Service,
            Auth0StorageService
        ], (service: Auth0Service, storage: Auth0StorageService) => {
            spyOn(storage, 'remove').and.stub();

            service.logout();

            expect(storage.remove).toHaveBeenCalled();
        }));
    });

    describe('authenticated', () => {
        it('should return `false` if no `auth_result` was found`', inject([
            Auth0Service,
            Auth0StorageService
        ], (service: Auth0Service, storage: Auth0StorageService) => {

            spyOn(storage, 'get').and.returnValue(null);

            expect(service.authenticated()).toBe(false);
        }));

        it('should call `tokenNotExpired` when `auth_result` was found`', inject([
            Auth0Service,
            Auth0StorageService
        ], (service: Auth0Service, storage: Auth0StorageService) => {
            const authResult = {};
            spyOn(storage, 'get').and.returnValue(authResult);
            spyOn(angular2Jwt, 'tokenNotExpired').and.stub();

            service.authenticated();

            expect(angular2Jwt.tokenNotExpired).toHaveBeenCalled();
        }));

        it('should return false when an expired `auth_result` was found`', inject([
            Auth0Service,
            Auth0StorageService
        ], (service: Auth0Service, storage: Auth0StorageService) => {
            const authResult = {};
            spyOn(storage, 'get').and.returnValue(authResult);
            spyOn(service, 'tokenNotExpired').and.returnValue(false);

            expect(service.authenticated()).toBe(false);
        }));

        it('should return true when a not-expired `auth_result` was found`', inject([
            Auth0Service,
            Auth0StorageService
        ], (service: Auth0Service, storage: Auth0StorageService) => {
            const authResult = {};
            spyOn(storage, 'get').and.returnValue(authResult);
            spyOn(service, 'tokenNotExpired').and.returnValue(true);

            expect(service.authenticated()).toBe(true);
        }));
    });
});
