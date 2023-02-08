const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const readline = require('readline');

async function start(){
    console.log("Instagram Unfollowers Bot\n")

    // readline api to take input from terminal
    const{ stdin: input, stdout: output} = require('node:process')
    const r1 = readline.createInterface({input, output})

    //User Enters Username
    let f1;
    const a1 = new Promise(x => f1 = x)
    r1.question('Enter Username: ', (username) =>{
        f1(username)
        r1.close
    })
    const username = await a1

    //User enters Password
    let f2;
    const a2 = new Promise(x => f2 = x)
    r1.question('Enter Password: ', (password) =>{
        f2(password)
        r1.close
    })
    const password = await a2

    //Opens Chromion and goes to Instagram Sign In page
    const broswer = await puppeteer.launch({headless : false, defaultViewport : null})
    const page = await broswer.newPage()
    await page.goto("https://www.instagram.com/")

    //Wait 5 seconds
    await delay(5000)

    //Types in Username and Password
    await page.type('input[name = username]', username, {delay: 100})
    await page.type('input[name = password]', password, {delay: 100})

    // Wait 3 Seconds
    await delay(3000)

    //clicks login button
    await page.click('button[type=submit]')
    
    //Deals with pop up
    await delay(7000)
    await page.click('button[type=button]')

    await delay(7000)
    //Deals with Notification popup
    await page.waitForSelector('button._a9--._a9_1')
    const myButton = await page.$('button._a9--._a9_1')
    await myButton.click()

    //Goes to profile page
    await delay(10000)
    await page.goto("https://www.instagram.com/" + username + "/")

    // Goes to following list
    await delay(10000)
    await page.goto("https://www.instagram.com/" + username + "/following/")

    //Scroll Down the list of followings
    await page.waitForSelector('div[class="_aano"]')
    let previousH = 0;
    while (true){

        await page.evaluate(() => {
            document.querySelector('._aano').scrollTo(0, document.querySelector('._aano').scrollHeight)
        })

        currentH = await page.evaluate(() => document.querySelector('._aano').scrollHeight)
        
        if((currentH - previousH) == 0){
            break;
        }
        previousH = currentH;

        await delay(3000)
    }     
    
    await delay(2000)  

    //Gets list of following
    // div > div > div > div > div > a > span > div
    await page.waitForSelector('div > div > div > div > div > a > span > div')
    const following = await page.evaluate(() =>{
        return Array.from(document.querySelectorAll('div > div > div > div > div > a > span > div')).map(x => x.textContent)
    })

    //if they have 'Verifed' Remove it from strings in array
    let i = 0;
    while(i < following.length){
        if(following[i].includes("Verified")){
            following[i] = following[i].replace('Verified','')
        }
        i = i + 1
    }

    //Goes to User's followers list
    await delay(10000)
    await page.goto("https://www.instagram.com/" + username + "/followers/")

    //Scroll Down the list of followers
    await page.waitForSelector('div[class="_aano"]')
    previousH = 0;
    while (true){

        await page.evaluate(() => {
            document.querySelector('._aano').scrollTo(0, document.querySelector('._aano').scrollHeight)
        })

        currentH = await page.evaluate(() => document.querySelector('._aano').scrollHeight)
        
        if((currentH - previousH) == 0){
            break;
        }
        previousH = currentH;

        await delay(3000)
    } 

    //Get accounts from followers list - may change as website updates
    //div > div > div > div > div > a > span > div
    await page.waitForSelector('div > div > div > div > div > a > span > div')
    const followers = await page.evaluate(() =>{
        return Array.from(document.querySelectorAll('div > div > div > div > div > a > span > div')).map(x => x.textContent)
    })

    //If account in followers is Verifed, it will remove that part.
    i = 0;
    while(i < following.length){
        if(following[i].includes("Verified")){
            following[i] = following[i].replace('Verified','')
        }
        i = i + 1
    }

    // Finds people that don't follow you back in the unfollowers list
    var unfollowers = []
    for(let i = 0; i < following.length; i++){
        if(followers.indexOf(following[i]) == -1){
            unfollowers.push(following[i])
        }
    }

    //Displays Accounts Needed to be unfollowed
    var choice1 = 0
    do{
        console.log("List of Accounts to Unfollow: \n")
        for(let i = 0; i < unfollowers.length; i++){
            console.log((i+1) +". "+ unfollowers[i])
        }
        
        console.log("Type # of Account to remove from List or Type '0' to Continue. ");
        let fulfill;
        const answerPromise = new Promise(x => fulfill = x)
        r1.question('Input: ', (choice) =>{
            fulfill(choice)
            r1.close
        })
        const choice = await answerPromise
        choice1 = choice

        if(choice != 0 ){
            if(choice >= 2){
                unfollowers.splice(choice-1,1)
            }else{
                unfollowers.shift()
            }
        }

    }while(choice1 != 0);

    await delay(9000)

    //Goes to each unfollowers in array then unfollows them at a safe rate of 30 unfollows at an hours
    let count = 0;
    for(let i = 0; i < unfollowers.length; i++){
        // Goes to their instagram
        await page.goto("https://www.instagram.com/" + unfollowers[i] + "/")
        
        //Wait for page to load
        let r1 = Math.random() * (10000 - 4000) + 4000
        await delay(r1)

        //Clicks "Following" button
        await page.waitForSelector('button[type=button]')
        const followingButton = await page.$('button[type=button]')
        await followingButton.click()

        let r2 = Math.random() * (15000 - 3500) + 3500
        await delay(r2)

        //Clicks "Unfollow" button
        await page.waitForSelector('._abm4')
        const unfollowButton = await page.$$('._abm4')
        await unfollowButton[unfollowButton.length-1].click()

        console.log("Unfollowed " + unfollowers[i])

        count = count + 1 

        if(count == 25){
            console.log("WAITING AN HOUR!!!")
            await delay(3600000)
            count = 0
        }

        let r3 = Math.random() * (60000 - 30000) + 30000
        await delay(r3)
    }

    console.log("Complete")

    //Closes Broswer
    await broswer.close()
}


start()