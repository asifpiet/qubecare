export const COOKIE_MAX_AGE_1_YEAR = 365 * 24 * 60 * 60
export const MAIN_DOMAIN = "http://127.0.0.1:8000";
export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? window.location.origin + "/api";
export const GLOBAL_VARIABLE = {}

// export const GLOBAL_AUTH = null

export const DASHBOARD_API = "/dashboard-states";
export const LOGIN_API = "/login";
export const PATIENT_LOGIN_API = "/login";
export const PATIENT_API = "/patients";
export const GET_SINGLE_PATIENT_API = "/emr/patient-data";
export const GET_SINGLE_GET_PATIENT_API = "/emr/get-patient-data";
export const GET_PATIENT_AVATER_API = "/emr/patients/profile-image";
export const SAVE_PATIENT_AVATER_API = "/emr/patients/store-document";
export const PATIENT_API_DATATABLE = "/emr/patients-list";
export const GET_PATIENT_API = "/patient";
export const UPDATE_NEXTOFKIN_API = "/emr/guardian-update";
export const SAVE_INSURACNE_API = "/store-insurance";
export const GET_INSURACNE_API = "/get-insurance";
export const UPDATE_INSURACNE_API = "/update-insurance";

export const ADD_NEXTOFSKIN_API = "/patient-nextofskin";
export const ADD_INSURANCE_API = "/patient-insurance";
export const GET_ELIGIBILITY_CHECK_API = "/patient-eligibility-check";

export const GET_PRODUCT_API = "/emr/get-products";
export const SAVE_PRODUCT_API = "/emr/save-product";
export const UPDATE_PRODUCT_API = "/emr/update-product";

export const GET_CATEGORY_API = "/emr/get-categories";
export const SAVE_CATEGORY_API = "/emr/save-category";
export const UPDATE_CATEGORY_API = "/emr/update-category";


export const UPDATE_PATIENT_API = "/emr/update-patient";
export const REGISTER_PATIENT_API = '/emr/register-patients';
export const GET_PATIENT_API_BY_ID = "/get-patient";
export const PATIENT_LIST_API = "/apps/users";
export const GET_PATIENT_BY_ID_API = "/apps/users";
export const ADD_PATIENT_API = "/apps/users";
// export const UPDATE_PATIENT_API = "/apps/users";

export const GET_LOCATIONS_API = "/api/locations";
export const LOCATIONS_API = "/locations";
export const ADD_LOCATIONS_API = "/add-location";
export const UPDATE_LOCATIONS_API = "/update-location";
export const EDIT_LOCATIONS_API = "/get-location";

export const PATIENT_TEXT_MESSAGE_API = "/text-messages";
export const PATIENT_TASK_API = "/tasks";
export const ADD_TASK_API = "/add-tasks";
export const PATIENT_VITAL_API = "/vitals";
export const PATIENT_HISTORY_API = "/patient-history";
export const PATIENT_TAGS_API = "/emr/tags/list";
export const UPDATE_TAGS_API = "/emr/tags/store";

export const GENERAL_PROFILE_API = "/m/general-profile-api";
export const GET_ALLERGY_API = "/emr/family-history/get-allergies";
export const POST_ALLERGY_API = "/emr/family-history/allergies";

export const SAVE_DIET_API = "/emr/patients/save-diet";
export const GET_DIET_API = "/emr/patients/get-diet";

export const GET_IMMUNIZATION_API = "/emr/patients/get-clinical-profile";
export const SAVE_IMMUNIZATION_API = "/emr/patients/save-clinical-profile";

export const SAVE_REPRODUCTIVE_API = "/emr/patients/store-reproductive";
export const GET_REPRODUCTIVE_API = "/emr/patients/get-reproductive";

export const STORE_MEDICAN_API = "/emr/prescription/store";
export const GET_PATIENT_MEDICAN_DATA = "/emr/prescriptions";
export const UPDATE_PATIENT_MEDICAN_DATA = "/emr/prescriptions/update";
export const GET_PATIENT_MEDICAN_DATA_BY_ID = "/emr/prescriptions-by-id";


export const STORE_FAMILY_HISTORY_API = "/emr/family-history/store";
export const GET_FAMILY_HISTORY_API = "/emr/family-history/get";

export const STORE_PATIENT_FAMILY_CONDITION_API = "/emr/patients/store-family-relation-history";
export const GET_PATIENT_FAMILY_CONDITION_API = "/emr/patients/get-family-relation-history";

// user management api
export const GET_USERS_LIST = "/user-list";
export const GET_SINGLE_USER = "/user-list";
export const GET_PROVIDER_API = "/user-list-profile";
export const UPDATE_PROVIDER_API = "/update-user";

