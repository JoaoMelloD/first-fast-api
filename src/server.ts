import { app } from "./app";
import { env } from "./env";

const start = async () => {
  try {
    await app.listen({ port: env.PORT }).then(()=>{
      console.log("HTTP SERVER RODANDO...")
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
