import { AUTHENTICATION_SUCCESS } from "../AUTHENTICATION_SUCCESS.mjs";

/** @typedef {import("../hideAuthentication.mjs").hideAuthentication} hideAuthentication */
/** @typedef {import("../resetAuthentication.mjs").resetAuthentication} resetAuthentication */
/** @typedef {import("../showAuthentication.mjs").showAuthentication} showAuthentication */
/** @typedef {import("../switchToOfflineMode.mjs").switchToOfflineMode} switchToOfflineMode */

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
     * @param {switchToOfflineMode | null} switch_to_offline_mode
     * @returns {Promise<void>}
     */
    async authenticate(authentication_url, show_authentication, switch_to_offline_mode = null) {
        addEventListener("message", this);

        await show_authentication(
            () => {
                this.#authenticate(
                    authentication_url
                );
            },
            (reset_authentication, hide_authentication) => {
                this.#reset_authentication = reset_authentication;
                this.#hide_authentication = hide_authentication;
            },
            switch_to_offline_mode !== null ? () => {
                this.#switchToOfflineMode(
                    switch_to_offline_mode
                );
            } : null
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
     * @param {string} authentication_url
     * @returns {void}
     */
    #authenticate(authentication_url) {
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
     * @returns {hideAuthentication | null}
     */
    #getHideAuthentication() {
        const hide_authentication = this.#hide_authentication;

        this.#reset_authentication = null;
        this.#hide_authentication = null;

        return hide_authentication;
    }

    /**
     * @param {MessageEvent} e
     * @returns {void}
     */
    #popupEvent(e) {
        if (e.origin !== location.origin) {
            return;
        }

        if ((e.data ?? null) === null || typeof e.data !== "object") {
            return;
        }

        switch (e.data.type) {
            case AUTHENTICATION_SUCCESS: {
                if (this.#popup === null) {
                    return;
                }

                this.#clearInterval();

                const hide_authentication = this.#getHideAuthentication();

                if (hide_authentication === null) {
                    return;
                }

                hide_authentication();
            }
                break;

            default:
                break;
        }
    }

    /**
     * @param {switchToOfflineMode} switch_to_offline_mode
     * @returns {Promise<void>}
     */
    async #switchToOfflineMode(switch_to_offline_mode) {
        const hide_authentication = this.#getHideAuthentication();

        if (hide_authentication === null) {
            return;
        }

        await switch_to_offline_mode();

        hide_authentication();
    }
}
