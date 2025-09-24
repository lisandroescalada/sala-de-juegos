import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Modal } from '../services/modal';
import { Supabase } from '../services/supabase';

export const authGuard: CanActivateFn = async (route, state) => {
  const modal = inject(Modal);
  const supabase = inject(Supabase);
  const router = inject(Router);

  await supabase.restoreSession();

  if (supabase.user() === null) {
    modal.showModal(
      'Acceso denegado',
      'Debes estar logueado para ingresar en esta sección.'
    );
    router.navigate(['/login'])
    return false;
  } else {
    return true;
  }

};
