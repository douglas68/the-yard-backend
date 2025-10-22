### Project Approvals:
##	What is your app and why?
The Yard is a full-stack social media platform for fraternities and sororities on a single campus. It lets students and alumni join (or verify) their chapters, share posts, organize events, and network across campuses.

##	What is the shape/model of your data? (testing for undergrad only)

User {
  _id,
  fullName,
  email,
  passwordHash,
  organizationId, // references Organization
  role: ("member" | "officer" | "alumni" | "admin"),
  createdAt,
  updatedAt
}

Organization {
  _id,
  name,
  letters,           // Greek letters (e.g. ΛΤΩ)
  organization,      // Full organization name
  crestUrl,
  about,
  establishedDate,
  isActive: Boolean,
  createdAt,
  updatedAt
}

Post {
  _id,
  authorId,        // references User
  organizationId,  // references Organization
  text,
  pictureUrl,
  likeCount,
  createdAt,
  updatedAt


## Later Add ons
-comments
-the likes are link with the user
-events

##	What are your CRUD Routes?

POST	/api/auth/register	Create a new account
POST	/api/auth/login	Authenticate user & return JWT
GET	/api/auth/me	Get current user profile

Users
GET	/api/users/:id	Get user profile by ID
GET	/api/users/me	Get logged-in user profile
PATCH	/api/users/:id	Update user info (name, email, organizationId, about)

Chapters
GET	/api/organizations	List all organizations
GET	/api/organizations/:id	Get details of one organization
PATCH	/api/organizations/:id	Update details (officer/admin only)

Post
GET	/api/posts	List posts (filter by org, author, or campus feed)
GET	/api/posts/:id	View a single post
POST	/api/posts	Create a post
PATCH	/api/posts/:id	Edit a post
DELETE	/api/posts/:id	Delete a post
POST	/api/posts/:id/like	Like a post
DELETE	/api/posts/:id/like	Unlike a post


##	Wireframe/what are your 4 pages?

Dashboard(Campus page that shows all of the events and posts made by the users on the campus)
profile
edit profile
Chapter


-------------------------------------------------------------------------------------------

## The Yard – Project Spec
## User Stories

## As a user (member/alumni), I want to:
Create my profile and select my organization
Make posts (text + photo)
Like posts
Filter the feed by organization
Edit or delete my posts
Update my profile details

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


## 💭 Challenges & Lessons Learned

When I started this project, I had a very ambitious vision for The Yard.
Originally, I wanted to build a full-scale social media platform where fraternities and sororities could:
>Verify chapter memberships,
>Host events and fundraisers,
>Like, comment, and share posts,

And even manage administrative controls through multiple user roles (member, officer, admin).

It was meant to be a complete ecosystem for Greek life. Something closer to a custom social platform or even a campus-level LinkedIn or Facebook for Greek organizations. However, once I started actually building it, I realized that I was reaching too high for the time frame and scope of this capstone.
There were so many moving parts such as user authentication, file uploads, event systems, and complex relationships between users, chapters, and posts.
That it quickly became overwhelming. :/

To stay realistic and meet the course goals, I made the decision to scale it down and focus on the core features that truly demonstrated my backend and frontend skills:
>Setting up a MongoDB database with Mongoose schemas for User, Organization, and Post.
>Building CRUD routes for users and posts.
>Creating a simple React front-end with a dashboard (feed), profile, and edit profile pages.
>Managing state and data fetching using React Hooks.

What I ended up creating was something simpler, a basic social feed, similar in spirit to Twitter, but centered around campus Greek life.
Users can view and create posts, update their profiles, and see a feed filtered by organization.

While it’s smaller than my original plan, it’s much more realistic, functional, and complete.
This experience taught me one of the most valuable lessons in software development:

"It’s better to build something simple that works well than something complex that never gets finished."



