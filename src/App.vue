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
          v-if="auth.isSignIn"
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
import axios from "axios";
import { mapMutations, mapGetters, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";

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
      calendarList: [],
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
      const GoogleUser = await this.$gAuth.signIn();
      this.isSignIn = this.$gAuth.isAuthorized;
      this.access_token = GoogleUser.getAuthResponse().access_token;
      // console.log(this.access_token)
      console.log(await this.$gAuth.getAuthCode());
      this.email = GoogleUser.getBasicProfile().getEmail();
      this.avatarUrl = GoogleUser.getBasicProfile().getImageUrl();
      this.name = GoogleUser.getBasicProfile().getName();
      this.getCalendarList();
    },
    async logout() {
      await this.$gAuth.signOut();
      this.isSignIn = this.$gAuth.isAuthorized;
      this.access_token = "";
      this.email = "";
      this.name = "";
      this.avatarUrl = "https://api.adorable.io/avatars/100/abott@adorable.png";
      this.calendarList = [];
    },
    async getCalendarList() {
      let response = await axios.get(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          headers: {
            Authorization: `Bearer ${this.access_token}`,
          },
        }
      );
      response = response.data.items;
      this.calendarList = response.filter((calendar) => {
        return calendar.summary !== "General Events";
      });
    },
  },
};
</script>
