import { AUTHENTICATION_SUCCESS } from "./AUTHENTICATION_SUCCESS.mjs";

//const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

if (opener !== null) {
    opener.postMessage(AUTHENTICATION_SUCCESS);

    close();
} else {
    //location.replace(`${__dirname}/../../../../..`);
    location.replace("/");
}
