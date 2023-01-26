import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/shared/models/post.model';
import { PostsService } from 'src/app/shared/services/posts.service';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  post: Post | undefined;
  private postId!: string;
  private editMode: boolean = false;
  isLoading: boolean = true;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = false;

      if (paramMap.has('postId')) {
        this.editMode = true;
        this.postId = String(paramMap.get('postId'));
        this.postsService.getPost(this.postId).subscribe({
          next: (returnedPost) => (this.post = returnedPost),
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;

    const formPost: Post = form.value;

    if (this.editMode) {
      formPost.id = this.postId;
      this.postsService.updatePost(formPost);
    } else {
      this.postsService.addPost(formPost);
    }

    form.resetForm();
  }
}
