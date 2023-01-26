export interface Post {
  id: string;
  title: string;
  content: string;
  image?: any;
}

export interface PostBE {
  _id: string;
  title: string;
  content: string;
}
