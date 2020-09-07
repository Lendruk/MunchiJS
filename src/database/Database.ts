import mongoose from "mongoose";

mongoose.set("debug", true);

const dbOptions: { [index: string]: any } = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};

if (!process.env.DOCKER) {
    dbOptions.auth = {
        user: process.env.DATABASE_USERNAME as string,
        password: process.env.DATABASE_PASSWORD as string,
    };
}

// const connectToDb = async () => await mongoose.connect(process.env.DATABASE_CONNECTION_STRING as string, dbOptions);

export { mongoose };
// export default connectToDb;
