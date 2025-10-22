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

## The Yard – Project Spec
## User Stories

## As a guest, I want to:
>Browse the campus feed to see what Greek life is posting.
>View a chapter’s public page.

## As a user (member/alumni), I want to:
>Create a profile so I can post and interact.
>Join/select my chapter during signup.
>Create posts (text + optional photo) that appear in the campus feed.
>Filter the feed by chapter.
>Edit my profile (name, email, chapter, about, graduation year).
>See my own posts on my profile.
>Like posts
>Delete or edit my own posts.

## As a chapter officer, I want to:
>Update my chapter’s “About,” crest URL, and active status.
>Highlight chapter events or announcements (optional MVP+ Events). (EXTRA)

## As an admin, I want to: (pause)
>Update or deactivate a chapter if needed.
>Update user roles (member/officer/alumni/admin).
>Remove posts that violate guidelines.

## Types of Users
Users
Officer
Admin (Pause)



The events is extra