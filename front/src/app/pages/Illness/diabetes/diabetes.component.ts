import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-diabetes',
  templateUrl: './diabetes.component.html',
})
export class DiabetesComponent implements OnInit {
  constructor(public global: GlobalService) { }

  ngOnInit(): void { }
}
