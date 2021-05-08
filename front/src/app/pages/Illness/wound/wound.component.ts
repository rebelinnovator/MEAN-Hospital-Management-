import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-wound',
  templateUrl: './wound.component.html',
})
export class WoundComponent implements OnInit {
  constructor(public global: GlobalService) { }

  ngOnInit(): void { }
}
