import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  newPost = '';
  postInput = '';

  constructor() {}

  ngOnInit() {}

  onSavePost() {
    this.newPost = this.postInput;
  }
}
