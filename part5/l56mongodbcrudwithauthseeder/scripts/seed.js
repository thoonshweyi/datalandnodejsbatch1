import 'dotenv/config' // load .env
import {MongoClient} from "mongodb"
import bcrypt from "bcrypt";

// MongoDB Atlas URI
const dbName = process.env.DB_NAME;
const dbURL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

const seedUserPassword = process.env.SEED_USER_PASSWORD;
const seedSource = "database-seeder";

function validateEnvironment(){
    if(!dbName){
        throw new Error("DB_NAME is missing in your .env file.");
    }

    if(!seedUserPassword || seedUserPassword.length < 8){
        throw new Error("SEED_USER_PASSWORD is missing in your .env file and must contain at least 8 characters");
    }
}

async function seedUsers(db, passwordHash, now){
    const userCollection = db.collection('users');

    const users = [
        {
            seedKey: "sun-admin",
            username: "Demo Admin",
            email: "demoadmin@gmail.com"
        },
        {
            seedKey: "moon-user",
            username: "Demo User",
            email: "demouser@gmail.com"
        },
    ];


    for(const user of users){
        await userCollection.updateOne(
            {email: user.email},
            {
                $set:{ // Update (if exists)
                    username: user.username,
                    password: passwordHash,
                    seedKey: user.seedKey,
                    seedSource,
                    updatedAt:now
                },
                $setOnInsert: {
                    createdAt: now
                } 
            },
            {upsert: true} // magic (exists Update, if not exist Create)

        )

    }

    // return ;
}

async function seedPosts(db, seededUsers, now){
    const postCollection = db.collection('posts');
    const demoadmin = seedUsers();

    const posts = [
        {
            seedKey: "mango-post",
            title: "Demo Post One",
            subtitle: "This is demo post one",
            slug: "demo-post-one",
            body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since"
        },
        {
            seedKey: "apple-post",
            title: "Demo Post Two",
            subtitle: "This is demo post two",
            slug: "demo-post-two",
            body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since"
        }
    ];


    for(const post of posts){
        await postCollection.updateOne(
            {slug: post.slug},
            {
                $set:{ // Update (if exists)
                    ...post,
                    seedSource,
                    updatedAt:now,
                    userId: '',
                    autherName: '',
                    imageURL: null,
                    imageURLS: [],
                    updatedAt: now,
                },
                $setOnInsert: {
                    viewCount: 0,
                    likes: [],
                    dislikes: [],
                    bookmarks: [],
                    createdAt: now
                } 
            },
            {upsert: true} // 

        )

    }
}

async function seedComments(db, seededUsers, seededPosts, now){
    
}

async function printSeedSummary(db){

}

async function main(){
    validateEnvironment();
    client = new MongoClient(dbURL);

    try{
        const db = client.db(dbName);
        const now = new Date();
        const passwordHash = await bcrypt.hash(seedUserPassword,10);
        
        const seedUsers = await seedUsers(db,passwordHash,now);
        await seedPosts(db,seedUsers,now);
    }finally{
        await client.close();
    }
}

main().catch(error=>{
    console.error("Database seeding failed: ", error.message);
    process.exitCode = 1;
})


//  How to create seeder?

    // create folder as "projectname > scripts"
    // create file as "projectname > scripts > seed.js"


// Seeder Job
    // Create User 2 
    // Create Post = 2
    // Create Comments = 2
    // About Page = 1 content