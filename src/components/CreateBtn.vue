<template>
  <v-dialog v-model="dialog" width="400px">
    <template v-slot:activator="{ on }">
      <v-btn outlined color="green" v-on="on">
        <v-icon left>mdi-plus</v-icon>
        Create
      </v-btn>
    </template>
    <v-card>
        <v-toolbar dense color="#012B5C" dark>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-toolbar-title>
                New event
            </v-toolbar-title>
        </v-toolbar>

        <v-form v-model="valid" class="pa-5">
            <v-text-field
                v-model="eventName"
                :rules="eventRules"
                :counter="40"
                :error-messages="nameErrorMsg"
                label="* Event name"
                required
                @click="nameErrorMsg = ''"
            ></v-text-field>
            <v-textarea
                v-model="description"
                :counter="100"
                label="Event description"
                outlined
                clearable
            ></v-textarea>
            <v-menu
                ref="datePicker"
                v-model="datePicker"
                :close-on-content-click="false"
                :nudge-right="380"
                :return-value.sync="date"
                transition="scale-transition"
                min-width="290px"
                offset-y
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date"
                        class="mt-3"
                        label="* Date"
                        dense
                        readonly
                        outlined
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                        @click="dateErrorMsg = ''"
                        :error-messages="dateErrorMsg"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="date"
                    no-title
                    scrollable
                    @input="datePicker = false;
                            $refs.datePicker.save(date)"
                >
                </v-date-picker>
            </v-menu>

            <v-checkbox
                v-model="timed"
                label="Timed"
            ></v-checkbox>
            <v-row>
                <v-col cols="2">
                    <v-subheader> From </v-subheader>
                </v-col>
                <v-col>
                    <v-select
                        :disabled="!timed"
                        outlined
                        dense
                        v-model="startHour"
                        
                        persistent-hint
                        :items="hours">
                    </v-select>
                </v-col>
                <h2 class = "separator"> :</h2>
                 <!-- hint="Min" -->
                <v-col>
                    <v-text-field 
                        :disabled="!timed"
                        outlined
                        dense
                        :error-messages="startMinErrorMsg"
                        @click="startMinErrorMsg = ''"
                        persistent-hint
                        v-model="startMin">
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-select
                        :disabled="!timed"
                        outlined
                        dense
                        v-model="startAMPM"
                        :items="['AM', 'PM']">
                    </v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="2">
                    <v-subheader> To </v-subheader>
                </v-col>
                <!-- hint="Hour" -->
                <v-col>
                    <v-select
                        :disabled="!timed"
                        outlined
                        dense
                        v-model="endHour"
                        :error-messages="endHourErrorMsg"
                        @click="endHourErrorMsg = ''"
                        persistent-hint
                        :items="hours">
                    </v-select>
                </v-col>
                <!-- hint="Min" -->
                <h2 class = "separator"> :</h2>
                <v-col>
                    <v-text-field 
                        :disabled="!timed"
                        outlined
                        dense
                        :error-messages="endMinErrorMsg"
                        @click="endMinErrorMsg = ''"
                        persistent-hint
                        v-model="endMin">
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-select
                        :disabled="!timed"
                        outlined
                        dense
                        :error-messages="endAMPMErrorMsg"
                        @click="endAMPMErrorMsg = ''"
                        v-model="endAMPM"
                        :items="['AM', 'PM']">
                    </v-select>
                </v-col>
            </v-row>
        </v-form>
        <v-card-actions>
            <v-spacer/>
            <v-btn
                text
                @click="cancelNewEvent"
            >
                Cancel
            </v-btn>
            <v-btn 
                dark 
                color="#2196F3"
                @click="saveNewEvent"
            >
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from "vuex";

export default {
    data() {
        return {
        valid: false,
        dialog: false,

        eventName: "",
        nameErrorMsg: "",

        description: "",
        date: undefined,
        dateErrorMsg: "",

        datePicker: false,

        timed: true,

        startHour: [],
        startMin: "",
        startMinErrorMsg: "",
        startAMPM: "AM",

        endHour: [],
        endHourErrorMsg: "",
        endMin: "",
        endMinErrorMsg: "",
        endAMPM: "AM",
        endAMPMErrorMsg: "",
        hours: [1,2,3,4,5,6,7,8,9,10,11,12],

        eventRules: [
            (v) => v.length <= 40 || "Name must be less than 40 characters",
        ],

        };
    },
    methods: {
        ...mapMutations(["addEvent"]),
        modifyHour(hour, ampm){
            if(ampm == "AM" && hour < 10){
                return "0"+ hour.toString()
            } else if(ampm == "PM" && hour < 12){
                return (hour+12).toString()
            }else{
               return hour.toString()
            }
             
        },
        // modifyMin(min){
        //     if(parseInt(min) < 10){
        //         return "0"+ min
        //     } 
        //     return min
        // },
        saveNewEvent() {
            if (this.startMin.length == 0) {
                this.startMin = "0"
            }
            if (this.endMin.length == 0) {
                this.endMin = "0"
            }
            var flag = false
            if(this.eventName.length === 0) {
                this.nameErrorMsg = "Name is required"
                flag = true
            }
            if (this.date === undefined) {
                this.dateErrorMsg = "A date is required"
                flag = true
            }
            this.validateTime()
            if (!flag) {
                this.addEvent({
                    name: this.eventName,
                    start: new Date(this.date+"T"+this.modifyHour(this.startHour,this.startAMPM)+":"+this.startMin+":00"),
                    end: new Date(this.date+"T"+this.modifyHour(this.endHour,this.endAMPM)+":"+this.endMin+":00"),
                    color: "blue",
                    timed: this.timed
                })
                this.dialog = false
            }
        },
        validateTime() {
            if (isNaN(this.startMin) ||
                parseInt(this.startMin) < 0 || parseInt(this.startMin) > 59) {
                this.startMinErrorMsg = "Invalid"
            }
            if (isNaN(this.endMin) ||
                parseInt(this.endMin) < 0 || parseInt(this.endMin) > 59) {
                this.endMinErrorMsg = "Invalid"
            }
            if (this.startAMPM === "PM" && this.endAMPM === "AM") {
                this.endAMPMErrorMsg = "Invalid"
            }
            else if (this.startAMPM === this.endAMPM) {
                let startHr = this.startHour == "12" ? 0 : parseInt(this.startHour)
                let endHr = this.endHour == "12" ? 0 : parseInt(this.endHour)
                if (startHr > endHr) {
                    this.endHourErrorMsg = "Invalid"
                }
                else if (startHr == endHr && 
                    parseInt(this.startMin) >= parseInt(this.endMin)) {
                    this.endMinErrorMsg = "Invalid"
                }
            }
        },
        cancelNewEvent() {
            this.dialog = false
            this.date = undefined
            this.eventName = ""
            this.description = ""
            this.timed = true
            this.startHour = [],
            this.startMin = "",
            this.startAMPM = "AM",
            this.endHour = [],
            this.endMin = "",
            this.endAMPM = "AM"
            //Reset error messages
            this.nameErrorMsg = ""
            this.dateErrorMsg = ""
            this.startMinErrorMsg = ""
            this.endHourErrorMsg = ""
            this.endMinErrorMsg = ""
            this.endAMPMErrorMsg = ""
        }
    }
};
</script>

<style>
    .col {
        padding-bottom: 0px !important;
    }
    .separator{
        margin-top:10px;
    }
</style>