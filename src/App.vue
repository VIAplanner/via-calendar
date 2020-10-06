<template>
  <v-app>
    <v-container>
      <v-row>
        <create-btn />
        <v-spacer></v-spacer>
        <v-btn
          outlined
          class="mr-4"
          color="blue darken-2"
          @click="login"
          v-if="!auth.isSignIn"
          >Login</v-btn
        >
        <v-btn
          outlined
          class="mr-4"
          color="blue darken-2"
          @click="logout"
          v-else
          >Logout</v-btn
        >
      </v-row>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat color="white">
              <v-btn
                outlined
                class="mr-4"
                color="grey darken-2"
                @click="setToday"
                >Today</v-btn
              >
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">{{
                $refs.calendar.title
              }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    outlined
                    color="grey darken-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Day</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Week</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Month</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = '4day'">
                    <v-list-item-title>4 days</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = '2day'">
                    <v-list-item-title>2 days</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :type="type"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="updateRange"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-toolbar-title
                    v-html="selectedEvent.name"
                  ></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    @click="
                      deleteEvent(selectedEvent.uuid), (selectedOpen = false)
                    "
                    icon
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <!-- <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>-->
                </v-toolbar>
                <v-card-text>
                  <span v-html="selectedEvent.details"></span>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    text
                    color="secondary"
                    @click="selectedOpen = false"
                    style="margin-left: 280px"
                    >Cancel</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import CreateBtn from "./components/CreateBtn";
import { mapMutations, mapGetters, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default {
  name: "App",
  components: {
    CreateBtn,
  },

  data: () => ({
    dummyDate: {
      summary: "Go to the Bank",
      description:
        "Go to the bank and get a confirmation letter for my address.",
      start: {
        dateTime: "2020-09-28T08:00:00-07:00",
      },
      end: {
        dateTime: "2020-09-28T09:00:00-07:00",
      },
    },
    dialog: false,
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
      "2day": "2 Days",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party",
    ],
    auth: {
      isSignIn: false,
      access_token: "",
      email: "",
      name: "",
    },
  }),
  computed: {
    ...mapGetters(["getEventList"]),
  },
  mounted() {
    this.$refs.calendar.checkChange();
    this.parseEvent(this.dummyDate);
  },

  methods: {
    ...mapMutations(["addEvent"]),
    ...mapActions(["deleteEvent"]),
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange() {
      this.events = this.getEventList;
    },
    parseEvent(googleEvent) {
      let timed = googleEvent.start.dateTime.length <= 10 ? true : false;
      this.addEvent({
        uuid: uuidv4(),
        details: googleEvent.description,
        name: googleEvent.summary,
        start: new Date(googleEvent.start.dateTime),
        end: new Date(googleEvent.end.dateTime),
        color: "blue",
        timed,
      });
    },
    async login() {
      // const GoogleUser = await this.$gAuth.signIn();
      // this.access_token = GoogleUser.getAuthResponse().access_token;
      let authCode = await this.$gAuth.getAuthCode();
      this.auth.isSignIn = this.$gAuth.isAuthorized;
      // console.log(this.access_token)
      // console.log(await this.$gAuth.getAuthCode());
      let response = await axios.post(
        "https://accounts.google.com/o/oauth2/token",
        {
          client_id: process.env.VUE_APP_CLIENT_ID,
          client_secret: process.env.VUE_APP_CLIENT_SECRET,
          redirect_uri: "postmessage",
          grant_type: "authorization_code",
          code: authCode,
          headers: {
            Content_Type: "application/x-www-form-urlencoded",
          },
        }
      );

      response = response.request.response;
      this.auth.access_token = JSON.parse(response).access_token;
      await this.getCalendarList();
      // this.auth.email = GoogleUser.getBasicProfile().getEmail();
      // this.auth.avatarUrl = GoogleUser.getBasicProfile().getImageUrl();
      // this.auth.name = GoogleUser.getBasicProfile().getName();
    },
    async logout() {
      await this.$gAuth.signOut();
      this.auth.isSignIn = this.$gAuth.isAuthorized;
      this.auth.access_token = "";
      this.auth.email = "";
      this.auth.name = "";
      this.calendarList = [];
      // this.auth.avatarUrl = "https://api.adorable.io/avatars/100/abott@adorable.png";
    },
    async getCalendarList() {
      let response = await axios.get(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          headers: {
            Authorization: `Bearer ${this.auth.access_token}`,
          },
        }
      );

      response = JSON.parse(response.request.response);
      let calendarID = response.items[4].id;
      await this.getCalendarEvents(calendarID);
    },
    async getCalendarEvents(calendarID) {
      console.log(this.auth.access_token)
      let response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
        {
          params:{
            timeMin: "2020-09-04T08:00:00+00:00"
          },
          headers: {
            Authorization: `Bearer ${this.auth.access_token}`,
          },
        }
      );
      response = response.data.items;
      console.log(response);
    },
  },
};
</script>
