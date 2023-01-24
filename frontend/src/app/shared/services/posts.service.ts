import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor() {}

  getPosts() {
    return this.posts.slice();
  }

  addPost(newPost: Post) {
    this.posts.push(newPost);
    this.postsUpdated.next(this.posts);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
