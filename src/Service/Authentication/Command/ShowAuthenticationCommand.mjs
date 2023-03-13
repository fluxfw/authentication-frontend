/** @typedef {import("../../../Adapter/Authentication/authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../../flux-loading-api/src/Adapter/Api/LoadingApi.mjs").LoadingApi} LoadingApi */
/** @typedef {import("../../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Authentication/setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */

export class ShowAuthenticationCommand {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {LoadingApi}
     */
    #loading_api;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {CssApi} css_api
     * @param {LoadingApi} loading_api
     * @param {LocalizationApi} localization_api
     * @returns {ShowAuthenticationCommand}
     */
    static new(css_api, loading_api, localization_api) {
        return new this(
            css_api,
            loading_api,
            localization_api
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LoadingApi} loading_api
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(css_api, loading_api, localization_api) {
        this.#css_api = css_api;
        this.#loading_api = loading_api;
        this.#localization_api = localization_api;
    }

    /**
     * @param {_authenticate} authenticate
     * @param {setHideAuthentication} set_hide_authentication
     * @param {_authenticate | null} switch_to_offline_mode
     * @returns {Promise<void>}
     */
    async showAuthentication(authenticate, set_hide_authentication, switch_to_offline_mode = null) {
        const { AuthenticationElement } = await import("../../../Adapter/Authentication/AuthenticationElement.mjs");

        await new Promise(resolve => {
            const authentication_element = AuthenticationElement.new(
                this.#css_api,
                this.#loading_api,
                this.#localization_api,
                () => {
                    authenticate();
                },
                switch_to_offline_mode !== null ? () => {
                    switch_to_offline_mode();
                } : null
            );

            document.body.appendChild(authentication_element);

            set_hide_authentication(
                () => {
                    authentication_element.reset();
                },
                () => {
                    authentication_element.remove();

                    resolve();
                }
            );
        });
    }
}