export const ADD_USER_API = "/add-user";
export const UPDATE_USER_API = "/update-user"; // /UPDATE_USER_API/:id
export const UPDATE_USER_STATUS_API = "/update-user"; // /UPDATE_USER_STATUS_API/:id
export const UPDATE_IP_ACCESS_API = "/update-ip-access";
export const GET_LIST_IP_ACCESS_API = "/get-ip-access";
export const GET_LIST_PHONE_LOG_API = "/phone-log-list";
export const ADD_PHONE_LOG = "/add-phone-log";
export const GET_MESSAGE_LIST = "/get-message-list";
export const Add_MESSAGE_API = "/add-message";
export const GET_SUBJECT_MESSAGE = "/get-messages";//subject id
export const ADD_MESSAGE_ON_BASE_SUBJECT = "/add-message-subject";//subject id
export const GET_LABDIAGNOSTICS = "/get-labdiagonostics";
export const STORE_LABDIAGONOSTICS = "/store-labdiagonostics";
export const UPDATE_LABDIAGONOSTICS = "/update-labdiagonostics";
export const DELETE_LABDIAGONOSTICS = "/delete-labdiagonostics";
export const GET_APPOINTMENTS = "/get-appointments";//subject id
export const GET_FILTERED_APPOINTMENT = "/get-appointment-list-date";//subject id
export const MEET_APPOINTMENT_URL = "https://meet.codelfi.com/rooms/";
export const STORE_NEW_APPOINTMENT = "/book-appointment";
export const UPDATE_APPOINTMENT = "/edit-book-appointment";
export const CANCEL_APPOINTMENT = "/cancel-appointment";
export const GET_EMAIL_LIST = "/get-email-list";
export const ADD_EMAIL_API = "/add-email";
export const GET_EMAIL_MESSAGE_BY_SUBJECT = "/get-email-by-subject";//subject id

export const GET_INVENTORY_API = "/inventory";
export const INVENTORY_API = "/inventory";
export const GET_SINGLE_INVENTORY_API = "/get-inventory";
export const DELETE_INVENTORY_API = "/delete-inventory";
export const ADD_INVENTORY_API = "/add-inventory";
export const UPDATE_INVENTORY_API = "/update-inventory";
export const PURCHASE_ORDER_API = "/purchase-orders";
export const ADD_ORDER_API = "/add-orders";

export const ADD_TASK_API_T = "/add-task";
export const GET_TASK_API_LIST = "/tasks";

export const HEALTH_MAINTANCE_API = "/m/medical_problems_api";
export const UPDATE_HEALTH_MAINTANCE_API = "/medical-problems-update";
export const STORE_HEALTH_MAINTANCE_API = "/medical-problems-store";
export const GET_HEALTH_MAINTANCE_API = "/emr/patients/get-medical-problems";
export const GET_HEALTH_MAINTANCE_BY_ID = "/medical-problem";




export const GET_TASK_BY_ID = "/task";
export const UPDATE_TASK_DATA = "/update-task";

export const ADD_VITAL = "/add-vital";
export const GET_VITAL = "/emr/get-vital";
export const UPADATE_VITAL = "/edit-vital";
export const DELETE_VITAL = "/delete-vital";
export const GET_VITAL_BY_ID = "/get-vital-by-id";

export const ADD_DOCUMENT = "/emr/store-document";
export const ADD_DOCUMENT_NEW = "/emr/patients/store-document";

export const GET_DOCUMENT = "/emr/patients/get-document";
export const UPADATE_DOCUMENT = "/edit-document";
export const DELETE_DOCUMENT = "/delete-document";



export const GET_INTAKE_QUESTIONS = "/get-intake-questions";
export const STORE_INTAKE_QUESTIONS = "/store-intake-questions";
export const GET_INTAKE_QUESTION_BY_ID = "/get-intake-question";
export const UPDATE_INTAKE_QUESTION_BY_ID = "/update-intake-question";
export const DELETE_INTAKE_QUESTION_BY_ID = "/delete-intake-question";
export const CLICNIC_VITAL_API = "/emr/patients/store-vitals";

