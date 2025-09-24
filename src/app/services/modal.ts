import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Modal {
  showModal(
    title: string,
    text: string,
    icon: SweetAlertIcon = 'info',
    confirmButtonText: string = 'Aceptar'
  ) {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText
    })
  }
}
