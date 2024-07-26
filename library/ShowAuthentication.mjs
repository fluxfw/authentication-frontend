import { LOCALIZATION_MODULE_AUTHENTICATION_FRONTEND } from "./Localization/LOCALIZATION_MODULE_AUTHENTICATION_FRONTEND.mjs";
import { LOCALIZATION_KEY_AUTHENTICATION_FRONTEND_AUTHENTICATE, LOCALIZATION_KEY_AUTHENTICATION_FRONTEND_AUTHENTICATION_REQUIRED, LOCALIZATION_KEY_AUTHENTICATION_FRONTEND_SWITCH_TO_OFFLINE_MODE } from "./Localization/LOCALIZATION_KEY_AUTHENTICATION_FRONTEND.mjs";

/** @typedef {import("./_authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("./Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */
/** @typedef {import("./StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

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
            OVERLAY_ELEMENT_EVENT_BUTTON_CLICK,
            OVERLAY_ELEMENT_VARIABLE_PREFIX,
            OverlayElement
        } = await import("overlay/OverlayElement.mjs");

        const overlay_element = await OverlayElement.new(
            await this.#localization.translate(
                LOCALIZATION_MODULE_AUTHENTICATION_FRONTEND,
                LOCALIZATION_KEY_AUTHENTICATION_FRONTEND_AUTHENTICATION_REQUIRED
            ),
            null,
            null,
            [
                ...switch_to_offline_mode !== null ? [
                    {
                        label: await this.#localization.translate(
                            LOCALIZATION_MODULE_AUTHENTICATION_FRONTEND,
                            LOCALIZATION_KEY_AUTHENTICATION_FRONTEND_SWITCH_TO_OFFLINE_MODE

                        ),
                        value: "switch-to-offline-mode"
                    }
                ] : [],
                {
                    label: await this.#localization.translate(
                        LOCALIZATION_MODULE_AUTHENTICATION_FRONTEND,
                        LOCALIZATION_KEY_AUTHENTICATION_FRONTEND_AUTHENTICATE
                    ),
                    value: "authenticate"
                }
            ],
            this.#style_sheet_manager
        );

        overlay_element.style.setProperty(`${OVERLAY_ELEMENT_VARIABLE_PREFIX}z-index`, 1_000);

        overlay_element.addEventListener(OVERLAY_ELEMENT_EVENT_BUTTON_CLICK, async e => {
            overlay_element.buttons = true;

            await overlay_element.showLoading();

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

        overlay_element.show();

        set_hide_authentication(
            async () => {
                overlay_element.buttons = false;

                await overlay_element.showLoading(
                    false
                );
            },
            async () => {
                overlay_element.remove();

                resolve();
            }
        );

        return promise;
    }
}
