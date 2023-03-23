import { AUTHENTICATION_LOCALIZATION_MODULE } from "./Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("./Authentication/_authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./Authentication/setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */
/** @typedef {import("./Authentication/_showAuthentication.mjs").showAuthentication} showAuthentication */
/** @typedef {import("./Authentication/switchToOfflineMode.mjs").switchToOfflineMode} switchToOfflineMode */

export class FluxAuthenticationFrontend {
    /**
     * @type {FluxLocalizationApi | null}
     */
    #flux_localization_api;

    /**
     * @param {FluxLocalizationApi | null} flux_localization_api
     * @returns {FluxAuthenticationFrontend}
     */
    static new(flux_localization_api = null) {
        return new this(
            flux_localization_api
        );
    }

    /**
     * @param {FluxLocalizationApi | null} flux_localization_api
     * @private
     */
    constructor(flux_localization_api) {
        this.#flux_localization_api = flux_localization_api;

        this.#flux_localization_api.addModule(
            `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/Localization`,
            AUTHENTICATION_LOCALIZATION_MODULE
        );
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
        if (this.#flux_localization_api === null) {
            throw new Error("Missing FluxLocalizationApi");
        }

        await (await import("./Authentication/ShowAuthentication.mjs")).ShowAuthentication.new(
            this.#flux_localization_api
        )
            .showAuthentication(
                authenticate,
                set_hide_authentication,
                switch_to_offline_mode
            );
    }
}
