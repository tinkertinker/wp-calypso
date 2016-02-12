/**
 * Any new action type should be added to the set of exports below, with the
 * value mirroring its exported name.
 *
 * Please keep this list alphabetized!
 *
 * Unsure how to name an action type? Refer to our guidelines:
 *  - https://wpcalypso.wordpress.com/devdocs/docs/our-approach-to-data.md#actions
 */

// TODO: Move to correct place when ready for support chat

export const LIVE_CHAT_CONNECT = 'LIVE_CHAT_CONNECT';
export const LIVE_CHAT_CONNECTING = 'LIVE_CHAT_CONNECTING';
export const LIVE_CHAT_CONNECTED = 'LIVE_CHAT_CONNECTED';
export const LIVE_CHAT_CLOSING = 'LIVE_CHAT_CLOSING';
export const LIVE_CHAT_SET_MESSAGE = 'LIVE_CHAT_SET_MESSAGE';
export const LIVE_CHAT_MINIMIZE = 'LIVE_CHAT_MINIMIZE';
export const LIVE_CHAT_RECEIVE_EVENT = 'LIVE_CHAT_RECEIVE_EVENT';
export const LIVE_CHAT_SET_AUTOSCROLL = 'LIVE_CHAT_SET_AUTOSCROLL';

export const CONNECTION_LOST = 'CONNECTION_LOST';
export const CONNECTION_RESTORED = 'CONNECTION_RESTORED';
export const CURRENT_USER_ID_SET = 'CURRENT_USER_ID_SET';
export const DESERIALIZE = 'DESERIALIZE';
export const EDITOR_CONTACT_FORM_ADD_DEFAULT_FIELD = 'EDITOR_CONTACT_FORM_ADD_DEFAULT_FIELD';
export const EDITOR_CONTACT_FORM_CLEAR_FORM = 'EDITOR_CONTACT_FORM_CLEAR_FORM';
export const EDITOR_CONTACT_FORM_LOAD_FORM = 'EDITOR_CONTACT_FORM_LOAD_FORM';
export const EDITOR_CONTACT_FORM_REMOVE_FIELD = 'EDITOR_CONTACT_FORM_REMOVE_FIELD';
export const EDITOR_MEDIA_EDIT_ITEM_SET = 'EDITOR_MEDIA_EDIT_ITEM_SET';
export const EXPORT_ADVANCED_SETTINGS_FETCH = 'EXPORT_ADVANCED_SETTINGS_FETCH';
export const EXPORT_ADVANCED_SETTINGS_FETCH_FAIL = 'EXPORT_ADVANCED_SETTINGS_FETCH_FAIL';
export const EXPORT_ADVANCED_SETTINGS_RECEIVE = 'EXPORT_ADVANCED_SETTINGS_RECEIVE';
export const EXPORT_CLEAR = 'EXPORT_CLEAR';
export const EXPORT_COMPLETE = 'EXPORT_COMPLETE';
export const EXPORT_FAILURE = 'EXPORT_FAILURE';
export const EXPORT_START_REQUEST = 'EXPORT_START_REQUEST';
export const EXPORT_STARTED = 'EXPORT_STARTED';
export const EXPORT_STATUS_FETCH = 'EXPORT_STATUS_FETCH';
export const FETCH_WPORG_PLUGIN_DATA = 'FETCH_WPORG_PLUGIN_DATA';
export const NEW_NOTICE = 'NEW_NOTICE';
export const POST_REQUEST = 'POST_REQUEST';
export const POST_REQUEST_SUCCESS = 'POST_REQUEST_SUCCESS';
export const POST_REQUEST_FAILURE = 'POST_REQUEST_FAILURE';
export const POST_TYPES_RECEIVE = 'POST_TYPES_RECEIVE';
export const POST_TYPES_REQUEST = 'POST_TYPES_REQUEST';
export const POST_TYPES_REQUEST_SUCCESS = 'POST_TYPES_REQUEST_SUCCESS';
export const POST_TYPES_REQUEST_FAILURE = 'POST_TYPES_REQUEST_FAILURE';
export const POSTS_RECEIVE = 'POSTS_RECEIVE';
export const POSTS_REQUEST = 'POSTS_REQUEST';
export const POSTS_REQUEST_FAILURE = 'POSTS_REQUEST_FAILURE';
export const POSTS_REQUEST_SUCCESS = 'POSTS_REQUEST_SUCCESS';
export const PUBLICIZE_CONNECTIONS_RECEIVE = 'PUBLICIZE_CONNECTIONS_RECEIVE';
export const PUBLICIZE_CONNECTIONS_REQUEST = 'PUBLICIZE_CONNECTIONS_REQUEST';
export const PUBLICIZE_CONNECTIONS_REQUEST_FAILURE = 'PUBLICIZE_CONNECTIONS_REQUEST_FAILURE';
export const READER_FULLPOST_SHOW = 'READER_FULLPOST_SHOW';
export const READER_FULLPOST_HIDE = 'READER_FULLPOST_HIDE';
export const READER_SIDEBAR_LISTS_TOGGLE = 'READER_SIDEBAR_LISTS_TOGGLE';
export const READER_SIDEBAR_TAGS_TOGGLE = 'READER_SIDEBAR_TAGS_TOGGLE';
export const RECEIPT_FETCH = 'RECEIPT_FETCH';
export const RECEIPT_FETCH_COMPLETED = 'RECEIPT_FETCH_COMPLETED';
export const RECEIPT_FETCH_FAILED = 'RECEIPT_FETCH_FAILED';
export const REMOVE_NOTICE = 'REMOVE_NOTICE';
export const SELECTED_SITE_SET = 'SELECTED_SITE_SET';
export const SERIALIZE = 'SERIALIZE';
export const SERVER_DESERIALIZE = 'SERVER_DESERIALIZE';
export const SET_EXPORT_POST_TYPE = 'SET_EXPORT_POST_TYPE';
export const SET_ROUTE = 'SET_ROUTE';
export const SET_SECTION = 'SET_SECTION';
export const SITE_PLANS_FETCH = 'SITE_PLANS_FETCH';
export const SITE_PLANS_FETCH_COMPLETED = 'SITE_PLANS_FETCH_COMPLETED';
export const SITE_PLANS_FETCH_FAILED = 'SITE_PLANS_FETCH_FAILED';
export const SITE_PLANS_REMOVE = 'SITE_PLANS_REMOVE';
export const SITE_PLANS_TRIAL_CANCEL = 'SITE_PLANS_TRIAL_CANCEL';
export const SITE_PLANS_TRIAL_CANCEL_COMPLETED = 'SITE_PLANS_TRIAL_CANCEL_COMPLETED';
export const SITE_PLANS_TRIAL_CANCEL_FAILED = 'SITE_PLANS_TRIAL_CANCEL_FAILED';
export const SITE_RECEIVE = 'SITE_RECEIVE';
export const SUPPORT_USER_TOGGLE_DIALOG = 'SUPPORT_USER_TOGGLE_DIALOG';
export const SUPPORT_USER_TOKEN_FETCH = 'SUPPORT_USER_TOKEN_FETCH';
export const SUPPORT_USER_TOKEN_SET = 'SUPPORT_USER_TOKEN_SET';
export const SUPPORT_USER_RESTORE = 'SUPPORT_USER_RESTORE';
export const USER_RECEIVE = 'USER_RECEIVE';
export const WPORG_PLUGIN_DATA_RECEIVE = 'WPORG_PLUGIN_DATA_RECEIVE';
