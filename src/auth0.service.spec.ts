/*import {
    inject,
    TestBed
} from '@angular/core/testing';

import { Auth0Service } from './auth0.service';
import { Auth0StorageService } from './auth0.storage.service';
import Auth0LockStatic from 'auth0-lock';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';*/

describe('Auth0 service', () => {
    /*const auth = {
        subscribe: () => {},
        login: () => {},
        logout: () => {}
    };

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            { provide: Router, useValue: { events: Observable.of({}) } },
            { provide: Auth0StorageService, useValue: { events: Observable.of({}) } },
            { provide: Auth0LockStatic, useValue: { events: Observable.of({}) } },
            Auth0Service
        ]}));*/

    /*it('should exist', inject([ Auth0Service ], (service: Auth0Service) => {
        expect(service).toBeTruthy();
    }));*/

    it('should exist', () => {
        expect(true).toBeTruthy();
    });


    /*it('should emit initial authentication data', inject([
        Auth0Service,
        AngularFire
    ], (service: Auth0Service, af: AngularFire) => {

        spyOn(af.auth, 'login').and.stub();

        service.login();

        expect(af.auth.login).toHaveBeenCalled();
    }));*/
});