export const GET_PATIENT_INTAKE_FORMS_LIST = "/get-patient-intake-form-list";
export const GET_INTAKE_FORMS_LIST = "/get-intake-forms-list";
export const GET_INTAKE_FORM_DATA = "/get-intake-forms-data";
export const STORE_INTAKE_FORM_DATA = "/store-intake-form-data";
export const UPDATE_INTAKE_FORM_DATA = "/update-intake-form-data";
export const GET_PATIENT_INTAKE_FORM_DATA = "/get-patient-intake-form-data";
export const GET_PATIENT_INTAKE_SIMPLE_FORM_DATA = "/get-patient-intake-form-latest-data";
export const GET_PATIENT_QUESTIONER_FORM_LIST = "/get-patient-questionnaire-form-list";
export const GET_QUESTIONER_QUESTIONS = "/get-questioner-questions";
export const STORE_QUESTIONER_QUESTIONS = "/store-questioner-questions";
export const GET_QUESTIONER_QUESTION_BY_ID = "/get-questioner-question";
export const UPDATE_QUESTIONER_QUESTION_BY_ID = "/update-questioner-question";
export const DELETE_QUESTIONER_QUESTION_BY_ID = "/delete-questioner-question";
export const GET_QUESTIONER_FORMS_LIST = "/get-questioner-forms-list";
export const GET_QUESTIONER_FORM_DATA = "/get-questioner-forms-data";
export const STORE_QUESTIONER_FORM_DATA = "/store-questioner-form-data";
export const GET_PATIENT_QUESTIONER_FORM_DATA = "/get-patient-questioner-form-data";

export const GET_CONSENT_FORMS = "/emr/get-consent-forms";
//export const GET_CONSENT_FORMS = "/emr/consend/get";
export const STORE_CONSENT_FORM = "/store-consent-form";
export const GET_CONSENT_FORM_BY_ID = "/get-consent-form";
export const UPDATE_CONSENT_FORM_BY_ID = "/update-consent-form";
export const DELETE_CONSENT_FORM_BY_ID = "/delete-consent-form";
export const GET_CONSENT_FORMS_LIST = "/get-consent-forms-list";
export const GET_PATIENT_CONSENT_FORMS = "/get-patient-consent-forms";
export const STORE_PATIENT_CONSENT_FORM = "/store-patient-consent-form";
export const GET_PATIENT_CONSENT_FORM_DATA = "/get-patient-consent-form-data";
export const GET_PATIENT_SUBMITTED_INTAKES = "/get-patient-submitted-intake-forms";
export const GET_PATIENT_SUBMITTED_INTAKE_DATA = "/emr/get-patient-submitted-intake-data";
// export const GET_PATIENT_SUBMITTED_INTAKE_DATA = "/emr/get-patient-submitted-intake-data";

export const GET_PRODUCTS_LIST = "/emr/get-products-list";
export const GET_THEMES_LIST = "/emr/get-themes-list";
export const STORE_BUILDER = "/emr/store-builder";
export const STORE_BUILDER_CONFIG = "/emr/store-builder-config";
export const GET_BUILDER_DATA = "/emr/get-builder-data";
export const GET_BUILDERS_DATATABLE = "/emr/get-builder-datatable";
export const UPDATE_BUILDER = "/emr/builder-update";
export const UPDATE_BUILDER_CONFIG = "/emr/update-builder-config";
export const DELETE_BUILDER = "/emr/delete-builder";
export const GET_BUILDER_DATA_BY_ID = "/frontend/get-builder-data";
export const GET_PATIENT_EMAIL_CHECK = "/frontend/patient-check-email";
export const LOGIN_PATIENT_API = "/patient-login-api";
export const REGISTER_PATIENT = "/register-patients";
export const GET_PATIENT_PRODUCTS_API = "/frontend/get-products-list";
export const STORE_PATIENT_ORDER_CREATE = "/patient-order-create";
export const GET_REG_QUESTIONNAIRE_DATA = "/frontend/get-reg-questionnaire-data";
export const STORE_REG_QUESTIONNAIRE_DATA = "/frontend/store-reg-questionnaire-data";
export const GET_REG_INTAKE_DATA = "/frontend/get-reg-intake-data";
export const GET_REG_FORM_DATA = "/frontend/get-form";
export const STORE_REG_FORM_DATA = "/frontend/store-intake-form-data";
export const STORE_REG_INTAKE_DATA = "/frontend/store-reg-intake-data";
export const GET_AVAILABLE_SLOTS_DATA = "/get-available-slots-data";
export const GET_PRACTITIONER_DATA_BY_UUID = "/user-list-profile-skipauth";
export const STORE_PATIENT_BOOK_APPOINTMENT = "/patient-book-appointment";


export const GET_PROVIDER_AVAILABILITY_LIST = "/provider-availability-list";
export const PROVIDER_ADD_AVAILABILITY = "/provider-add-availability";
export const PROVIDER_UPDATE_AVAILABILITY = "/edit-provider-availability";
export const PROVIDER_DELETE_AVAILABILITY = "/delete-provider-availability";
export const GET_PROVIDER_SLOTS = "/get-provider-slots";

export const ADMIN_GET_ROLES_SAVE_API = "/emr/roles-create";
export const ADMIN_UPDATE_ROLES_BY_ID_API = "/emr/roles-update";
export const ADMIN_GET_ROLES_API = "/emr/roles"

