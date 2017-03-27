import {
    inject,
    TestBed
} from '@angular/core/testing';

import { Auth0StorageService } from './auth0.storage.service';
import { Subject } from 'rxjs';

describe('Auth0 Storage service', () => {
    const events = new Subject<{}>();

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            Auth0StorageService
        ]}));

    it('should exist', inject([ Auth0StorageService ], (service: Auth0StorageService) => {
        expect(service).toBeTruthy();
    }));

    describe('store', () => {
        it('should call `localStorage.setItem()`', inject([
            Auth0StorageService
        ], (service: Auth0StorageService) => {
            const authResult = {};
            spyOn(localStorage, 'setItem').and.stub();

            service.store('key', authResult);

            expect(localStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(authResult));
        }));
    });

    describe('get', () => {
        it('should call `localStorage.getItem()`', inject([
            Auth0StorageService
        ], (service: Auth0StorageService) => {

            const authResult = {};
            spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(authResult));

            service.get('key');

            expect(localStorage.getItem).toHaveBeenCalledWith('key');
        }));
    });

    describe('remove', () => {
        it('should call `localStorage.removeItem()`', inject([
            Auth0StorageService
        ], (service: Auth0StorageService) => {

            spyOn(localStorage, 'removeItem').and.stub();

            service.remove('key');

            expect(localStorage.removeItem).toHaveBeenCalledWith('key');
        }));
    });
});
