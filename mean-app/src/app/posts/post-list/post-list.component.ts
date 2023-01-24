import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts = [
    {
      title: 'First Post',
      content: 'LOIKSLSKDNFLSDKFSLKDJF',
    },
    {
      title: 'sECOND Post',
      content: 'LOIKSLSKDNFLSDKFSLKDJF',
    },
    {
      title: 'Third Post',
      content: 'LOIKSLSKDNFLSDKFSLKDJF',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
