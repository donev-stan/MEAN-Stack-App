import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];

  constructor() {}

  getPosts() {
    return this.posts.slice();
  }

  addPost(newPost: Post) {
    this.posts.push(newPost);
  }
}
