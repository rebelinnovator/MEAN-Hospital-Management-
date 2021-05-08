import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-post-surgery',
  templateUrl: './post-surgery.component.html',
})
export class PostSurgeryComponent implements OnInit {
  constructor(public global: GlobalService) { }

  ngOnInit(): void { }
}
