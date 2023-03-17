/** @typedef {import("../authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("../../../../flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../../../../flux-loading-api/src/FluxLoadingApi.mjs").FluxLoadingApi} FluxLoadingApi */
/** @typedef {import("../../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */
/** @typedef {import("../showAuthentication.mjs").showAuthentication} showAuthentication */
/** @typedef {import("../switchToOfflineMode.mjs").switchToOfflineMode} switchToOfflineMode */

export class AuthenticationService {
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
     * @returns {AuthenticationService}
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
        if (this.#flux_css_api === null) {
            throw new Error("Missing FluxCssApi");
        }
        if (this.#flux_loading_api === null) {
            throw new Error("Missing FluxLoadingApi");
        }
        if (this.#flux_localization_api === null) {
            throw new Error("Missing FluxLocalizationApi");
        }

        await (await import("../Command/ShowAuthenticationCommand.mjs")).ShowAuthenticationCommand.new(
            this.#flux_css_api,
            this.#flux_loading_api,
            this.#flux_localization_api
        )
            .showAuthentication(
                authenticate,
                set_hide_authentication,
                switch_to_offline_mode
            );
    }
}
