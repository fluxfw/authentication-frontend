import { AUTHENTICATION_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../Authentication/authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("../../Service/Authentication/Port/AuthenticationService.mjs").AuthenticationService} AuthenticationService */
/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../flux-loading-api/src/Adapter/Api/LoadingApi.mjs").LoadingApi} LoadingApi */
/** @typedef {import("../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../Authentication/setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */
/** @typedef {import("../Authentication/showAuthentication.mjs").showAuthentication} showAuthentication */
/** @typedef {import("../Authentication/switchToOfflineMode.mjs").switchToOfflineMode} switchToOfflineMode */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class AuthenticationFrontendApi {
    /**
     * @type {AuthenticationService | null}
     */
    #authentication_service = null;
    /**
     * @type {CssApi | null}
     */
    #css_api;
    /**
     * @type {LoadingApi | null}
     */
    #loading_api;
    /**
     * @type {LocalizationApi | null}
     */
    #localization_api;

    /**
     * @param {CssApi | null} css_api
     * @param {LoadingApi | null} loading_api
     * @param {LocalizationApi | null} localization_api
     * @returns {AuthenticationFrontendApi}
     */
    static new(css_api = null, loading_api = null, localization_api = null) {
        return new this(
            css_api,
            loading_api,
            localization_api
        );
    }

    /**
     * @param {CssApi | null} css_api
     * @param {LoadingApi | null} loading_api
     * @param {LocalizationApi | null} localization_api
     * @private
     */
    constructor(css_api, loading_api, localization_api) {
        this.#css_api = css_api;
        this.#loading_api = loading_api;
        this.#localization_api = localization_api;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        if (this.#css_api !== null) {
            this.#css_api.importCssToRoot(
                document,
                `${__dirname}/../Authentication/AuthenticationVariables.css`
            );
        }

        if (this.#localization_api !== null) {
            await this.#localization_api.addModule(
                `${__dirname}/../Localization`,
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
        this.#authentication_service ??= (await import("../../Service/Authentication/Port/AuthenticationService.mjs")).AuthenticationService.new(
            this.#css_api,
            this.#loading_api,
            this.#localization_api
        );

        return this.#authentication_service;
    }
}
