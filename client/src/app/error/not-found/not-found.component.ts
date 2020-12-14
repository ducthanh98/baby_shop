import {AfterViewInit, Component} from '@angular/core';
import {CommonService} from "../../shared/services/common.service";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements AfterViewInit {

  constructor(private commonService:CommonService) { }

  ngAfterViewInit() {
    this.commonService.generateScript()
  }

}
