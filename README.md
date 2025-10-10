### Project Approvals:
##	What is your app and why?
The Yard is a full-stack social media platform for fraternities and sororities. It lets students and alumni join (or verify) their chapters, share posts, organize events, and network across campuses.

##	What is the shape/model of your data? (testing for undergrad only)

User{
_id
name
email
password
pictureURL
graduationDate
organizationID
chapterID
campusID
role ("member"| "officer" | "alumni" | "admin")
}



Chapter{
    _id                 // Greek Letters
    name,               // 
    organizationID:
    campusID,
    crestUrl:
    about, (this can put their)
    establishedDate,
    chapterType,        //"undergrad" | "professional" | "alumni",
}

Organization {
  _id,
  name,                // "Lambda Tau Omega"
  shortName,           // "LTO"
  type,                // "sorority" | "fraternity" | "co-ed"
  council,             // "NPHC" | (I need to research the rest)
  colors: [ "#0D47A1", "#B0BEC5" ],
  crestUrl,
  foundedOn,           // date
  website,
}

campus{
    _id,
    name,
    city,
    state,
    howmanyGreeks,
    whatGreeks,
}

##	What are your CRUD Routes?

##	Wireframe/what are your 4 pages?

1) login
2) Dashboard(your own)
3) The organization Page
4) The Chapter Page
5) Campus Page

