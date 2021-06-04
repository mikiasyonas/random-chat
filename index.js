const express = require('express');
const app = express();
const { Telegraf } = require('telegraf');

const dotenv = require('dotenv');

dotenv.config();


const bot = new Telegraf(process.env.BOT_TOKEN);
const URL = process.env.URL;
const PORT = process.env.PORT || 3000;

bot.telegram.setWebhook(`${ URL }/bot${ process.env.BOT_TOKEN }`);
app.use(bot.webhookCallback(`/bot${ process.env.BOT_TOKEN }`));

var matchedUsers = new Map();

class Queue {
    constructor () {
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
    }

    removeFirst () {
        if(this.isEmpty()) {
            return "No users left to remove";
        }

        return this.users.shift();
    }

    getFront () {
        if(this.isEmpty()) {
            return "No users left to remove";
        }

        return this.users[0];
    }

    isEmpty() {
        return this.users.length == 0;
    }

    printQueue() {
        for(var i = 0; i < this.users.length; i++) {
            console.log(this.users[i]);
        }
    }
    
}

var queue = new Queue();

bot.start((ctx) => {
    console.log(ctx.update.message.from);
    ctx.reply("Welcome to the bot");
});

bot.command('searchmatch', (ctx) => {
    let me = ctx.update.message.from.id;
   
    queue.addUser(me);

    if(!matchedUsers.has(me)) {
        ctx.reply('We are looking for a match for u.');
    }
    
    if(queue.users.length >= 2 && !matchedUsers.has(me)) {
        let firstUser = queue.getFront();
        queue.removeFirst();
        let secondUser = queue.getFront();
        queue.removeFirst();

        let user1 = {
            id: firstUser,
            matchedTo:secondUser
        }

        let user2 = {
            id: secondUser,
            matchedTo:firstUser
        }

        matchedUsers.set(firstUser, user1);
        matchedUsers.set(secondUser, user2);

        ctx.telegram.sendMessage(firstUser, "you have been matched with a user U can chat now");
        ctx.telegram.sendMessage(secondUser, "you have been matched with a user U can chat now");
    }

    console.table(matchedUsers);
    console.table(queue);

});

bot.command('leavechat', (ctx) => {
    let me = ctx.update.message.from.id;

    if(matchedUsers.has(me)) {
        let matchedTo = matchedUsers.get(me).matchedTo;

        matchedUsers.delete(me);
        ctx.telegram.sendMessage(me, "You Have left the chat U can look for another user when u want to.");
        matchedUsers.delete(matchedTo);
        ctx.telegram.sendMessage(matchedTo, "Your match has left the chat feel free to look for other match and chat.");
    } else {
        console.log('leave')
        console.log("get matched to a stranger first")
    }
});

bot.on('text',  (ctx) => {
    let me = ctx.update.message.from.id;
    console.table(me);
    if(matchedUsers.has(me)) {
        let myMatch = matchedUsers.get(me).matchedTo;
        let message = ctx.update.message.text;

        console.log(ctx.update.message.text);

        ctx.telegram.sendMessage(myMatch, message);
    } else {
        console.log('text')
        console.log("get matched to a stranger first");
    }
});

bot.launch();


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

app.get('/', (req, res) => {
    res.send('Well hello there');
});


app.listen(PORT, () => {
    console.log('server started at port 3000');
})


