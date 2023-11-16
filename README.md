# 210-Team4-TDD
A team project by UCSD grad students in CSE 210 from team 4 Thomas-Driven Development (TDD), providing a data visualization tool for analyzing your local social media network within the Fediverse.

things to add:
more detailed high level scope, with pictures
use instructions
troubleshooting tips
license?
potential future work
tech stack (i.e. languages and frameworks used)
how to run tests

Demo for getting data from Mastodon API and save data in GUN.js database

How to run:
`npm install` and then
`NODE=10000 node index.js`

**Get account post list**
`curl http://localhost:10000/api/v1/account/109252111498807689`

**Get post detail**
`curl http://localhost:10000/api/v1/account/109252111498807689/post/111378929013053435`
>>>>>>> 3eeb722 (Existing work of the backend demo)
