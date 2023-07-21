import { LOCALIZATION_MODULE } from "./Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATIONS } from "./Localization/LOCALIZATIONS.mjs";

/** @typedef {import("./Authentication/_authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("./Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./Authentication/setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */
/** @typedef {import("./Authentication/_showAuthentication.mjs").showAuthentication} showAuthentication */
/** @typedef {import("./Authentication/switchToOfflineMode.mjs").switchToOfflineMode} switchToOfflineMode */

export class FluxAuthenticationFrontend {
    /**
     * @type {Localization | null}
     */
    #localization;

    /**
     * @param {Localization | null} localization
     * @returns {Promise<FluxAuthenticationFrontend>}
     */
    static async new(localization = null) {
        const flux_authentication_frontend = new this(
            localization
        );

        if (flux_authentication_frontend.#localization !== null) {
            await flux_authentication_frontend.#localization.addModule(
                LOCALIZATION_MODULE,
                LOCALIZATIONS
            );
        }

        return flux_authentication_frontend;
    }

    /**
     * @param {Localization | null} localization
     * @private
     */
    constructor(localization) {
        this.#localization = localization;
    }

    /**
     * @param {string} authentication_url
     * @param {showAuthentication} show_authentication
     * @param {switchToOfflineMode | null} switch_to_offline_mode
     * @returns {Promise<void>}
     */
    async authenticate(authentication_url, show_authentication, switch_to_offline_mode = null) {
        await (await import("./Authentication/Authenticate.mjs")).Authenticate.new()
            .authenticate(
                authentication_url,
                show_authentication,
                switch_to_offline_mode
            );
    }

    /**
     * @param {_authenticate} authenticate
     * @param {setHideAuthentication} set_hide_authentication
     * @param {_authenticate | null} switch_to_offline_mode
     * @returns {Promise<void>}
     */
    async showAuthentication(authenticate, set_hide_authentication, switch_to_offline_mode = null) {
        if (this.#localization === null) {
            throw new Error("Missing Localization");
        }

        await (await import("./Authentication/ShowAuthentication.mjs")).ShowAuthentication.new(
            this.#localization
        )
            .showAuthentication(
                authenticate,
                set_hide_authentication,
                switch_to_offline_mode
            );
    }
}
