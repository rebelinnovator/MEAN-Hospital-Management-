import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-mentally-challenged',
  templateUrl: './mentally-challenged.component.html',
})
export class MentallyChallengedComponent implements OnInit {
  constructor(public global: GlobalService) { }

  ngOnInit(): void { }
}
