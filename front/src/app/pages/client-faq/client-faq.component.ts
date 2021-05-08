import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'client-faq',
  templateUrl: './client-faq.component.html',
})
export class ClientFaqComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 100);
    AOS.init({
      once: false,
      easing: 'ease-in-out-sine',
    });
    setTimeout(() => {
      AOS.refreshHard();
    }, 1000);
  }
}