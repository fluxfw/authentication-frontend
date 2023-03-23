/** @typedef {import("./_authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */

export class ShowAuthentication {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @returns {ShowAuthentication}
     */
    static new(flux_localization_api) {
        return new this(
            flux_localization_api
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @private
     */
    constructor(flux_localization_api) {
        this.#flux_localization_api = flux_localization_api;
    }

    /**
     * @param {_authenticate} authenticate
     * @param {setHideAuthentication} set_hide_authentication
     * @param {_authenticate | null} switch_to_offline_mode
     * @returns {Promise<void>}
     */
    async showAuthentication(authenticate, set_hide_authentication, switch_to_offline_mode = null) {
        const { AuthenticationElement } = await import("./AuthenticationElement.mjs");

        await new Promise(resolve => {
            const authentication_element = AuthenticationElement.new(
                this.#flux_localization_api,
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
