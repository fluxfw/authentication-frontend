import { AUTHENTICATION_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

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
        let resolve_promise;

        const promise = new Promise(resolve => {
            resolve_promise = resolve;
        });

        const {
            FLUX_OVERLAY_BUTTON_CLICK_EVENT,
            FluxOverlayElement
        } = await import("../../../flux-overlay/src/FluxOverlayElement.mjs");

        const flux_overlay_element = FluxOverlayElement.new(
            await this.#flux_localization_api.translate(
                "Authentication required",
                AUTHENTICATION_LOCALIZATION_MODULE
            ),
            null,
            [
                {
                    label: await this.#flux_localization_api.translate(
                        "Authenticate",
                        AUTHENTICATION_LOCALIZATION_MODULE
                    ),
                    value: "authenticate"
                },
                ...switch_to_offline_mode !== null ? [
                    {
                        label: await this.#flux_localization_api.translate(
                            "Switch to offline mode",
                            AUTHENTICATION_LOCALIZATION_MODULE
                        ),
                        value: "switch-to-offline-mode"
                    }
                ] : []
            ]
        );

        flux_overlay_element.style.setProperty("--flux-overlay-z-index", 1000);

        flux_overlay_element.addEventListener(FLUX_OVERLAY_BUTTON_CLICK_EVENT, e => {
            flux_overlay_element.buttons = flux_overlay_element.buttons.map(button => ({
                ...button,
                disabled: true
            }));

            flux_overlay_element.loading = true;

            switch (e.detail.value) {
                case "authenticate":
                    authenticate();
                    break;

                case "switch-to-offline-mode":
                    switch_to_offline_mode();
                    break;

                default:
                    break;
            }
        });

        document.body.appendChild(flux_overlay_element);

        set_hide_authentication(
            () => {
                flux_overlay_element.buttons = flux_overlay_element.buttons.map(button => ({
                    ...button,
                    disabled: false
                }));

                flux_overlay_element.loading = false;
            },
            () => {
                flux_overlay_element.remove();

                resolve_promise();
            }
        );

        return promise;
    }
}
