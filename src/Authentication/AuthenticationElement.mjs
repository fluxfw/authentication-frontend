import { AUTHENTICATION_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";
import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";

/** @typedef {import("./_authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("../../../flux-loading-spinner/src/FluxLoadingSpinnerElement.mjs").FluxLoadingSpinnerElement} FluxLoadingSpinnerElement */
/** @typedef {import("../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */

flux_css_api.adopt(
    document,
    await flux_css_api.import(
        `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/AuthenticationElementVariables.css`
    ),
    true
);

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/AuthenticationElement.css`
);

export class AuthenticationElement extends HTMLElement {
    /**
     * @type {_authenticate}
     */
    #authenticate;
    /**
     * @type {HTMLDivElement}
     */
    #container_element;
    /**
     * @type {FluxLoadingSpinnerElement | null}
     */
    #flux_loading_spinner_element = null;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {_authenticate | null}
     */
    #switch_to_offline_mode;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {_authenticate} authenticate
     * @param {_authenticate | null} switch_to_offline_mode
     * @returns {AuthenticationElement}
     */
    static new(flux_localization_api, authenticate, switch_to_offline_mode = null) {
        return new this(
            flux_localization_api,
            authenticate,
            switch_to_offline_mode
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {_authenticate} authenticate
     * @param {_authenticate | null} switch_to_offline_mode
     * @private
     */
    constructor(flux_localization_api, authenticate, switch_to_offline_mode) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#authenticate = authenticate;
        this.#switch_to_offline_mode = switch_to_offline_mode;

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        flux_css_api.adopt(
            this.#shadow,
            css
        );

        this.#render();
    }

    /**
     * @returns {void}
     */
    reset() {
        for (const button_element of this.#shadow.querySelectorAll("button")) {
            button_element.disabled = false;
        }

        if (this.#flux_loading_spinner_element !== null) {
            this.#flux_loading_spinner_element.remove();
            this.#flux_loading_spinner_element = null;
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#container_element = document.createElement("div");
        this.#container_element.classList.add("container");

        const buttons_element = document.createElement("div");
        buttons_element.classList.add("buttons");

        const authenticate_button_element = document.createElement("button");
        authenticate_button_element.innerText = await this.#flux_localization_api.translate(
            "Authenticate",
            AUTHENTICATION_LOCALIZATION_MODULE
        );
        authenticate_button_element.type = "button";
        authenticate_button_element.addEventListener("click", () => {
            this.#start(
                this.#authenticate
            );
        });
        buttons_element.appendChild(authenticate_button_element);

        if (this.#switch_to_offline_mode !== null) {
            const switch_to_offline_mode_button_element = document.createElement("button");
            switch_to_offline_mode_button_element.innerText = await this.#flux_localization_api.translate(
                "Switch to offline mode",
                AUTHENTICATION_LOCALIZATION_MODULE
            );
            switch_to_offline_mode_button_element.type = "button";
            switch_to_offline_mode_button_element.addEventListener("click", () => {
                this.#start(
                    this.#switch_to_offline_mode
                );
            });
            buttons_element.appendChild(switch_to_offline_mode_button_element);
        }

        this.#container_element.appendChild(buttons_element);

        this.#shadow.appendChild(this.#container_element);
    }

    /**
     * @param {_authenticate} authenticate
     * @returns {Promise<void>}
     */
    async #start(authenticate) {
        this.reset();

        for (const button_element of this.#shadow.querySelectorAll("button")) {
            button_element.disabled = true;
        }

        this.#container_element.appendChild(this.#flux_loading_spinner_element = (await import("../../../flux-loading-spinner/src/FluxLoadingSpinnerElement.mjs")).FluxLoadingSpinnerElement.new());

        authenticate();
    }
}

export const AUTHENTICATION_ELEMENT_TAG_NAME = "flux-authentication";

customElements.define(AUTHENTICATION_ELEMENT_TAG_NAME, AuthenticationElement);
