import { AUTHENTICATION_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../flux-loading-api/src/Adapter/Api/LoadingApi.mjs").LoadingApi} LoadingApi */
/** @typedef {import("../../../../flux-loading-api/src/Adapter/Loading/LoadingElement.mjs").LoadingElement} LoadingElement */
/** @typedef {import("../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("./startAuthentication.mjs").startAuthentication} startAuthentication */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class AuthenticationElement extends HTMLElement {
    /**
     * @type {HTMLButtonElement}
     */
    #button_element;
    /**
     * @type {HTMLDivElement}
     */
    #container_element;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {LoadingElement | null}
     */
    #loading_element = null;
    /**
     * @type {LoadingApi}
     */
    #loading_api;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {startAuthentication}
     */
    #start_authentication;

    /**
     * @param {CssApi} css_api
     * @param {LoadingApi} loading_api
     * @param {LocalizationApi} localization_api
     * @param {startAuthentication} start_authentication
     * @returns {AuthenticationElement}
     */
    static new(css_api, loading_api, localization_api, start_authentication) {
        return new this(
            css_api,
            loading_api,
            localization_api,
            start_authentication
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LoadingApi} loading_api
     * @param {LocalizationApi} localization_api
     * @param {startAuthentication} start_authentication
     * @private
     */
    constructor(css_api, loading_api, localization_api, start_authentication) {
        super();

        this.#css_api = css_api;
        this.#loading_api = loading_api;
        this.#localization_api = localization_api;
        this.#start_authentication = start_authentication;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @returns {void}
     */
    reset() {
        this.#button_element.disabled = false;

        if (this.#loading_element !== null) {
            this.#loading_element.remove();
            this.#loading_element = null;
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#container_element = document.createElement("div");
        this.#container_element.classList.add("container");

        this.#button_element = document.createElement("button");
        this.#button_element.innerText = await this.#localization_api.translate(
            "Authenticate",
            AUTHENTICATION_LOCALIZATION_MODULE
        );
        this.#button_element.type = "button";
        this.#button_element.addEventListener("click", () => {
            this.#startAuthentication();
        });
        this.#container_element.appendChild(this.#button_element);

        this.#shadow.appendChild(this.#container_element);
    }

    /**
     * @returns {Promise<void>}
     */
    async #startAuthentication() {
        this.reset();

        this.#button_element.disabled = true;

        this.#container_element.appendChild(this.#loading_element = await this.#loading_api.getLoadingElement());

        this.#start_authentication();
    }
}

export const AUTHENTICATION_ELEMENT_TAG_NAME = "flux-authentication";

customElements.define(AUTHENTICATION_ELEMENT_TAG_NAME, AuthenticationElement);
