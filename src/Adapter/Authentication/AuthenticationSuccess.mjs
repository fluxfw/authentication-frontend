import { AUTHENTICATION_SUCCESS } from "./AUTHENTICATION_SUCCESS.mjs";

if (opener !== null) {
    opener.postMessage(AUTHENTICATION_SUCCESS);

    close();
} else {
    location.replace("/");
}
