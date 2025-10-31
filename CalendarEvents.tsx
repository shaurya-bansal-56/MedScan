import React, { useEffect, useState } from "react";
// useEffect: Used to run a side effect once a component mounts, to made sure
// the code only ran once

import {
  View,
  StyleSheet,
  TextInput, // Component that lets user enter and edit text
  Button,
  Text, // Displays static and dynamic text
  Platform, // Provides information about the operating system
} from "react-native";
import RNCalendarEvents, { Calendar } from "react-native-calendar-events";
// React Native library that accesses and modifies events on a device's calendar

const Calendar = () => {
  const [eventTitle, setEventTitle] = useState("Gym Workout"); //Sets title of the event
  const [eventLocation, seteventLocation] = useState("New Dehli"); //Sets location of the event
  const [eventId, seteventId] = useState(""); // Sets the unique identifier of the event
  const [calendars, setCalendars] = useState<Calendar[]>([]); // Holds an array of all calendar events
  // <Calendar[]> Tells the useState variable to store calendars as an array
  const [pickedCal, setPickedCal] = useState<Calendar | null | undefined>(null); //Stores one calendar from the list of device calendars
  // This fix changes the state to not always be null, but can be either a calendar event or null

  useEffect(() => {
    async function loadCalendars() {
      // async handles functions like permission requests and fetching data
      try {
        const perms = await RNCalendarEvents.requestPermissions();
        // await pauses execution until user grants or denies permission to calendar
        if (perms === "authorized") {
          const allCalendars = await RNCalendarEvents.findCalendars();
          // await pauses execution until RNCalenderEvents finds all calenders on the user's device
          // returns an array of objects that include metadata
          const primaryCal = allCalendars.find(
            (cal) => cal.isPrimary && cal.allowsModifications
            // .find itereates through array to find object that both are primary and are editable
          );
          setCalendars(allCalendars);
          // Updates the state of number of calendars with all calendars fetched
          setPickedCal(primaryCal);
          // pickedCal holds the primary calendar that meets both requirements listed above
        } else {
          console.log("Calendar permission denied");
        }
      } catch (error) {
        console.log("Error while fetching calendars:", error);
      }
    }

    if (Platform.OS === "android") {
      // Runs function thats mainly usable on Android
      loadCalendars();
    }
  }, []);

  const createEvent = async () => {
    try {
      const savedEventId = await RNCalendarEvents.saveEvent(eventTitle, {
        // await pauses execution until Calendar Event is saved with eventTitle(saved State) and metaobjects
        calendarId: Platform.OS === "android" ? pickedCal?.id : undefined,
        // Specififies which calendar to savethe event(Makes sure its the same ideal calendar from before)
        startDate: new Date().toISOString(),
        // startDate sets the start time, which is the current time in an ISO String(Made for dates and ties)
        endDate: new Date().toISOString(),
        // endDate sets the end time, which is also the same time in an ISO String
        location: eventLocation,
        // Event of location taken from eventLocation state
      });

      seteventId(savedEventId);
      // Attaches ID to change the state
      alert("Event saved successfully.");
    } catch (error) {
      console.log("Error while saving event:", error);
    }
  };
  const fetchEvent = async () => {
    // Declares asynchronous function that fetches event details
    try {
      const eventData = await RNCalendarEvents.findEventById(eventId);
      // Locates event on the device using its unique identifier
      console.log("Event Data:", eventData);
    } catch (error) {
      console.log("Error while fetching event:", error);
    }
  };
  return (
    <View style={styles.container}>
      {" "}
      {/* View acts as the container, where styles.container centers and pads the contents */}
      {/* This is inside of the React functional component */}
      <TextInput
        style={styles.textInput}
        placeholder="Enter Event Title"
        value={eventTitle}
        onChangeText={setEventTitle}
      />
      {/* placeholder is a grey hint text shown when the field is empty */}
      {/* binds the value entered to eventTitle */}
      {/* Changes event title every time the user changes it*/}
      <TextInput
        style={styles.textInput}
        placeholder="Enter Event Location."
        value={eventLocation}
        onChangeText={seteventLocation}
        multiline={true}
        numberOfLines={2}
      />
      {/* multiline: Allows the user to type multiple lines*/}
      {/* numberofLines set the default visible height */}
      {/* value is bound to eventLocation*/}
      {/* Links the value to the eventLocation state variable*/}
      <Button title="Save Event" onPress={createEvent} />
      {/* Renders a button that when presssed triggers createEvent function*/}
      <Button title="Fetch Event" onPress={fetchEvent} />
      {/* Renders a button that when presses triggers fetchEvent function */}
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb", // light neutral background
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827", // slightly darker text
    marginBottom: 24,
    textAlign: "center",
  },

  textInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  multilineInput: {
    height: 90,
    textAlignVertical: "top",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 24,
  },

  button: {
    flex: 1,
    backgroundColor: "#2563eb", // modern blue (matches icon tones)
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 6,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
});
