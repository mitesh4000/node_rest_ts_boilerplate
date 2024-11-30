import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const connectionString = process.env.DATABASE_CONNECTION_STRING;

    if (!connectionString) {
      throw new Error(
        "DATABASE_CONNECTION_STRING is not defined in the environment variables."
      );
    }

    await mongoose.connect(connectionString);

    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with failure
  }
};

// Export the connection function and mongoose instance
export { connectToDatabase };
export default mongoose;
