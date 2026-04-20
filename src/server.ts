import { app } from "./app";
import { env } from "./config";

app.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}`);
    console.log(`Swagger docs available at http://localhost:${env.port}/api-docs`);
});
