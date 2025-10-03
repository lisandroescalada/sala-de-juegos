import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Supabase } from '../services/supabase';
import { Modal } from '../services/modal';

export const ageGuard: CanActivateFn = async (route, state) => {
  const sb = inject(Supabase);
  const rt = inject(Router);
  const md = inject(Modal);

  const user = await sb.findUser((sb.user()?.email ?? ''));

  if (user?.age < 18) {
    md.showModal(
      'Acceso denegado',
      'Debes ser mayor de edad para ingresar al chat general.'
    );
    rt.navigate(['/home'])
    return false;
  }
  return true;
};