export const ADMIN_DELETE_ROLES_BY_ID_API = "/emr/roles-delete"
export const ADMIN_GET_ROLES_BY_ID_API = "/emr/roles-by-id"
export const ADMIN_GET_PERMISSION_ROLE_API = "/emr/permissions-by-id"
export const ADMIN_UPDATE_PERMISSION_API = "/emr/store-permissions"

export const POST_PARTNER_REGISTER_API = "/partner-register-api"

export const ADD_INVOICE_API = "/emr/invoice-create"

export const INVOICE_LIST_API = "/emr/invoices"
export const INVOICE_GET_BY_ID = "/emr/invoice"
export const UPDATE_INVOICE_API = "/emr/invoice-update"
export const PAY_INVOICE = "/emr/invoice-payment"
export const INVOICE_STATE = "/emr/invoice-stats"

export const DOWNLOAD_APPIONMENT_CSV_REPORT_API = "/download-appointments-csv"
export const DOWNLOAD_APPIONMENT_PDF_REPORT_API = "/download-appointments-pdf"




export const POST_PARTNER_LOGIN_API = "/login-partner-api"

export const POST_AFFILIATE_REGISTER_API = "/affiliate-register-api"
export const POST_AFFILIATE_LOGIN_API = "/affiliate-login-api"

export const GET_PRACTITIONER_PRODUCTS = "/emr/get-practitioner-products";
export const GET_AFFILIATE_PRODUCTS = "/emr/get-affiliate-products";
export const STORE_AFFILIATE_PRODUCTS = "/emr/store-affiliate-product";
export const GET_AFFILIATE_PRODUCTS_BY_ID = "/emr/get-affiliate-product";
export const UPDATE_AFFILIATE_PRODUCTS_BY_ID = "/emr/update-affiliate-product";
export const DELETE_AFFILIATE_PRODUCTS_BY_ID = "/emr/delete-affiliate-product";
export const ROLES_LIST_DROPDOWN_API = "/emr/get-roles-list"

export const REFRESH_ABLITIES_LINK = "/emr/refresh-abilities"

export const APPIONMENT_REPORT_API = "/last-30-days-appointments-data"

export const GET_AFFILIATE_PRODUCTS_LIST = "/affiliate/get-affiliate-products-list";
export const GET_PARTNER_DASHBOARD_STATS = "/partner/get-partner-dashboard-stats";
export const GET_PARTNER_WITHDRAWLS = "/partner/get-partner-withdrawls";
export const POST_PARTNER_WITHDRAWLS = "/partner/process-partner-withdraw";
export const GET_AFFILIATE_WITHDRAWLS = "/affiliate/get-affiliate-withdraw";
export const POST_AFFILIATE_WITHDRAWLS = "/affiliate/process-affiliate-withdraw";

export const GET_AFFILIATE_DASHBOARD_STATS = "/affiliate/get-affiliate-dashboard-stats";
export const STORE_AFFILIATE_ACCOUNT = "/affiliate/store-affiliate-account";
export const GET_AFFILIATE_ACCOUNT = "/affiliate/get-affiliate-account";

export const STORE_PARTNER_ACCOUNT = "/partner/store-account-settings";
export const GET_PARTNER_ACCOUNT = "/partner/get-partner-account";

export const GET_PARTNER_BALANCE = "/partner/get-partner-total-revenue";
export const GET_AFFILIATE_BALANCE = "/affiliate/get-affiliate-revenue";

export const PATIENT_REPORT_API = "/patient-provider-data"
export const PROVIDER_STATS_API = "/get-provider-stats"
export const INVOICE_REPORT_API = "/get-invoice-report"
export const INVOICE_PDF_REPORT_API = "/get-invoice-report-pdf"
export const INVOICE_CSV_REPORT_API = "/get-invoice-report-csv"




export const GET_GOOGLE_CONNECT = "/emr/google/redirect";
export const GET_GOOGLE_CALLBACK = "/emr/google/callback";
export const STORE_GOOGLE_SETTINGS = "/emr/google/calendar/settings/store";
export const GET_GOOGLE_SETTINGS = "/emr/google/calendar/settings";
export const DISCONNECT_GOOGLE_SYNC = "/emr/google/disconnect";

export const GET_CALENDLY_CONNECT = "/calendly/redirect";
export const GET_CALENDLY_CALLBACK = "/calendly/handle-callback";
export const STORE_CALENDLY_SETTINGS = "/calendly/store";
export const GET_CALENDLY_SETTINGS = "/calendly/config";
export const GET_CALENDLY_EVENT_TYPES = "/calendly/events/types";
export const DISCONNECT_CALENDLY_SYNC = "/calendly/disconnect";


