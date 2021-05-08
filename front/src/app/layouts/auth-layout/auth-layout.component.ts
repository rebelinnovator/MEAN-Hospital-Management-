import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent implements OnInit {
  constructor(public router: Router) { }

  ngOnInit(): void { }
}
