import { LOCALIZATION_MODULE_AUTHENTICATION } from "../Localization/LOCALIZATION_MODULE.mjs";

/** @typedef {import("./_authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("../Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */

export class ShowAuthentication {
    /**
     * @type {Localization}
     */
    #localization;

    /**
     * @param {Localization} localization
     * @returns {ShowAuthentication}
     */
    static new(localization) {
        return new this(
            localization
        );
    }

    /**
     * @param {Localization} localization
     * @private
     */
    constructor(localization) {
        this.#localization = localization;
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
            FLUX_OVERLAY_EVENT_BUTTON_CLICK
        } = await import("../../../flux-overlay/src/FLUX_OVERLAY_EVENT.mjs");
        const {
            FluxOverlayElement
        } = await import("../../../flux-overlay/src/FluxOverlayElement.mjs");

        const flux_overlay_element = FluxOverlayElement.new(
            await this.#localization.translate(
                "Authentication required",
                LOCALIZATION_MODULE_AUTHENTICATION
            ),
            null,
            [
                ...switch_to_offline_mode !== null ? [
                    {
                        label: await this.#localization.translate(
                            "Switch to offline mode",
                            LOCALIZATION_MODULE_AUTHENTICATION
                        ),
                        value: "switch-to-offline-mode"
                    }
                ] : [],
                {
                    label: await this.#localization.translate(
                        "Authenticate",
                        LOCALIZATION_MODULE_AUTHENTICATION
                    ),
                    value: "authenticate"
                }
            ]
        );

        flux_overlay_element.style.setProperty("--flux-overlay-z-index", 1000);

        flux_overlay_element.addEventListener(FLUX_OVERLAY_EVENT_BUTTON_CLICK, async e => {
            flux_overlay_element.buttons = true;

            await flux_overlay_element.showLoading();

            switch (e.detail.button) {
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

        flux_overlay_element.show();

        set_hide_authentication(
            async () => {
                flux_overlay_element.buttons = false;

                await flux_overlay_element.showLoading(
                    false
                );
            },
            () => {
                flux_overlay_element.remove();

                resolve_promise();
            }
        );

        return promise;
    }
}
