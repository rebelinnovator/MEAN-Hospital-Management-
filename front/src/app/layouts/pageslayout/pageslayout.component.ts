import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-pageslayout',
  templateUrl: './pageslayout.component.html',
})
export class PageslayoutComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit(): void {}
}
