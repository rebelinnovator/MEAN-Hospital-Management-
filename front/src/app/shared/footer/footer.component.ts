import { Component, OnInit } from '@angular/core'
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  constructor(public global: GlobalService) { }

  ngOnInit(): void { }
}
