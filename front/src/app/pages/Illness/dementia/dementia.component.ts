import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-dementia',
  templateUrl: './dementia.component.html',
})
export class DementiaComponent implements OnInit {
  constructor(public global: GlobalService) { }

  ngOnInit(): void { }
}
