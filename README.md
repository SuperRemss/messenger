# Messenger app

Messenger app a chat REST API, you'll be able to talk with others, create groups and send messages  
##Setup
### Requirements

* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)
* [Postman](https://www.postman.com/)

### Installation

If you have **Git** installed, just follow the instructions below to install the project on your machine  
If that's not the case you can install it [here](https://github.com/git-guides/install-git)

```bash
git clone https://github.com/SuperRemss/messenger.git
cd "messenger"
npm install
```
### Usage
To run the app, in the project folder, open a shell and run this command : 
````shell
npm start
````
You can now connect your MongoDB to this address `mongodb://localhost:27017/messenger`

Finally, open Postman and import the file `messenger_back_end.postman_collection.json`

The setup is now done, you can use the app as you please

## Features
 - Users
   - Create a user
   - Login & Logout
   - View all users
   - View a specific user
 - Discussions
     - Create a discussion
     - Add a user to the discussion
     - Delete a user from a discussion (if you are a member of it)
     - Leave a discussion
     - View all discussions
     - View a specific discussion
 - Messages
     - Send a message in a discussion
     - View all messages (with a pagination)
     - View one message
     - View messages you sent (with pagination)


## Authors

Rémy Vianne aka [@SuperRemss](https://github.com/SuperRemss/)