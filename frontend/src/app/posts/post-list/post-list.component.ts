import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/models/post.model';
import { PostsService } from 'src/app/shared/services/posts.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSub!: Subscription;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.posts = this.postsService.getPosts();

    this.postSub = this.postsService.getPostUpdateListener().subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
      },
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
