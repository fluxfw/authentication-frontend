/** @typedef {import("./_authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("./setHideAuthentication.mjs").setHideAuthentication} setHideAuthentication */

/**
 * @typedef {(authenticate: _authenticate, set_hide_authentication: setHideAuthentication, switch_to_offline_mode: _authenticate | null) => Promise<void>} showAuthentication
 */
