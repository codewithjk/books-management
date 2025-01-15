import { createApp } from "./app";
import { connectToMongo } from "./config/mongo";

const PORT = 3000;

const startServer = async () => {
  const app = createApp();

  try {
    await connectToMongo();
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit the process with failure code
  }
};

startServer();
