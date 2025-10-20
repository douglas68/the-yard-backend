### Project Approvals:
##	What is your app and why?
The Yard is a full-stack social media platform for fraternities and sororities on a single campus. It lets students and alumni join (or verify) their chapters, share posts, organize events, and network across campuses.

##	What is the shape/model of your data? (testing for undergrad only)

User{
_id,
name,
email,
password
pictureURL
chapterID
role ("member"| "officer" | "alumni" | "admin")

}

Chapter{
    _id                 // Greek Letters
    name,               // 
    organization:     // have a list to pick from  
    crestUrl:
    about, (this can put their)
    establishedDate,
    isActive:boolean,
}

Post{
  _id
  authorID // User.id
  chapterID //if the post is by a chapter
  text //
  picture//
  like count
  createdAT
  
}


## Later Add ons
-comments
-the likes are link with the user
-events

##	What are your CRUD Routes?
Auth
POST /api/auth/register — create account
POST /api/auth/login — get JWT
GET /api/auth/me — current user profile

Users
GET /api/users/:id
PATCH /api/users/:id — update profile (name, pictureUrl, graduationDate)

Chapters
GET /api/chapters?campusId=&organizationId //List chapters
GET /api/chapters/:id // chapter details 
(maybe)PATCH /api/chapters/:id (officer) — about, crestUrl, isActive 

Post
Posts
GET /api/posts?chapterId=&authorId=&limit=20&cursor= — list posts (newest first)
GET /api/posts/:id — get a single post 
POST /api/posts — create post 
PATCH /api/posts/:id — update post 
DELETE /api/posts/:id — delete post 
POST /api/posts/:id/like — like a post 
DELETE /api/posts/:id/like — unlike a post


##	Wireframe/what are your 4 pages?

<!-- login page
createlogin page  hold off for now-->
Dashboard(Campus page that shows all of the events and posts made by the users on the campus)
profile
edit profile


-------------------------------------------------------------------------------------------

10/14/25
My Project was approved but this need to be scalled down to be able to commpliish this capstone within thw two weeks. 

I was able to scale down the objects to User, chapter and posts.  

I will be creating the following pages for now: 

login page
createlogin page
Dashboard(Campus page that shows all of the events and posts made by the users on the campus)
profile
edit profile

10/15/25

Schemas are compeleted

10/16/25
Routes completed

10/17/25
Finish backend and test

Start Frontend 

-----------------------

