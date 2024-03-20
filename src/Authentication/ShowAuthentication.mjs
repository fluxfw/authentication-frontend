import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATION_KEY_AUTHENTICATE, LOCALIZATION_KEY_AUTHENTICATION_REQUIRED, LOCALIZATION_KEY_SWITCH_TO_OFFLINE_MODE } from "../Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("./_authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("../Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */
/** @typedef {import("../StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

export class ShowAuthentication {
    /**
     * @type {Localization}
     */
    #localization;
    /**
     * @type {StyleSheetManager | null}
     */
    #style_sheet_manager;

    /**
     * @param {Localization} localization
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<ShowAuthentication>}
     */
    static async new(localization, style_sheet_manager = null) {
        return new this(
            localization,
            style_sheet_manager
        );
    }

    /**
     * @param {Localization} localization
     * @param {StyleSheetManager | null} style_sheet_manager
     * @private
     */
    constructor(localization, style_sheet_manager) {
        this.#localization = localization;
        this.#style_sheet_manager = style_sheet_manager;
    }

    /**
     * @param {_authenticate} authenticate
     * @param {setHideAuthentication} set_hide_authentication
     * @param {_authenticate | null} switch_to_offline_mode
     * @returns {Promise<void>}
     */
    async showAuthentication(authenticate, set_hide_authentication, switch_to_offline_mode = null) {
        const {
            promise,
            resolve
        } = Promise.withResolvers();

        const {
            FLUX_OVERLAY_ELEMENT_EVENT_BUTTON_CLICK,
            FLUX_OVERLAY_ELEMENT_VARIABLE_PREFIX,
            FluxOverlayElement
        } = await import("flux-overlay/src/FluxOverlayElement.mjs");

        const flux_overlay_element = await FluxOverlayElement.new(
            await this.#localization.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_AUTHENTICATION_REQUIRED
            ),
            null,
            [
                ...switch_to_offline_mode !== null ? [
                    {
                        label: await this.#localization.translate(
                            LOCALIZATION_MODULE,
                            LOCALIZATION_KEY_SWITCH_TO_OFFLINE_MODE

                        ),
                        value: "switch-to-offline-mode"
                    }
                ] : [],
                {
                    label: await this.#localization.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_AUTHENTICATE
                    ),
                    value: "authenticate"
                }
            ],
            this.#style_sheet_manager
        );

        flux_overlay_element.style.setProperty(`${FLUX_OVERLAY_ELEMENT_VARIABLE_PREFIX}z-index`, 1_000);

        flux_overlay_element.addEventListener(FLUX_OVERLAY_ELEMENT_EVENT_BUTTON_CLICK, async e => {
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

                resolve();
            }
        );

        return promise;
    }
}
