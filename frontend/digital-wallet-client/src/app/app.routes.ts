import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login').then(c => c.Login) },
  { path: 'register', loadComponent: () => import('./components/register/register').then(c => c.Register) },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout').then(c => c.Layout),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(c => c.Dashboard) },
      { path: 'payment-methods', loadComponent: () => import('./components/payment-methods/payment-methods').then(c => c.PaymentMethods) },
      { path: 'transactions', loadComponent: () => import('./components/transactions/transactions').then(c => c.Transactions) },
      { path: 'send-money', loadComponent: () => import('./components/send-money/send-money').then(c => c.SendMoney) }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
