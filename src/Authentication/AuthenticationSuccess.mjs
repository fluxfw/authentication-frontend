import { AUTHENTICATION_SUCCESS } from "./AUTHENTICATION_SUCCESS.mjs";

if (opener !== null) {
    opener.postMessage({
        type: AUTHENTICATION_SUCCESS
    });

    close();
} else {
    //location.replace(`${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/../../../..`);
    location.replace("/");
}
