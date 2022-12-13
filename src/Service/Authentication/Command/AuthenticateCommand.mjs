import { AUTHENTICATION_SUCCESS } from "../../../Adapter/Authentication/AUTHENTICATION_SUCCESS.mjs";

/** @typedef {import("../../../Adapter/Authentication/hideAuthentication.mjs").hideAuthentication} hideAuthentication */
/** @typedef {import("../../../Adapter/Authentication/resetAuthentication.mjs").resetAuthentication} resetAuthentication */
/** @typedef {import("../../../Adapter/Authentication/showAuthentication.mjs").showAuthentication} showAuthentication */

export class AuthenticateCommand {
    /**
     * @type {hideAuthentication | null}
     */
    #hide_authentication = null;
    /**
     * @type {number | null}
     */
    #interval = null;
    /**
     * @type {Window | null}
     */
    #popup = null;
    /**
     * @type {resetAuthentication | null}
     */
    #reset_authentication = null;

    /**
     * @returns {AuthenticateCommand}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {string} authentication_url
     * @param {showAuthentication} show_authentication
     * @returns {Promise<void>}
     */
    async authenticate(authentication_url, show_authentication) {
        addEventListener("message", this);

        await show_authentication(
            () => {
                this.#startAuthentication(
                    authentication_url
                );
            },
            (reset_authentication, hide_authentication) => {
                this.#reset_authentication = reset_authentication;
                this.#hide_authentication = hide_authentication;
            }
        );

        removeEventListener("message", this);

        this.#clearInterval();
    }

    /**
     * @param {Event} e
     * @returns {void}
     */
    handleEvent(e) {
        switch (true) {
            case e.target === globalThis:
                switch (e.type) {
                    case "message":
                        this.#popupEvent(
                            e
                        );
                        break;

                    default:
                        break;
                }
                break;

            default:
                break;
        }
    }

    /**
     * @returns {void}
     */
    #clearInterval() {
        if (this.#interval !== null) {
            clearInterval(this.#interval);
            this.#interval = null;
        }

        this.#popup = null;
    }

    /**
     * @param {MessageEvent} e
     * @returns {void}
     */
    #popupEvent(e) {
        if (e.origin !== location.origin) {
            return;
        }

        if (e.data !== AUTHENTICATION_SUCCESS) {
            return;
        }

        if (this.#popup === null) {
            return;
        }

        this.#clearInterval();

        if (this.#hide_authentication === null) {
            return;
        }

        const hide_authentication = this.#hide_authentication;

        this.#reset_authentication = null;
        this.#hide_authentication = null;

        hide_authentication();
    }

    /**
     * @param {string} authentication_url
     * @returns {void}
     */
    #startAuthentication(authentication_url) {
        if (this.#popup !== null) {
            return;
        }

        this.#clearInterval();

        this.#popup = open(authentication_url, "_blank", "menubar=no");

        this.#interval = setInterval(() => {
            if (this.#popup === null || !this.#popup.closed) {
                return;
            }

            this.#clearInterval();

            if (this.#reset_authentication === null) {
                return;
            }

            this.#reset_authentication();
        }, 2_000);
    }
}
