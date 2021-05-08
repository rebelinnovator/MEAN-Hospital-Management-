import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class DisplayToastrService {

  constructor(public toastr: ToastrService, ) { }
  showToastr(message, type) {
    if (type === 'success' || type === 'error' || type === 'show') {
      this.toastr[`${type}`](message);
    }
  }
}
