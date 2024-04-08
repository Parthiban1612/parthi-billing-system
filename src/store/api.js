export default class Config {
   static API_KEY = "083cb872-0197-4f2e-bca2-4a8255175047";
   static BASE_API_URL = "https://api.trundle.me";
   static CREATE_TRUNDLER_PROFILE = `${this.BASE_API_URL}/account/register`;
   static UPDATE_TRUNDLER_PROFILE = `${this.BASE_API_URL}/account/update-profile`;
   static GET_ALL_COUNTRIES_LIST = `${this.BASE_API_URL}/account/get-countries`;
   static SEND_TRUNDLER_INVITATION = `${this.BASE_API_URL}/account/trundle-invitation`;
   static GET_TRUBDLER_DETAILS = `${this.BASE_API_URL}/account/get-user`;
   static GET_ALL_TRUNDLERS = `${this.BASE_API_URL}/account/get-trundlers`;
   static VERIFY_OTP = `${this.BASE_API_URL}/account/verify-otp`;
   static RESEND_OTP = `${this.BASE_API_URL}/account/resend-otp`;
   static RESET_PASSWORD = `${this.BASE_API_URL}/account/reset-password`;
   static SEND_NEWS_LETTER = `${this.BASE_API_URL}/account/get-user`;
   static GET_COVER_COUNTRIES = `${this.BASE_API_URL}/account/get-available-countries`;
   static GET_CITIES = `${this.BASE_API_URL}/account/get-cities`;
   static TRAVELLER_REGISTER = `${this.BASE_API_URL}/account/register-traveler`;
   static TRAVELLER_SIGNIN = `${this.BASE_API_URL}/account/traveler-login`;
   static GET_TRAVELLER_DETAILS = `${this.BASE_API_URL}/account/get-traveller-details`;
   static UPDATE_TRAVELLER_DETAILS = `${this.BASE_API_URL}/account/traveller-update`;
   static POST_HELP_PLAN_MY_TRIP = `${this.BASE_API_URL}/account/create-travel-plans`;
   static FOLLOW_TRUNDLER = `${this.BASE_API_URL}/account/create-subscribe`;
   static UNFOLLOW_TRUNDLER = `${this.BASE_API_URL}/account/unsubscribe`;
   static MY_ORDERS = `${this.BASE_API_URL}/account/my-orders`;
   static GET_INVOICE = `${this.BASE_API_URL}/payment/invoice-download`;

   static POST_ITINERARY = `${this.BASE_API_URL}/itinerary/create`;
   static UPDATE_ITINERARY = `${this.BASE_API_URL}/itinerary/update-itinerary`;
   static GET_ALL_ITINERARIES = `${this.BASE_API_URL}/itinerary/get-all-itinerary`;
   static GET_ALL_ITINERARIES_BY_USER_ID = `${this.BASE_API_URL}/itinerary/get-user-itinerary`;
   static GET_TRAVELLER_HOME_DATA = `${this.BASE_API_URL}/itinerary/search`;
   static DELEE_ITINERAY = `${this.BASE_API_URL}/itinerary/delete-itinerary`;
   static GET_AN_ITINERAY = `${this.BASE_API_URL}/itinerary/get-single-itinerary`;
   static GET_INTERNT_ID = `${this.BASE_API_URL}/payment/create`;
   static CREATE_ORDER = `${this.BASE_API_URL}/payment/confirmation`;
   static CHANGE_STATUS = `${this.BASE_API_URL}/itinerary/change-status`;
   static PURCHASED_ITINERARIES = `${this.BASE_API_URL}/payment/get-orders`;
}
