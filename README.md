# Insta_Unfollowers_Bot

This bot automates the process of finding and unfollowing users who do not follow you back on Instagram, and then proceeds to unfollow users that do not follow your account back. 


Requirements
- Node.js and npm
- Puppeteer - a Node library which provides a high-level API to control headless Chrome or Chromium
- fs/promises - a Node.js module that offers a way to interact with the file system using promises
- readline - a Node.js built-in module for creating a command-line interface


Usage
- Clone the repository
- Run `npm init` to get `node_modules`
- Run `npm i puppeteer` to install `puppeteer`
- Run `npm install readline` to install `readline`
- Run node script.js in the terminal
- Enter your Instagram username and password when prompted
- The bot will take care of the rest and show you a list of users who do not follow you back
- Then the bot will ask if you want to remove any users from the list of unfollowers
- The bot will unfollow people that do not follow your account back on Instagram with max of 15 users removed per hour.


How it Works
- The bot launches a headless browser (Chromium) using Puppeteer and logs into your Instagram account. It then navigates to your list of followers and following and collects their names. The bot compares the lists and returns a list of users who you follow but do not follow you back. Then, the bot will ask if you want to remove any user from the unfollowers list, so that particular user does not get unfollowed. Then, the bot will proceed to unfollow 15 users per hour to avoid an Instagram Ban.
- Note: The code uses hard-coded selectors to scrape data from the web pages. These selectors may change in the future as Instagram updates its website, in which case the code may not work as expected.


Disclaimer:
- A warning that using the project is done at the user's own risk and the developers are not responsible for any Instagram account bans, violations or restrictions.
