import { NgModule, ModuleWithProviders } from '@angular/core';
import { Auth0Config } from './auth0.config';
import { Auth0Service } from './auth0.service';
import { Auth0StorageService } from './auth0.storage.service';
import { RouterModule } from '@angular/router';
import Auth0LockStatic from 'auth0-lock';

@NgModule({
    imports: [
        RouterModule
    ],
    declarations: [],
    providers: [
        Auth0Service,
        Auth0StorageService,
        {
            provide: Auth0LockStatic,
            useFactory: (config: Auth0Config) => new Auth0Lock(config.clientId, config.domain),
            deps: [Auth0Config]
        }
    ]
})
export class Auth0Module {
    static forRoot(config: Auth0Config): ModuleWithProviders {
        return {
            ngModule: Auth0Module,
            providers: [
                { provide: Auth0Config, useValue: config }
            ]
        };
    }
}
