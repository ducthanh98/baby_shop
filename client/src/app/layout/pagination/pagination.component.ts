import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  pageNumber = 1;
  private totalPage = 1;
  numbers: number[];
  pages: number[];

  @Output() selectPage = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  @Input() set totalPages(value: number) {
    this.totalPage = value;
    this.numbers = Array(this.totalPage).fill(1).map((x, i) => i + 1);
    this.updatePaginationLabel()
  }

  updatePaginationLabel() {
    if (this.pageNumber > 2) {
      this.pages = this.numbers.filter(x => x < this.pageNumber + 3 && x > this.pageNumber - 3)
    } else if (this.totalPages - this.pageNumber < 5) {
      const start = this.totalPages - 5 < 0 ? 0 : this.totalPages - 5;
      this.pages = this.numbers.slice(start, this.totalPages);
    } else {
      this.pages = this.numbers.slice(0, 5);
    }
  }

  get totalPages() {
    return this.totalPage;
  }

  changePage(page: number) {
    this.pageNumber = page;
    this.selectPage.emit(page);
    this.updatePaginationLabel()
  }

  nextOrPrevPage(isNext: boolean) {
    if (isNext && this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.selectPage.emit(this.pageNumber);
    }
    if (!isNext && this.pageNumber > 1) {
      this.pageNumber--;
      this.selectPage.emit(this.pageNumber);
    }
    this.updatePaginationLabel()

  }

}
