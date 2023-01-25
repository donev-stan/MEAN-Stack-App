import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
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
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) =>
          postData.posts.map((post: any) => ({
            id: post._id,
            title: post.title,
            content: post.content,
          }))
        )
      )
      .subscribe({
        next: (transformedPosts: any) => {
          this.posts = transformedPosts;
          this.postsUpdated.next([...this.posts]);
        },
      });
  }

  addPost(newPost: Post) {
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', newPost)
      .subscribe({
        next: (responseData) => {
          console.log(responseData);
          this.posts.push(newPost);
          this.postsUpdated.next([...this.posts]);
        },
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
