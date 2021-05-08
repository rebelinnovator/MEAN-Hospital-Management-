import { Component, OnInit } from '@angular/core'
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  constructor(public global: GlobalService) { }

  ngOnInit(): void { }
}