export const PROVIDER_REGISTER_API = "/emr/provider-register"

export const DELETE_PRODUCT = "/emr/delete-product"
export const SAVE_PAYMENT_METHOD_API = "/emr/save-payment-method"
export const POST_INTAKE_AI_DESCRIPTION = "/chatgpt-response"
export const PROVIDER_REPORT_API = "/patient-provider-data";
export const ORDER_TIMELINE_REPORT = "/get-order-report";
export const PATIENT_REPORT_PDF = "/patient-provider-data-pdf";
export const PROVIDER_REPORT_PDF = "/get-provider-stats-pdf";
export const PRESCRIPTION_REPORT = "/get-prescription-report";
export const PATIENT_AT_RESPONSE = "/patient-ai-response";

export const PROVIDER_STATS_CSV = "/get-provider-stats-csv";
export const PATIENT_STATS_CSV = "/patient-provider-data-csv";


export const PATIENT_PORTAL_LOGIN_API = "/frontend/login";
// export const PATIENT_PORTAL_LOGIN = "/patient/me";
export const GET_PATIENT_PORTAL_API = "/frontend/patient-profile";
export const UPDATE_PATIENT_PORTAL_API = "/frontend/update-patients";
export const UPDATE_PATIENT_PROFILE_PORTAL_API = "/frontend/change-profile-image";
export const PATIENT_FORGOT_PASSWORD_PORTAL_API = "/frontend/forgot-password";
export const PATIENT_RESET_PASSWORD_PORTAL_API = "/frontend/reset-password";
export const PATIENT_DASHBOARD_PORTAL_API = "/frontend/last-30-days-appointments-data";
export const CREATE_PASSWORD_API = "/emr/set-password";



export const WIZARD_SETUPE_API = "/emr/provider-wizard-setup"
export const PATIENT_PORTAL_APPOINTMENTS_API = "/frontend/get-appointment-list-date";
export const PATIENT_PORTAL_BOOK_APPOINTMENT_API = "/frontend/book-appointment";
export const PATIENT_PORTAL_EDIT_BOOK_APPOINTMENT_API = "/frontend/edit-book-appointment";
export const PATIENT_USER_LIST_API = "/frontend/user-list";
export const PATIENT_PORTAL_UPCOMING_API = "/frontend/upcoming-appointment";
export const PATIENT_PORTAL_INVOCIE_API = "/frontend/invoices";
export const PATIENT_PORTAL_PRESCRIPTION_API = "/frontend/get-prescription";
export const PATIENT_PORTAL_PRESCRIPTION_BY_ID = "/frontend/prescription-by-id";
export const PATIENT_PORTAL_CANCEL_APPOINTMENT_API = "/frontend/cancel-appointment";
export const PATIENT_GET_INVOICE_BY_ID = "/frontend/get-invoice";
export const PATIENT_PROVIDER_SLOT = "/frontend/get-provider-slots";




export const AFFILIATE_PATIENT_API_DATATABLE = "/affiliate/affiliate-patients";
export const AFFILIATE_ADD_PATIENT_API = "/affiliate/add-affiliate-patient";
export const AFFILIATE_UPDATE_PATIENT_API = "/affiliate/edit-affiliate-patient";
export const GET_AFFILIATE_PATIENTS_LIST = "/affiliate/get-patient-list";
export const GET_AFFILIATE_PROVIDER_SLOTS_LIST = "/affiliate/get-provider-slots";
export const GET_AFFILIATE_LOCATIONS_LIST = "/affiliate/locations";
export const SAVE_AFFILIATE_APPOINTMENT = "/affiliate/book-appointment";
export const SAVE_AFFILIATE_PATIENT_ORDER = "/affiliate/add-patient-order";
export const GET_AFFILIATE_PATIENT_APPOINTMENTS = "/affiliate/get-appointments";
export const GET_AFFILIATE_PRACTITIONERS_LIST = "/affiliate/get-practitioners-list";


export const GET_PRACTITIONER_LIST = "/practitioners-list";
export const GET_FORM_FIELD = "/emr/get-form-field";
export const SAVE_WIDGET = "/emr/save-widget";
export const WIDGT_LIST = "/emr/widgets";
export const WIDGT_DATA = "/emr/widget";

export const SAVE_WIDGET_BUILDER = "/emr/save-builder-widget";
export const GET_WIDGET_BUILDER = "/emr/get-builder-widget";
export const DELETE_WIDGET = "/emr/delete/widget";

export const GET_PROVIDER_BUILDERS = "/get-provider-builders";
export const DROP_WIDGET_LIST = "/emr/widgets-list";

