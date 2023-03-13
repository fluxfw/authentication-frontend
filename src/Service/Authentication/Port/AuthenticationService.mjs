/** @typedef {import("../../../Adapter/Authentication/authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../../flux-loading-api/src/Adapter/Api/LoadingApi.mjs").LoadingApi} LoadingApi */
/** @typedef {import("../../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Authentication/setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */
/** @typedef {import("../../../Adapter/Authentication/showAuthentication.mjs").showAuthentication} showAuthentication */
/** @typedef {import("../../../Adapter/Authentication/switchToOfflineMode.mjs").switchToOfflineMode} switchToOfflineMode */

export class AuthenticationService {
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
     * @returns {AuthenticationService}
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
     * @param {string} authentication_url
     * @param {showAuthentication} show_authentication
     * @param {switchToOfflineMode | null} switch_to_offline_mode
     * @returns {Promise<void>}
     */
    async authenticate(authentication_url, show_authentication, switch_to_offline_mode = null) {
        await (await import("../Command/AuthenticateCommand.mjs")).AuthenticateCommand.new()
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
        if (this.#css_api === null) {
            throw new Error("Missing CssApi");
        }
        if (this.#loading_api === null) {
            throw new Error("Missing LoadingApi");
        }
        if (this.#localization_api === null) {
            throw new Error("Missing LocalizationApi");
        }

        await (await import("../Command/ShowAuthenticationCommand.mjs")).ShowAuthenticationCommand.new(
            this.#css_api,
            this.#loading_api,
            this.#localization_api
        )
            .showAuthentication(
                authenticate,
                set_hide_authentication,
                switch_to_offline_mode
            );
    }
}
