const DC = require("dbjslib");
const client = new DC("token");

client.on("ready", () => {
    console.log("Connected to Danktronics Chat.");
    client.createMessage("Hey my dudes.");
});

client.on("message", data => {
    console.log(data);
});

client.connect();