export const GET_PROVIDER_ME = "/provider/me";
export const GET_PARTNER_ME = "/partner/me";
export const GET_PATIENT_ME = "/patient/me";
export const GET_AFFILIATE_ME = "/affiliate/me";
export const GET_NETWORK_ME = "/network/me";
export const COMPLETE_SETUP_API = "/emr/company/complete/setup/";

export const GET_COMPLETE_SETUP_API = "/emr/company/status";
export const GET_BUILDER_PAGE = "/emr/get-page/";
export const STORE_COMPANY_SETTING = "/emr/store-company";
export const GET_COMPANY_SETTINGS = "/emr/get-company";

export const STORE_TEMPLAET_API = "/add_medicine_template";
export const UPDATE_TEMPLATE_API = "/update_medicine_template";
export const GET_TEMPLATE_DATA_BY_ID = "/get_medicine_template_by_id";
export const GET_TEMPLATES_API = "/get_medicine_templates";
export const DELETE_TEMPLATE = "/delete_medicine_template";
export const STRIPE_CONNECT = "/stripe/connect";
export const CHECK_STATUS_GATEWAY = "/check-gateway-connection";
export const PAYMENT_PROCESS_API = "/frontend/payment/process";

export const GET_STORED_CARD = "/emr/get-stored-methods";





export const GET_CUSTOM_FORMS = "/get-forms";
export const STORE_CUSTOM_FORM = "/store-form";
export const UPDATE_CUSTOM_FORM = "/update-form";
export const GET_CUSTOM_FORM = "/get-form";
export const DELETE_CUSTOM_FORM = "/delete-form";

export const GET_NEW_BUILDERS = "/emr/builder/list";
export const STORE_NEW_BUILDER = "/emr/builder/store";
export const UPDATE_NEW_BUILDER = "/emr/builder/update";
export const GET_NEW_BUILDER = "/emr/builder";
export const DELETE_NEW_BUILDER = "/emr/builder/delete";

export const GET_EMAIL_TEMPLATES_API = "/emr/list-template";
export const STORE_EMAIL_TEMPLATES_API = "/emr/store-template";
export const UPDATE_EMAIL_TEMPLATES_API = "/emr/update-template";
export const GET_EMAIL_TEMPLATES_BY_ID_API = "/emr/template";
export const DELETE_EMAIL_TEMPLATES_API = "/emr/delete-template";
export const EMAIL_TEMPLATES_FIELD_API = "/email-template-fields";
export const UPDATE_EMAIL_TEMPLATES_FIELD_API = "/update-selected-templates";
export const GET_SELETED_EMAIL_TEMPLATES_FIELD_API = "/get-selected-templates";


export const GET_PATIENT_MESSAGE_LIST = "/frontend/get-message-list";
export const GET_PATIENT_MESSAGE_BY_ID = "/frontend/get-messages";

export const GET_PATIENT_DOCUMENT_BY_ID = "/get-document-vue";
export const GET_PATIENT_PROTAL_APPOINTMENTS = "/frontend/get-appointments";

export const LIVEKIT_CALL = "/emr/connection-details";


export const GET_PATIENT_DOCUMENT = "/frontend/patients/get-document";
export const STORE_PATIENT_DOCUMENT = "/frontend/patients/store-document";
export const DELETE_PATIENT_DOCUMENT = "/frontend/delete-document";

export const GET_MESSAGE_USERS = "/chats";
export const GET_USER_MESSAGES = "/messages/conversation";
export const SEND_MESSAGE_CHAT = "/messages/send";
export const READ_MESSAGE = "/messages/read";
export const PATEINT_GET_MESSAGE_USERS = "/frontend/chats";
export const PATIENT_SEND_MESSAGE_CHAT = "/frontend/messages/send";
export const PATIENT_GET_USER_MESSAGES = "/frontend/messages/conversation";
export const PATIENT_READ_MESSAGE = "/frontend/messages/read";
export const PATIENT_BROADCAST_API = "/frontend/broadcasting/auth";
export const PROVIDER_BROADCAST_API = "/broadcasting/auth";

export const GET_PROVIDER_REQUEST_FORM = "/provider-requested-forms";
export const GET_PATIENT_REQUEST_FORM = "/frontend/patient-requested-forms";
export const SAVE_REQUEST_FORM = "/request-patient-form";
export const GET_PATIENT_INATEK_REQUEST_DATA = "/frontend/get-intake-forms-data";
export const POST_REQUEST_STATUS = "/frontend/update-form-status";
export const VIEW_INTAKE_FORM_DATA = "/frontend/get-intake-forms-data";
export const GET_PDF_URL = "/get-pdf-url";

export const GET_PROVIDER_UPCOMMING_APPOINTMENTS = "/emr/get-upcoming-appointments";

