import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe({
        next: (postData) => {
          this.posts = postData.posts;
          this.postsUpdated.next([...this.posts]);
        },
      });
  }

  addPost(newPost: Post) {
    this.posts.push(newPost);
    this.postsUpdated.next(this.posts);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
