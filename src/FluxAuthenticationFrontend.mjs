import { LOCALIZATION_MODULE } from "./Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATIONS } from "./Localization/LOCALIZATIONS.mjs";

/** @typedef {import("./Authentication/_authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("./Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./Authentication/setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */
/** @typedef {import("./Authentication/_showAuthentication.mjs").showAuthentication} showAuthentication */
/** @typedef {import("./StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */
/** @typedef {import("./Authentication/switchToOfflineMode.mjs").switchToOfflineMode} switchToOfflineMode */

export class FluxAuthenticationFrontend {
    /**
     * @type {Localization | null}
     */
    #localization;
    /**
     * @type {StyleSheetManager | null}
     */
    #style_sheet_manager;

    /**
     * @param {Localization | null} localization
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<FluxAuthenticationFrontend>}
     */
    static async new(localization = null, style_sheet_manager = null) {
        const flux_authentication_frontend = new this(
            localization,
            style_sheet_manager
        );

        if (flux_authentication_frontend.#localization !== null) {
            await flux_authentication_frontend.#localization.addModule(
                LOCALIZATION_MODULE,
                LOCALIZATIONS
            );
        }

        return flux_authentication_frontend;
    }

    /**
     * @param {Localization | null} localization
     * @param {StyleSheetManager | null} style_sheet_manager
     * @private
     */
    constructor(localization, style_sheet_manager) {
        this.#localization = localization;
        this.#style_sheet_manager = style_sheet_manager;
    }

    /**
     * @param {string} authentication_url
     * @param {showAuthentication} show_authentication
     * @param {switchToOfflineMode | null} switch_to_offline_mode
     * @returns {Promise<void>}
     */
    async authenticate(authentication_url, show_authentication, switch_to_offline_mode = null) {
        await (await (await import("./Authentication/Authenticate.mjs")).Authenticate.new())
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
        if (this.#localization === null) {
            throw new Error("Missing Localization!");
        }

        await (await (await import("./Authentication/ShowAuthentication.mjs")).ShowAuthentication.new(
            this.#localization,
            this.#style_sheet_manager
        ))
            .showAuthentication(
                authenticate,
                set_hide_authentication,
                switch_to_offline_mode
            );
    }
}
