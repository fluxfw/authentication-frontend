import { AUTHENTICATION_LOCALIZATION_MODULE } from "./Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("./Authentication/authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("./Authentication/Port/AuthenticationService.mjs").AuthenticationService} AuthenticationService */
/** @typedef {import("../../flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../../flux-loading-api/src/FluxLoadingApi.mjs").FluxLoadingApi} FluxLoadingApi */
/** @typedef {import("../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./Authentication/setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */
/** @typedef {import("./Authentication/showAuthentication.mjs").showAuthentication} showAuthentication */
/** @typedef {import("./Authentication/switchToOfflineMode.mjs").switchToOfflineMode} switchToOfflineMode */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FluxAuthenticationFrontend {
    /**
     * @type {AuthenticationService | null}
     */
    #authentication_service = null;
    /**
     * @type {FluxCssApi | null}
     */
    #flux_css_api;
    /**
     * @type {FluxLoadingApi | null}
     */
    #flux_loading_api;
    /**
     * @type {FluxLocalizationApi | null}
     */
    #flux_localization_api;

    /**
     * @param {FluxCssApi | null} flux_css_api
     * @param {FluxLoadingApi | null} flux_loading_api
     * @param {FluxLocalizationApi | null} flux_localization_api
     * @returns {FluxAuthenticationFrontend}
     */
    static new(flux_css_api = null, flux_loading_api = null, flux_localization_api = null) {
        return new this(
            flux_css_api,
            flux_loading_api,
            flux_localization_api
        );
    }

    /**
     * @param {FluxCssApi | null} flux_css_api
     * @param {FluxLoadingApi | null} flux_loading_api
     * @param {FluxLocalizationApi | null} flux_localization_api
     * @private
     */
    constructor(flux_css_api, flux_loading_api, flux_localization_api) {
        this.#flux_css_api = flux_css_api;
        this.#flux_loading_api = flux_loading_api;
        this.#flux_localization_api = flux_localization_api;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        if (this.#flux_css_api !== null) {
            this.#flux_css_api.importCssToRoot(
                document,
                `${__dirname}/Authentication/AuthenticationVariables.css`
            );
        }

        if (this.#flux_localization_api !== null) {
            await this.#flux_localization_api.addModule(
                `${__dirname}/Localization`,
                AUTHENTICATION_LOCALIZATION_MODULE
            );
        }
    }

    /**
     * @param {string} authentication_url
     * @param {showAuthentication} show_authentication
     * @param {switchToOfflineMode | null} switch_to_offline_mode
     * @returns {Promise<void>}
     */
    async authenticate(authentication_url, show_authentication, switch_to_offline_mode = null) {
        await (await this.#getAuthenticationService()).authenticate(
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
        await (await this.#getAuthenticationService()).showAuthentication(
            authenticate,
            set_hide_authentication,
            switch_to_offline_mode
        );
    }

    /**
     * @returns {Promise<AuthenticationService>}
     */
    async #getAuthenticationService() {
        this.#authentication_service ??= (await import("./Authentication/Port/AuthenticationService.mjs")).AuthenticationService.new(
            this.#flux_css_api,
            this.#flux_loading_api,
            this.#flux_localization_api
        );

        return this.#authentication_service;
    }
}
