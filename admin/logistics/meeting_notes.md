# Team 4 - TDD Meeting Notes
Author: Hao Luo, Devam Dave

___

## Meeting on October 16th, 2023

### Participants
- Hao
- Omkar
- Ben
- Keran
- Yunlong
- Suhas
- Zheyu

### Agenda
1. Icebreaker and getting to know everyone
2. Decide team name, slogan, and team branding
2. Discuss ideas for Team Intro presentation

### Meeting Details
#### Location: Starbucks near Grad Housing

#### Presentation Details
- **Duration**: 8-10 mins
- **Slides**: [Google Slides Link](https://docs.google.com/presentation/d/1I8MlyIACbE3f1trboLAfO2LoJfotDK4xRNcP77Wnono/edit?usp=sharing)

#### Team Information
- **Team Name**: TDD - Thomas-driven Developers
    - **Note**: This got 5 out of 7 votes.
    - **Idea**: During the presentation, we can first ask people to guess what it means (if we like drama).
- **Team Branding**: Following the "Thomas" theme, inspired by @Ben Klingensmith's idea of Thomas & Friends/Thomas the Tank Engine.
    - **Team Picture**: Use the team picture from today and add Thomas the Tank Engine in the middle, with the Professor's face on it.
    - **Action Item**: @Omkar Bhope to help with this. Add Devam in the picture.
    - **Note**: @Devam Dave  introduced in slack since he wasn't able to make it to the in person meeting.
- **Personal Avatars**:
  - Choose a character from Thomas & Friends as an avatar/mascot for each team member.
      - [Thomas & Friends Characters](https://www.google.com/search?q=Thomas+%26+Friends+Characters)
  - **Action Item**: vote on whether we should do this as a team.

#### Slogan
- **Slogan (TBD)**: "We go full steam together"
    - Inspired by this song: [We Make a Team Together](https://youtu.be/3D-_dXSg42Q?si=UIjW0jLm2caHx-vN&t=167)
    - [Song Lyrics](https://genius.com/Thomas-and-friends-we-make-a-team-together-lyrics)
    - **Idea**: Play this in class until the slogan appears in the song.

#### Team Skills and Experiences
- **Word Cloud**: Use [WordArt](https://wordart.com/) to create a word cloud of shared skills/experiences.
    - **Action Item**: Everyone put their own keywords in the poll

#### Team Values/Mission
- **Focus**: Building something fun/enjoyable, aligning with our joyful team name/branding.
- **Clarification**: The project will also be practical and good for resumes.
    - **Note**: Practical and fun aren't mutually exclusive. Emphasize writing good code and applying/learning SE concepts/skills.

#### Personal Introductions
- **Duration**: As the presentation is actually 8-10 mins, consider doing a short personal intro for everyone.
- **Content**: Focus on non-CS-related things, like hobbies, fun facts, or unique aspects about yourself.
- **Template**: Adopted from JUMP (a mentorship program @ UCSD). Technical/school related stuff is greyed out but can be included if desired.

___

## Meeting on October 24th, 2023

### Participants
- Hao
- Omkar
- Ben
- Keran
- Yunlong
- Suhas
- Zheyu
- Devam

### Agenda
1. Work on warm-up activity together
2. Divide team into smaller groups based on Web Platform knowledge level, and take on each task separately
### Meeting Details

#### Location: Outside Classroom (in front of coffee shop)

#### Plan changed
- Everyone can voluntarily work on one task, or both 
- For people doing task 1 (stretchtext), clone [Hao's repo](https://github.com/alexluo1998/CSE210-tdd-stretchtext), create your own scratch branch, do the task, and then create a PR against main
- People doing task 2 can clone [Suhas' repo](https://github.com/Kitwradr/UCSD-Site-Clone) and add their own optimizations for the UCSD webpage
- Next meeting will be a zoom call to review all PRs together and generate a final version for submission
    - **Action Item**: Use this link to provide your availability http://whenisgood.net/2pbtwgy for the code review

___

## Meeting on October 30th, 2023

### Participants
- Hao
- Keran
- Yunlong
- Suhas
- Zheyu
- Devam

### Agenda
1. Share progress on warm-up activity
2. Solve any common problems
### Meeting Details

#### Location: Remote

#### StretchText: https://github.com/alexluo1998/CSE210-tdd-stretchtext
- Hao shared the refactor PR with following details
  1. HTML:
     - Added "leng=en"
     - Copy-pasted the content multiple times, to test the scrolling on the page.
  2. JS:
     - Modernize: use let and const, split into modules
     - Major Change: used a global listener on the `<body>`, and then use `event.target.cloest` to check for events on the "summaries". This is to address the FIXME comment by the original author
  3. In CSS,
     - Replaced "gray" with rgb color because it was deprecated
- Remaining Questions:
  1. In HTML,
     - When running the validator, epub-type shows up as errors but idk how to fix
     - Not sure why we needed two ways (CSS class, and epub type) for specifying "stretchsummary/stretchdetails" in the first place. I feel like this makes the code not as clean.
  2. In JS:
     - Would using global listener (plus "cloest") cause performance issue? - I didn't notice any while testing
     - Do we need all the browser specific requestAnimationFrames? - the page runs fine without them
     - Do we need  `if (document.readyState === "complete"){ }` this check when the page load? How is it different than the DOMContentLoaded listener?
  3. In CSS,
     - Question: Why do we need to have both "epub-type" and "epub\:type"? Seems like the later is not used at all
- task 1 netlify: https://loquacious-fairy-317b7d.netlify.app/

#### UCSD Homepage Improvement: https://github.com/Kitwradr/UCSD-Site-Clone
- Suhas and Keran shared progress on the second task
  1. Lighthouse Reports
     - [Original homepage Lighthouse Report](
     https://googlechrome.github.io/lighthouse/viewer/?psiurl=https%3A%2F%2Fucsd.edu%2F&strategy=desktop&category=performance&category=accessibility&category=best-practices&category=seo&category=pwa&utm_source=lh-chrome-ext)
     - [New homepage Lighthouse Report](
     https://googlechrome.github.io/lighthouse/viewer/?psiurl=https%3A%2F%2Fphenomenal-sopapillas-1546c3.netlify.app%2F&strategy=desktop&category=performance&category=accessibility&category=best-practices&category=seo&category=pwa&utm_source=lh-chrome-ext)
  2. Metrics
     - Performance score: 39 -> 54
     - First Contentful Paint: 3.3 s -> 2.0 s
     - Largest Contentful Paint: 7.3 s -> 2.9 s
     - Cumulative Layout Shift: 0.411 -> 0.41
     - Speed Index: 3.3 s -> 2.0 s
  3. Fixes
     - Compress all images with [tinypng](https://tinypng.com/)
     - Remove document.write
     - Remove some unused CSS files
     - Update links to static resources if the file is available
     - Compress large CSS files [cssminifier](https://www.toptal.com/developers/cssminifier)

___

## Meeting on November 1st, 2023

### Participants
- Hao
- Ben
- Keran
- Yunlong
- Suhas
- Zheyu
- Devam

### Agenda
1. Brainstorm for project idea
2. Discuss Miro board progress
### Meeting Details

#### Location: Remote
- [Recording 1](https://ucsd.zoom.us/rec/share/aAhav-AFrtILnRI7wAR33xkhBnER_SL-lTbhjxC_zmEph2V9vX90SU6A9Egjf3XW.aY4TKLkP1qppyg8C)
  w/ Passcode: qW0L&ckn
- [Recording 2](https://ucsd.zoom.us/rec/share/v5PChaIjS7rZc13FKVzBESE4ejpGktYdmZRXflU51oGjNntvejNeTNavWCbIX2Io.qqH7PJURFrCcaaZj) 
  w/ Passcode: i1O36@Z1

#### See Details in [Miro Board](https://miro.com/welcomeonboard/WVA4elFsR3ljeVZBT1Y2dk4wNjJ3SmtzcUt0cnpIeVdWMFhoUDI1TXJxTHVSclA1cnBKcVNrVGpobXljM2UwaXwzNDU4NzY0NTY1NzM2MjAyNjI3fDI=?share_link_id=538682317268)
- Action Item: 
  - modify the miro board to create a more consistent mind map

___

## Meeting on November 4th, 2023

### Participants
- Hao
- Ben
- Yunlong

### Agenda
- JS/HTML/CSS ramp up
- Check to see if any good resource (open-source projects) for study

### Meeting Details

#### Location: Remote

___

## Meeting on November 6th, 2023

### Participants
- Hao
- Ben
- Keran
- Yunlong
- Suhas
- Zheyu
- Omkar

### Agenda
- Pitch Formation

### Meeting Details
Came up with initial draft of the pitch:
- **Problem Statement:**
As social media platforms like Twitter and Instagram have grown, they have become increasingly centralized and controlled by large tech companies. This centralized control allows these platforms to censor content, sell user data, and manipulate algorithms in non-transparent ways.
However, decentralized social networks like Mastodon offer an alternative where servers are independently owned and moderated. This prevents centralized control over content and data. Unfortunately, while analytics tools exist for centralized platforms, there are currently no analytics solutions tailored for Mastodon's decentralized nature.
This lack of analytics makes it difficult for Mastodon server admins, app developers, and social media analysts to understand engagement, track trends, and optimize strategies on the platform. There is a need for an analytics tool designed specifically for Mastodon's architecture.
- **Pitch:**
We propose building an open-source social media analytics tool specifically for Mastodon instances and users. By leveraging Mastodon's open API, we can develop dashboards to visualize engagement, track trends, analyze influencers, and benchmark performance across Mastodon servers.
Unlike centralized sites like Twitter or Instagram, Mastodon grants us access to unfiltered, unbiased data from real people sharing authentic opinions and conversations. This presents a huge opportunity for unprecedented social listening that respects user privacy and control.
Our analytics will empower Mastodon admins to better understand their communities and moderation needs. App developers can optimize features based on actual usage data. Brands and marketers can authentically connect with audiences. Researchers can gain insights into decentralized social behavior.
With the right metrics and models tailored to Mastodon, we can build the open-source standard for understanding the fediverse. Let's unlock the full potential of ethical social analytics.**

See shared doc for details: https://docs.google.com/document/d/119WlEZa5rtn6G4QIBJN_kA5EVTs8g1O-Q4Zdl_UnMyg/edit#heading=h.nxw4fx9gyl0j

#### Location: Remote

___

## Meeting on November 7th, 2023

### Participants
- Hao
- Ben
- Keran
- Yunlong
- Suhas
- Zheyu
- Omkar

### Agenda
- Final sync up before pitching to Gagan

### Meeting Details

#### Location: Remote

___

## Meeting on November 9th, 2023

### Participants
- Hao
- Ben
- Yunlong
- Omkar

### Agenda
- Fine tune pitch before presentation
- Discuss next steps for project

### Meeting Details

#### Location: Remote
Discussed resources found useful for the project idea:
- https://docs.joinmastodon.org/client/public/
- https://github.com/mastotron/mastotron/tree/main
- https://github.com/benbrown/shuttlecraft/blob/main/lib/theAlgorithm.js
- https://mastotron.github.io/
- https://github.com/neo4j/neo4j

Action Items for this weekend:
- What relevant information can we pull from mastodon/activity hub and what are the privacy/rate limits?
- What graph visualization library should we use (neo4j?) and how well does it scale?
- Choose unit testing and code organization framework.

For the pitch, see the pitch slide deck for details

___

## Meeting on November 13th, 2023

https://ucsd.zoom.us/rec/share/ELpsOQfCneqoyfg_k9jnjW_Zeuuzhxl_S6AhO_4XAWkVu-EZU86eoXcAhfyeB6C9.0DR_w_OBci3umf7U
Passcode: %rxhv8cn


### Participants
- Hao
- Ben
- Keran
- Yunlong
- Suhas
- Zheyu
- Omkar

### Agenda
@channel I will hold two zoom meetings today 11:30AM and 7:30PM to check progress on tasks
Regarding Farley, we have 20 pages to read and present, has anyone started yet?
If not, I will do 151-154 up till the "Technical Problems and Problems of Design" and provide a summary + concrete example
@Omkar Bhope

@Devam Dave
Since you didn't pick a task, maybe you can help out with the reading or help Suhas with the visualization library work since I think it's the most risky/heavy work at the moment

Just to clarify, me and
@Zheyu Fu

@Devam Dave

@Omkar Bhope
will do the presentation today, and other people can focus on whatever task you have. Also note that it's always good to document your work - even if it's only exploratory. This will be very helpful when we eventually create a centralized design doc


### Meeting Details

#### Location: Remote

Created and assigned concrete list of things tasks:
- Backend:
  - Mastodon API
    - Figure out how Status(aka posts)/Account/Streaming APIs all work
    - Create an example JSON of the above APIs
    - Is OAuth required for pulling certain infos (followers/following)? Is there a rate limit?
  - Database 
    - what are the pros/cons of using a graph database like CogDB/Neo4j 
    - what info do we want to store
  - Design backend-client API contract (probably need to first finalize the frontend decisions)
  
- Frontend:
  - general UI/workflow
  - Which language to use (JS/TS) and do we really need frameworks
  - set up a working demo for framework vs no framework and how much of difference in workload
  - also need to consider performance - RAIL model - does using framework drastically reduce performance
  - If oauth is required, figure out how to connect to Mastodon OAuth API
  - more detailed wireframes for user workflow
  - choose visualization library
    - pros and cons for each library
    - get it running, mock some data, and create a simple demo
    - test scale boundary for each
- DevOps/QE:
  - Dev environment 
    - What language/framework are we using
    - set up initial repo
    - set up dev environment and README on how to get everything running
  - Testing
    - Choose testing frameworks and create a sample test 
    - set up CI flow on github
Docs/Marketing (kind of):
    - Read Farley Chpt 12 & prepare for presentation 
      - Provide a broad summary 
      - Come up with concrete examples to illustrate key ideas 
      - Make slide decks 
    - Set up design docs/markdown files for keeping track of things
    - @Keran Wang did a great job with this one https://midnight-spandex-18f.notion.site/Mastodon-API-dc555a303210491b9a17f549dd8020b5

___

## Meeting on November 16th, 2023

### Participants
- Hao
- Suhas
- Keran
- Yunlong
- Ben

### Agenda
Discuss the following things:
- Visjs capabilities and prototypes
- Possible features that we can build using visjs capabilites for MVP
- Storage of related data

### Meeting Details

#### Location: Remote

https://ucsd.zoom.us/rec/share/HSZfWvoeliNWaju_b1g5IT_R6nC92zttQEh1gmroZl2uD637kyTJ55hClfH_MYEG.wUAmRSgqCpIzTrt6
Passcode: 2G3h@jyi

Came up with first draft of the features:
- MVP: Given the user's account name and mastodon server domain, show a network of ~100-200 nodes with edges between nodes
- Node selection:
  - (must-have) rank followers/followings based on certain orders and pick the top X number of users to create nodes for. Give user a drop-down to select from the below rankings
  - (must-have) number of followers (show the most "popular" users among your followers/followings)
  - (must-have) num of total posts (show the most "active" users among your followers/followings)
- Node styles:
  - (must-have) size of a node will represent certain metrics (numerical) of the corresponding user
  - (must-have) num of recent post (larger nodes for more active users)
  - (must-have) number of followers (larger nodes for more "popular" users)
  - color of a node can represent characteristics of a user
    - people who re-post/boost a lot (boosters)
    - people who comments a lot (critics)
    - people who only likes posts from others but never post (introverts)
  - profile picture of users inside the node
- Edge creation:
  - (must have) direct follower/following relationship stemming from center user
  - (must have) mutual follower/following that the center user haven't noticed (example: Thomas follows A and B. A and B both follow C, but Thomas hasn't followed C)
  - (must have) provide a toggle switch to turn on/off
- Edge Styles:
  - (must have) arrows showing the follower/following relationship
  - edge width determined by the interactions between users
- Clustering
  - when zooming  https://visjs.github.io/vis-network/examples/network/other/clusteringByZoom.html
  - based on colors (characteristics) https://visjs.github.io/vis-network/examples/network/other/clustering.html
- Interactions
  - double click on a node would open the home page of the user/ or control click/ or show a link when hovering

Action Item:
- Set up Github Project
___

## Meeting on November 19th, 2023

### Participants
- Hao
- Ben
- Yunlong
- Keran

### Agenda
- Midterm questions discussion
- Review and go over some topics together

### Meeting Details

#### Location: Remote
Finished Midterm Questions Doc:
- https://docs.google.com/document/d/1ihlu_wqAWIDfTlBzqcihNP6uhiZyI0k10bm_yK-Wv4g/edit?usp=sharing

___

## Meeting on November 20th, 2023


https://ucsd.zoom.us/rec/share/_nq-LIjxP0WTODQNhpizhUhtfJZ4L-kLzjtQzv5662iFFlBlBhbwxp1OaV4nAp38.q3ziUPTqmtQ8OV7T
Passcode: =QU2DN=0


### Participants
- Hao
- Ben
- Keran
- Yunlong
- Devam
- Zheyu
- Omkar

### Agenda
- finalize our tech stacks and features and start planning/assigning the dev tasks.

### Meeting Details

#### Location: Remote

Hey all @channel stories along with sub-tasks have been create in the Github Project. We will focus on the first 6 in "to-dos" and the one in "in progress" https://github.com/users/Untellable/projects/1/views/1
Take a look when you have time and start thinking about which one you are interested in working on. We can start asyncly assign tasks before next meeting.
And just a reminder, start the midterm early and gook luck!

___

## Meeting on November 30th, 2023

### Participants
- Hao
- Ben
- Keran
- Yunlong
- Suhas
- Omkar
- Devam

### Agenda
Prepare for the milestone demo presentation

### Meeting Details

#### Location: Remote

#### Accomplishments
1. Backend API (without DB) is working in https://github.com/Untellable/210-Team4-TDD/pull/3 by
   @Keran Wang
2. Frontend integrated with the above API is working in https://github.com/Untellable/210-Team4-TDD/pull/8 by @Suhas
3. Hao finished the DB implementation, refactored(& cleaned up) Keran's branch, and added unit tests (both the framework setup and an example test). https://github.com/Untellable/210-Team4-TDD/pull/5 
4. @Devam Dave's work is in good shape - just need to rebase his stuff onto my Hao's and test it out. 
5. Yunlong Wang showed some initial work and should push code to a remote branch even if it's not fully working. 

#### Action Items:
- Plan for presentation: 1+2 will create a very basic working demo
- but PR 1 & 2 are not ready to go into main - combine them into a feature branch and @Omkar Bhope can demo this
- @Ben Klingensmith verify that tests are passing for Hao's PR. Then if merge to main we can set up the CI flow

___

## Meeting on December 3rd, 2023

### Participants
- Hao
- Omkar
- Ben
- Devam
- Keran
- Yunlong
- Suhas
- Zheyu

### Agenda
1. **Tutorial of the Code Structure**

### Meeting Details

#### Tutorial of the Code Structure
Hao presented a detailed overview of the latest Pull Request and repository structure, using an architectural design flowchart. As our team operates asynchronously, this provided a vital understanding for those working on front-end and back-end tasks. Key topics covered include script functionalities, library usage (e.g., Prettier and Lint), and unit testing examples. This concise meeting serves as a quick reference for the team, fostering collaboration and ensuring clarity in our development process.

https://github.com/Untellable/210-Team4-TDD/pull/5

https://ucsd.zoom.us/rec/share/mLi83fpgd4-IxhiV0NXeb7OdAEuxp8zyNSB6_zs8m1ny4W6OxWHlNcQe8KvrNtXo.NvbILyMhnVDObgQ4
Passcode: wf96=#EC
---

## Standup Meeting on December 4th, 2023

### Participants
- Hao
- Ben
- Devam
- Keran
- Yunlong
- Suhas

### Agenda
1. **Setting up the Client NPM**
2. **Updating the Initialize API**

### Meeting Details

#### Setting up the Client NPM
Hao and Suhas set up the Client NPM and gave a quick overview. There were a few comments on the latest PR, and Suhas worked on those.

#### Updating the Initialize API
Keran updated the 'initialize' API and it's associated documentation such that it returns relations and list of account info (graph data). Moreover, he also merged the basic-server-api into the backend branch and solved most comments. 

---

## Standup Meeting on December 5th, 2023

### Participants
- Hao
- Ben
- Keran
- Yunlong
- Suhas

### Agenda
1. **Review of the PRs**
2. **Adding Unit Tests for accountService.js and mastodon-adapter.js**
3. **UI changes to the Login Page**

### Meeting Details

#### Review of the PRs
Ben focused on reviews for PRs #3 and #8. He refactored the /initialize endpoint for #3 and prepared it for the node limit changes later. 

#### Adding Unit Tests for accountService.js and mastodon-adapter.js
Keran added unit tests in accountService.js and mastodon-adapter.js. There were some issues regarding the merging of his branch, and Hao and Keran fixed the issue together. 

#### UI changes to the Login Page
Yunlong gave two options for showing the instructions of how to find the username and server domain, and wanted some feedback from the team regarding that. One option was to hover on the link to show the picture of instructions. The second option was to click on the link to go to a separate page showing detailed instructions. The team decided to go ahead with the hover element.  

--- 

## Standup Meeting on December 7th, 2023

### Participants
- Hao
- Ben
- Keran
- Yunlong
- Suhas
- Omkar
- Devam
- Zheyu

### Agenda
1. **Discussing tasks**
2. **Creating a UI Page with a Drop-down Menu**
3. **Ranking Algorithm Task**

### Meeting Details

#### Discussing tasks
The team talked about a few remaining tasks of the project. The tasks were divvied up amongst the team mates based on their expertise in the area. Hao fixed a couple issues that Windows users were facing such as Prettiera and Start Node not working. 

#### Creating a UI Page with a Drop-down Menu
Omkar and Devam showcased a frontend UI page that lets you select the following two things from a drop down menu: 
1. Total Number of Followers
2. Total Number of Nodes

#### Ranking Algorithm Task
Ben and Zheyu discussed the ranking algorithm. Ben had a rough outline of what needed to be done, but the key question/difficulty was optimization. At the very least, it doesn't need to significantly slow down other things. 