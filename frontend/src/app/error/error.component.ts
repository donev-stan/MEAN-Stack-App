import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogDataInterface {
  status: number;
  statusText: string;
  message: string;
}

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  errorMessage: string = 'An unknown error ocurred!';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: DialogDataInterface
  ) {}

  ngOnInit() {}
}
