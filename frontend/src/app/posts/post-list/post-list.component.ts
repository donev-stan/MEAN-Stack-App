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

  isLoading: boolean = true;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts();

    this.postSub = this.postsService.getPostsUpdateListener().subscribe({
      next: (posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      },
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
}
