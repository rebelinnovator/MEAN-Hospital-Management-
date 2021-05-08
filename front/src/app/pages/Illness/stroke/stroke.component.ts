import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-stroke',
  templateUrl: './stroke.component.html',
})
export class StrokeComponent implements OnInit {
  constructor(public global: GlobalService) { }

  ngOnInit(): void { }
}
