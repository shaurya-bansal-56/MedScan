import React, {useState} from 'react';
import { View, Text } from 'react-native';
import { Agenda, AgendaEntry } from 'react-native-calendars'

interface MedicationEntry extends AgendaEntry {
    time: string;
}

type MedicationSchedule = {
    [date: string]: MedicationEntry[];
};

const MyCalendar = () => {
    const [items, setItems] = useState<MedicationSchedule>({
        '2025-10-23': [{ name: 'Amlodiphine', time: '8:00 AM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '2:00 PM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '10:00 PM', height:70, day: '2025-10-23'}],
        '2025-10-24': [{ name: 'Amlodiphine', time: '8:00 AM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '2:00 PM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '10:00 PM', height:70, day: '2025-10-23'}],
        '2025-10-25': [{ name: 'Amlodiphine', time: '8:00 AM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '2:00 PM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '10:00 PM', height:70, day: '2025-10-23'}],
        '2025-10-26': [{ name: 'Amlodiphine', time: '8:00 AM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '2:00 PM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '10:00 PM', height:70, day: '2025-10-23'}],
        '2025-10-27': [{ name: 'Amlodiphine', time: '8:00 AM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '2:00 PM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '10:00 PM', height:70, day: '2025-10-23'}],
        '2025-10-28': [{ name: 'Amlodiphine', time: '8:00 AM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '2:00 PM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '10:00 PM', height:70, day: '2025-10-23'}],
        '2025-10-29': [{ name: 'Amlodiphine', time: '8:00 AM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '2:00 PM', height:70, day: '2025-10-23'}, {name: 'Amlodiphine', time: '10:00 PM', height:70, day: '2025-10-23'}]
    });

    return (
        <View style={{ flex: 1, marginHorizontal:10}}>
            <Agenda
                items={items}
                renderItem={(item) => (
                    const medItem = item as MedicationEntry;
                    return (
                        <View style={{ marginVertical: 10, marginTop: 30, backgroundColor: 'white', marginHorizontal: 10, padding: 10}}>
                            <Text style={{ fontWeight: 'bold'}}>{medItem.name}</Text>
                                <Text>{medItem.time}</Text>
                        </View>
                    );
                )}
            />
        </View>     
    );
}



