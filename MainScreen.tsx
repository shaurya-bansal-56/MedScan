import React, { useEffect, useState} from 'react';
// useState --> Update state of the UI
// useEffect --> Ran for fetching data or asking permissions

import { Text, View, StyleSheet } from 'react-native';
//Text --> Used to render error or permission messages
//View --> Basic container component
//StyleSheet --> Allows you to define and use styles in an organizef way

import { Camera, useCameraDevice } from 'react-native-vision-camera'
// Camera --> UI component from Vision Camera
// useCameraDevice --> Hook by Vision Camera to reference the specific camera

import { useSkiaFrameProcessor } from 'react-native-vision-camera';

function MainScreen({ hasPermission } : {hasPermission: boolean}) { 
    // This is Typescript prop typing --> The function MainScreen expects a prop named hasPermission(a boolean)
    const device = useCameraDevice('back');
    // Returns device info for the back of the camera

    if (!device) {
        return <></>    
    } 

    return (
        <View style={StyleSheet.absoluteFill}> 
            <View style={{ flex: 1 }}> 
                <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
            </View>
        </View> 
        );
    }
//View: acts a layout paper
//Absolutefill --> Makes sure the view fills the entire screen

//style={{flex: 1}} --> Makes sure inner view fills in all avaiable space of parent view
//device={device} --> Tells it to use the front camera
//isActive --> Tells it to start sreaming video when the component is mounted

    export default function MainScreenAskingForPermission() {
        const [hasPermission, setHasPermisssion] = useState(false); //Starts as false because
        // Declares a state variable: hasPermisssion --> Current state, setHasPermission --> Function to change it
    useEffect(() => { //Runs code once, after the component mounts
        Camera.requestCameraPermission().then((p) => //This function triggers the permission prompt
            // When the promise resolves, p is checked
            setHasPermisssion(p === 'granted')
            // if permission is granted, setHasPermission will be true
        );
    }, []);

        return <MainScreen hasPermission={hasPermission} />;
        // Renders the MainScreen component and passes down permission results
    }

    // Using both the Skia graphics engine and the Vision-Camera, we can analyze frames in realtime
    const frameProcessor = useSkiaFrameProcessor((frame) => { // (frame) --> Receives a frame object from the Camera
        // useSkiaFrameProcessor --> Frame processor finction that runs a seperate UI(worklet) for every camera frame
        'worklet';
        // Tells Vision Camera run this on the VisionCamera Worklet Runtime

        frame.render(); // Renders the camera frame to the screen using Skia's rendering engine

    }, []); // This is a dependency array, showing to Vision Camera that there is no longer a need to render the camera
    

        <Camera
            style={StyleSheet.absoluteFill} // Make sure the camera fills the screen
            device={device} 
            isActive // Turns the camera stream on
            frameProcessor={frameProcessor} // Attaches the frameProcessor function
        />

