/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../../flux-loading-api/src/Adapter/Api/LoadingApi.mjs").LoadingApi} LoadingApi */
/** @typedef {import("../../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Authentication/setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */
/** @typedef {import("../../../Adapter/Authentication/startAuthentication.mjs").startAuthentication} startAuthentication */

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
     * @param {startAuthentication} start_authentication
     * @param {setHideAuthentication} set_hide_authentication
     * @returns {Promise<void>}
     */
    async showAuthentication(start_authentication, set_hide_authentication) {
        const { AuthenticationElement } = await import("../../../Adapter/Authentication/AuthenticationElement.mjs");

        await new Promise(resolve => {
            const authentication_element = AuthenticationElement.new(
                this.#css_api,
                this.#loading_api,
                this.#localization_api,
                () => {
                    start_authentication();
                }
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
