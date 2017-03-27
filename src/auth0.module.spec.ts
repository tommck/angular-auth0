import {
    inject,
    TestBed
} from '@angular/core/testing';

import { Auth0Module } from './auth0.module';
import { Auth0Config } from './auth0.config';

describe('Auth0 module', () => {

    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            Auth0Module.forRoot({
                clientId: 'clientId',
                domain: 'domain'
            })
        ],
        providers: []}));


    it('should resolve Auth0Config', inject([ Auth0Config ], (config: Auth0Config) => {
        expect(config).toEqual({
            clientId: 'clientId',
            domain: 'domain'
        });
    }));
});
