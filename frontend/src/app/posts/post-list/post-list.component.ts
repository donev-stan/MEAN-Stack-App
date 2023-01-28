import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
  isLoading: boolean = true;
  private postSub!: Subscription;

  totalPosts: number = 0;
  postsPerPage: number = 0;
  pageSizeOptions: number[] = [2, 4, 6, 8, 10];

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

  onChangedPage(pageData: PageEvent) {}
}
