# Node.js with Serverless Framework

This project is designed to guide your learning throughout the course. It is divided into branches, each with a different goal. Each branch represents a step in the course, and you can navigate between them to view the code for each stage.

Additionally, there are two branches: `completo-vm` and `completo-serverless`. Each one includes its own documentation containing the complete project code for the environment it runs in.

## Running Locally

The project was built as simply as possible to make it easy to use. No frameworks or libraries were used for the front end.

The entire project runs from the `index.mjs` file, which is the main entry point. To run it, just execute the following command:

```bash
node index.mjs
```

Or, if you prefer, you can use [nodemon](https://www.npmjs.com/package/nodemon) to run the project:

```bash
npm run dev
```

This ensures you don’t have to restart the server after every change you make. The entire front end of the application is located in the `interface` folder, and the whole API is contained within the `index.mjs` file.

Once the project is running, you can access the application at `http://localhost:3000`.