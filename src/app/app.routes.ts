import { Routes } from '@angular/router';
import { User } from './user/user';
import { Registration } from './user/registration/registration';
import { Login } from './user/login/login';
import { Dashboard } from './dashboard/dashboard';
import { Wallet } from './wallet/wallet';
import { Category } from './category/category';
import { Recurrings } from './recurrings/recurrings';
import { Transaction } from './transaction/transaction';
import { Confirmemail } from './user/confirmemail/confirmemail';
import { NoAuthGuard } from './shared/services/no-auth-guard';
import { AuthGuard } from './shared/services/auth-guard'; 
import { Homepage } from './homepage/homepage';

export const routes: Routes = [
    { path: '', component: Homepage, canActivate: [NoAuthGuard]},
    {
        path: '',
        component: User,
        children: [
            { path: 'signup', component: Registration, canActivate: [NoAuthGuard] },
            { path: 'confirmemail', component: Confirmemail, canActivate: [NoAuthGuard] },
            { path: 'signin', component: Login, canActivate: [NoAuthGuard] }
        ]
    },
    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
    { path: 'wallet', component: Wallet, canActivate: [AuthGuard] },
    { path: 'category', component: Category, canActivate: [AuthGuard] },
    { path: 'transaction', component: Transaction, canActivate: [AuthGuard] },
    { path: 'recurrings', component: Recurrings, canActivate: [AuthGuard] },
];