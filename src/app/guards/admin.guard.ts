import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated() && authService.isAdmin()) {
        return true;
    }

    // Redirect to dashboard if logged in but not admin, or login if not logged in
    if (authService.isAuthenticated()) {
        return router.parseUrl('/dashboard');
    }

    return router.parseUrl('/login');
};