export const GET_LAST_RECENT_APPOINTMENTS = "/emr/get-recent-upcoming-appointments";
export const STORE_PARTNER_PROVIDER = "/partner/store-provider";
export const SAVE_PROVIDER_PASSWORD = "/set-password";
export const GET_PARTNER_PROVIDERS = "/partner/get-providers";
export const STORE_PARTNER_AFFILIATE = "/partner/store-affiliate";
export const GET_PARTNER_AFFILIATES = "/partner/get-affiliate-user";
export const SAVE_AFFILIATE_PASSWORD = "/affiliate/set-password";
export const GET_PARTNER_STATEMENTS = "/partner/get-statements";
export const GET_PARTNER_MONTHLY_STATEMENTS = "/partner/get-monthly-statements";
export const GET_AFFILIATE_STATEMENTS = "/affiliate/get-statements";
export const GET_AFFILIATE_MONTHLY_STATEMENTS = "/affiliate/get-monthly-statements";


export const GET_USER_BYAPPOINMNET = "/frontend/get-user-by-appointment-id";
export const GET_PDF_LIST = "/get-pdf-list";
export const GET_MEIDCINE_LIST = "/emr/get-medicine-list";
export const SAVE_PRESCRIPTION = "/emr/save/prescription";
export const UPDATE_PRESCRIPTION = "/emr/update/prescription";
export const GET_PRESCRIPTION_LIST = "/emr/get-prescription-list";
export const GET_PRESCRIPTION_BY_ID = "/emr/get-prescription-by-id";
export const GET_PRESCRIPTION_HISTORY = "/emr/prescriptions/status-history";
export const IMPORT_XLS = "/emr/import-medicines";
export const UPDATE_PRESCRIPTION_STATUS = "/emr/update-prescription-status";
export const GET_APPOINTMENT_ORDER = "/get-appointment-order";
export const GET_APPOINTMENT_ORDERS = "/get-appointment-orders";

export const CHAT_CONVERSATION = "/chats/conversation";
export const CHAT_UNREADMSG = "/chats/unread-messages";
export const SEEN_ALL_NOTIFACTION = "/seen-notifications";

export const POST_NETWORK_REGISTER_API = "/network/register"
export const POST_NETWORK_LOGIN_API = "/network/login"
export const SAVE_SIGNATURE_API = "/save-signature";

export const UPDATE_ORDER_STATE = "/frontend/update-order-state";

export const GET_PATIENT_FORM_LIST = "/get-patient-forms";


export const PATIENT_PRESCRIPTION_LIST = "/frontend/get-prescription-list";
// export const PATINET_SAVE_PRESCRIPTION = "/frontend/save/prescription";
// export const PATINET_UPDATE_PRESCRIPTION = "/frontend/update/prescription";
export const PATINET_GET_PRESCRIPTION_BY_ID = "/frontend/get-prescription-by-id";
// export const PATIENT_UPDATE_PRESCRIPTION_STATUS = "/frontend/update-prescription-status";

export const GET_PATIENT_ORDER_DETAILS = "/frontend/get-order-details"
export const UPDATE_PARTNER_PROFILE = "/partner/update-profile"
export const UPDATE_AFFILIATE_PROFILE = "/affiliate/update-profile"

export const CREATE_PARTNER_SUPPORT_TICKET = "/partner/create-support-ticket"
export const CREATE_AFFILIATE_SUPPORT_TICKET = "/affiliate/create-support-ticket"
export const GET_TRANSCRPTION_LIST = "/get-appointment-transcription"
export const GET_HUBSPOT_AUTH = "/hubspot/auth-url"
export const GET_HUBSPOT_STATUS = "/hubspot/connection-status"
export const GET_HUBSPOT_CALLBACK = "/hubspot/callback";
export const GET_HUBSPOT_DISCONNECT = "/hubspot/disconnect";


export const GET_PATIENT_PRESCRIPTION_HISTORY = "/frontend/prescriptions/status-history";
export const DELETE_PRESCRIPTION_HISTORY = "/emr/prescription-status-history";


export const PRESCRIPTION_TEMPLATE_API = "/prescription-templates";
export const PRESCRIPTION_TEMPLATE_LIST_API = "/prescription-templates/med/list";



export const STORE_AFFILIATE_PATIENT_ORDER = "/affiliate/patient-order-create";
export const STORE_AFFILIATE_PATIENT_BOOK_APPOINTMENT = "/affiliate/patient-book-appointment";

export const AFFILIATE_PATIENT_PRESCRIPTION = "/affiliate/get-prescription-list";
export const GET_AFFILIATE_PRESCRIPTION_HISTORY = "/affiliate/prescriptions/status-history";

export const SUPER_ADMIN_LOGIN_API = "/admin/login";


