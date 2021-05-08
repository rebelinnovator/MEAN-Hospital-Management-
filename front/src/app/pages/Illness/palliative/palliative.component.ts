import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-palliative',
  templateUrl: './palliative.component.html',
})
export class PalliativeComponent implements OnInit {
  constructor(public global: GlobalService) { }

  ngOnInit(): void { }
}
