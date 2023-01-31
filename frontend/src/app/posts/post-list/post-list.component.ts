import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/models/post.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PostsService } from 'src/app/shared/services/posts.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading: boolean = true;
  private postSub!: Subscription;

  totalPosts: number = 0;
  postsPerPage: number = 2;
  pageSizeOptions: number[] = [2, 4, 6, 8, 10];

  currentPage: number = 1;

  private authListenerSubscription!: Subscription;
  userIsAuthenticated: boolean = false;

  userId: string | null = null;

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();

    this.postSub = this.postsService.getPostsUpdateListener().subscribe({
      next: (postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;

        this.userId = this.authService.getUserId();
      },
    });

    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(
        (isAuthenticated: boolean) =>
          (this.userIsAuthenticated = isAuthenticated)
      );
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authListenerSubscription.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoading = true;

    this.postsService
      .deletePost(postId)
      .subscribe({
        next: () =>
          this.postsService.getPosts(this.postsPerPage, this.currentPage),
        error: () => (this.isLoading = false),
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
