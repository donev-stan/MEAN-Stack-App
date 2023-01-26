import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { Post, PostBE } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private url: string = 'http://localhost:3000/api/posts';

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts(): void {
    this.http
      .get<{ message: string; posts: PostBE[] }>(this.url)
      .pipe(
        map((response) =>
          response.posts.map((post: PostBE) => ({
            id: post._id,
            title: post.title,
            content: post.content,
          }))
        )
      )
      .subscribe({
        next: (transformedPosts: Post[]) => {
          this.posts = transformedPosts;
          this.postsUpdated.next([...this.posts]);
        },
      });
  }

  getPost(postId: string): Observable<Post> {
    return this.http
      .get<{
        message: string;
        post: PostBE;
      }>(`${this.url}/${postId}`)
      .pipe(
        map((response) => ({
          id: response.post._id,
          title: response.post.title,
          content: response.post.content,
        }))
      );
  }

  addPost(newPost: Post): void {
    this.http
      .post<{ message: string; postId: string }>(this.url, newPost)
      .subscribe((response) => console.log(response));
  }

  updatePost(post: Post): void {
    this.http
      .put<{ message: string }>(`${this.url}/${post.id}`, post)
      .subscribe((response) => console.log(response));
  }

  getPostsUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  deletePost(postId: string): void {
    this.http
      .delete<{ message: string }>(`${this.url}/${postId}`)
      .subscribe(() => {
        // Locally update the list
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);

        // Alternative:
        // Fetch the updated list from the BE
        // this.getPosts();
      });
  }
}
