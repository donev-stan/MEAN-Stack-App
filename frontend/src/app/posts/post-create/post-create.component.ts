import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/shared/models/post.model';
import { PostsService } from 'src/app/shared/services/posts.service';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  post: Post = { id: '', title: '', content: '' };
  private postId!: string;
  private editMode: boolean = false;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.editMode = true;
        this.postId = String(paramMap.get('postId'));
        this.post = this.postsService.getPost(this.postId);
      } else {
        this.editMode = false;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) return;

    const newPost: Post = form.value;

    if (this.editMode) {
      newPost.id = this.postId;
      this.postsService.updatePost(newPost);
    } else {
      this.postsService.addPost(newPost);
    }

    form.resetForm();
  }
}
