import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Post } from 'src/app/shared/models/post.model';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onAddPost(form: NgForm) {
    if (form.invalid) return;

    const newPost: Post = form.value;

    console.log(newPost);
  }
}
