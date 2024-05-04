import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { MainComponent } from './components/main/main.component';
import { authGuard } from './components/auth/auth.guard';

export const routes: Routes = [
    {
        path:'',
        component: LoginComponent
    },
    {
        path:'chat',
        component: MainComponent,
        canActivate: [authGuard]
    },
];
