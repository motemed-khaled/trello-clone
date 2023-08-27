import { CanActivateFn, Router } from '@angular/router';
import { ɵɵinject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = ɵɵinject(AuthService);
  const router = ɵɵinject(Router);

  return authService.isLoggedIn.pipe(map(isLogged => {
    if (isLogged) {
      return true
    } else {
      router.navigateByUrl("/")
      return false;
    }
  }));

};
