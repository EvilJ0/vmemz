import {ILike} from "../../../../shared/types/Entities/iLike";
import {IPost} from "../../../../shared/types/Entities/iPost";
import {IUser} from "../../../../shared/types/Entities/iUser";


export const MOCK_LIKES:ILike[]=[
  {
    type: true,
    _id: "1",
    timeStamp:'21.04.2020',
    userId:"1",
    postId:"2",
    userName: 'John'
  },
  {
    type: true,
    _id: "2",
    timeStamp: '21.04.2020',
    userId:"2",
    postId:"1",
    userName: 'Mike'
  },
]

export const MOCK_POSTS:IPost[]                = [{
  _id             : "1",
  createdByUserId: "1",
  content        : `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                    ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                    laborum.`,
  date           : '21.04.2020',
  time           : '15:04',
  likes           : [MOCK_LIKES[1]],
  disLikes:[],
  createdByUserName: 'John'

},
  {
    _id             : "2",
    createdByUserId: "2",
    content        : `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                    ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                    laborum.`,
    date           : '30.11.2020',
    time           : '17:64',
    likes           : [MOCK_LIKES[0]],
    disLikes:[],
    createdByUserName: 'John'

  },
]

export const MOCK_USERS: IUser[] = [
  {
    _id   : "1",
    name : 'John',
    posts: [MOCK_POSTS[0]],
    postsLiked: [],
    likes: [MOCK_LIKES[1]],
    likesGet:[],
    dislikes:[],
    dislikesGet:[],
    avatar: '../../../assets/svg/Trollface.svg',
    password:'123456'
  },
  {
    _id   : "2",
    name : 'Mike',
    posts: [MOCK_POSTS[1]],
    postsLiked: [],
    likes: [MOCK_LIKES[0]],
    likesGet:[],
    dislikes:[],
    dislikesGet:[],
    avatar: '../../../assets/svg/Trollface.svg',
    password:'123456'
  },
];


