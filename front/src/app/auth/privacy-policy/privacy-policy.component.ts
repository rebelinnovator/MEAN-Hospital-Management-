import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(
    public global: GlobalService,
  ) { }

  ngOnInit(): void { }
}
