import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, Subject, tap } from 'rxjs';
import { Post, PostBE } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private base_url: string = 'http://localhost:3000/api/posts';

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number): void {
    const queryParams: string = `?pageSize=${postsPerPage}&currentPage=${currentPage}`;
    const url = this.base_url.concat(queryParams);

    this.http
      .get<{ message: string; posts: PostBE[]; maxPosts: number }>(url)
      .pipe(
        map((response) => ({
          count: response.maxPosts,
          posts: response.posts.map((post: PostBE) => ({
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
          })),
        }))
      )
      .subscribe({
        next: (transformedData) => {
          this.posts = transformedData.posts;
          this.postsUpdated.next({
            posts: [...transformedData.posts],
            postCount: transformedData.count,
          });
        },
      });
  }

  getPost(postId: string): Observable<Post> {
    return this.http
      .get<{
        message: string;
        post: PostBE;
      }>(`${this.base_url}/${postId}`)
      .pipe(
        map((response) => ({
          id: response.post._id,
          title: response.post.title,
          content: response.post.content,
          imagePath: response.post.imagePath,
        }))
      );
  }

  addPost(newPost: Post, image: File): void {
    const postData = new FormData();
    postData.append('title', newPost.title);
    postData.append('content', newPost.content);
    postData.append('image', image, newPost.title);

    this.http
      .post<{ message: string; post: Post }>(this.base_url, postData)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/list-post']);
      });
  }

  updatePost(post: Post, image: File | string): void {
    let postData: Post | FormData;

    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', post.id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', image, post.title);
    } else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: image as string,
      };
    }

    this.http
      .put<{ message: string }>(`${this.base_url}/${post.id}`, postData)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/list-post']);
      });
  }

  getPostsUpdateListener(): Observable<{ posts: Post[]; postCount: number }> {
    return this.postsUpdated.asObservable();
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(`${this.base_url}/${postId}`);
  }
}
