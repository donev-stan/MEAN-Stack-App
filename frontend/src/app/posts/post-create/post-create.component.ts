import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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
  editMode: boolean = false;
  isLoading: boolean = true;

  form: FormGroup;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(10)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)],
      }),
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = false;

      if (paramMap.has('postId')) {
        this.editMode = true;
        this.postId = String(paramMap.get('postId'));
        this.postsService.getPost(this.postId).subscribe({
          next: (returnedPost) => {
            this.post = returnedPost;

            this.form.setValue({
              title: this.post?.title,
              content: this.post?.content,
            });
          },
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) return;

    this.isLoading = true;

    const formPost: Post = this.form.value;

    if (this.editMode) {
      formPost.id = this.postId;
      this.postsService.updatePost(formPost);
    } else {
      this.postsService.addPost(formPost);
    }

    this.form.reset();
  }
}
