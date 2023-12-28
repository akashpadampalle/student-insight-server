import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const db_user: string = process.env.DB_USER || "";
        const db_password: string = process.env.DB_PASSWORD || ""
        const db_url = `mongodb+srv://${db_user}:${db_password}@cluster0.m47z4i4.mongodb.net/?retryWrites=true&w=majority`

        await mongoose.connect(db_url)
        console.log("connected to db")
        
        return mongoose.connection 
    } catch (error) {
        return error
    }
}

export default connectDB