export const SUPER_ADMIN_ME = "/admin/me";

export const SUPER_ADMIN_PROVIDER_LIST = "/admin/provider-list";

// Coupon APIs
export const COUPON_API = "/promo-code";
export const GET_COUPONS_API = "/promo-code";
export const ADD_COUPON_API = "/promo-code/create";
export const UPDATE_COUPON_API = "/promo-code/update";
export const DELETE_COUPON_API = "/promo-code/delete";
export const GET_COUPON_BY_ID_API = "//promo-code";
export const VALIDATE_COUPON_API = "/promo-code/apply";
export const APPLY_COUPON_API = "/promo-code/apply";

export const SUPER_ADMIN_AFFILIATE_LIST = "/admin/affilate/user-list";
export const SUPER_ADMIN_PARTNERS_LIST = "/admin/partner-list";
export const GET_AFFIIATE_SINGLE_PATIENT_API = "/affiliate/patient-data";
export const GET_AFFIIATE_PATIENT_PRACTITIONERLIST = "/affiliate/practitioners-list";
export const AFFILIATE_UPDATE_PATIENT = "/affiliate/update-patient";
export const AFFILIATE_GET_INSURANCE = "/affiliate/get-insurance";
export const AFFILIATE_GUARDIAN_UPDATE = "/affiliate/guardian-update";
export const AFFILIATE_SAVE_INSURACNE_API = "/affiliate/store-insurance";
export const AFFILIATE_UPDATE_INSURACNE_API = "/affiliate/update-insurance";

export const SUPER_ADMIN_PROVIDER_LOGIN_API = "/admin/login/provider";
export const SUPER_ADMIN_AFFILLIATE_LOGIN_API = "/admin/login/affiliate";
export const SUPER_ADMIN_PARTNERS_LOGIN_API = "/admin/login/partner";
export const PATIENT_FORM_GET_API = "/frontend/get-patient-forms";
export const SUPER_ADMIN_USER_PROFILE = "/admin/user-list-profile";
export const SUPER_ADMIN_UPDATE_USER = "/admin/update-user";

export const PATIENT_CANCEL_APPOINTMENT = "/frontend/cancel-appointment";
export const CREATE_PATIENT_SUPPORT_TICKET = "/frontend/create-support-ticket";
export const PATIENT_REORDER_PRESCRIPTION = "/frontend/reorder-prescription";

export const PATIENT_GET_STORED_CARD = "/frontend/get-stored-methods";
export const PATIENT_PAY_INVOICE = "/frontend/invoice-payment";

export const PATIENT_BILLING = "/frontend/patient-payment/history";

export const LABS_LIST_DROPDOWN_API = "/labs/list"
export const ADMIN_GET_LAB_SAVE_API = "/labs/create";
export const ADMIN_UPDATE_LAB_BY_ID_API = "/labs/update";
export const ADMIN_GET_LABS_API = "/labs/labs"
export const ADMIN_DELETE_LAB_BY_ID_API = "/labs/delete"
export const ADMIN_GET_LAB_BY_ID_API = "/labs/lab-by-id"

export const ADMIN_GET_LABTEST_SAVE_API = "/labs/test/create";
export const ADMIN_UPDATE_LABTEST_BY_ID_API = "/labs/test/update";
export const ADMIN_GET_LABTESTS_API = "/labs/test/list"
export const ADMIN_DELETE_LABTEST_BY_ID_API = "/labs/test/delete"
export const ADMIN_GET_LABTEST_BY_ID_API = "/labs/test/lab-test-detail"

export const ADMIN_LABORDER_SAVE_API = "/labs/order/create";
export const ADMIN_GET_LABORDERS_API = "/labs/order/get-lab-orders"
export const ADMIN_DELETE_LABORDER_BY_ID_API = "/labs/order/delete"
export const ADMIN_GET_LABORDER_BY_ID_API = "/labs/order/get-lab-orders-list"

export const PATIENT_GET_LABORDERS_API = "/frontend/get-lab-orders"
export const PATIENT_LABORDER_UPLOAD_FILES = "/frontend/upload-patient-test-files";


export const PROVIDER_FORGOT_PASSWORD_API = "/emr/provider/forgot-password";
export const PROVIDER_RESET_PASSWORD_API = "/emr/provider/reset-password";
export const PROVIDER_PRESCRIPTION_API = "/emr/provider/prescriptions";

export const PROVIDER_RIGSTER_AS_PRACTIONER = "/emr/provider/register";
export const PROVIDER_GET_LABORDERS_API = "/emr/provider/get-all-patient-lab-orders"
export const PROVIDER_UPDATE_APPOINTMENT_STATUS = "/appointment-status";


