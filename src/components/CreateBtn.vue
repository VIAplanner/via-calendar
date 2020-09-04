<template>
  <v-dialog v-model="dialog" width="400px">
    <template v-slot:activator="{ on }">
      <v-btn outlined color="green" v-on="on">
        <v-icon>mdi-plus</v-icon>
        <span>Create</span>
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
                :counter="10"
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
            ></v-textarea>
            <div style="height: 10px"/>
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
export default {
    data() {
        return {
        valid: false,
        dialog: false,
        date: undefined,
        eventName: "",
        description: "",
        nameErrorMsg: "",
        dateErrorMsg: "",
        datePicker: false,
        eventRules: [
            (v) => v.length <= 10 || "Name must be less than 10 characters",
        ],
        createDialog: false,
        };
    },
    methods: {
        saveNewEvent() {
            var flag = false
            if(this.eventName.length === 0) {
                this.nameErrorMsg = "Name is required"
                flag = true
            }
            if (this.date === undefined) {
                this.dateErrorMsg = "A date is required"
                flag = true
            }
            if (!flag) {
                this.dialog = false
            }
        },
        cancelNewEvent() {
            this.dialog = false
            this.date = undefined
            this.eventName = ""
            this.description = ""
            this.nameErrorMsg = ""
            this.dateErrorMsg = ""
        }
    }
};
</script>

<style>
</style>