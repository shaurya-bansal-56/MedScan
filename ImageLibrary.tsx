import React, { useState, useEffect, useContext, useCallback } from 'react';
// useContext: Allows children of a component to access gloabal context without prop drilling
// useCallback: Memorizes function so they aren't re-created on every render of the UI
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
// launchImageLibrary: Opens device's photo library
import axios from 'axios'
// This imports AXIOS client, which can send network requests
    // Uploads image or file from a backend server
    // Fetch URLs for storage
    // Handling POST or GET request to API

const Profile = () => {
    const [pickerResponse, setPickerResponse] = useState<ImagePickerResponse | null>(null);
    // pickerReponse --> Stores data from image picker(URL, file type, name)
    // setPickerRepsonse --> Setter function that upates pickerResponse

    const [visible, setVisible] = useState(false);
    // visible --> Dictates whthere something (like an image picker module) is open
    // setVisible -->

    const [imageFromDB, setImageFromDB] = useState('');
    // setImageFromDB: Updates the value once the data is fetched

    const [imageFormatError, setImageFormatError] = useState(false);
    // 

    // } <-- This was the main source of errror. It closed off the state variables to the components

    useEffect(() => {
        //useEffect takes two arguements, a callback function and a dependency array
        getUserImage(); // Function fetches or loads image from a database or API
    }, []); // Dependency Array [] is used to signal that this effect is used once

    const onImageGalleryClick = useCallback(()=> {

            launchImageLibrary({ 
                // Tells the image picker how to behave when it opens
                selectionLimit: 1, // Limits how many images a user takes
                mediaType: 'photo', // Makes sure the only media types visible are photos 
                includeBase64: true, // Tells the code to store code as base64 encoded string
            }, res => { // res is a callback function that is called when the user interacts with the picker
                // res may contain
                    // didCancel --> Did the user close the picker
                    // errorCode --> Did something when wrong
                    // assets --> An array of image info
                if(res.didCancel) { // If the user backsout without a photo, it logs a message to the console
                    console.log('User cancelled')
                } else if(res.errorCode) { // If the picker runs int any error, it logs the error and its details
                    console.log('ImagePickerError:', res.errorMessage)
                } else { // Runs if user successfully picks an image
                    setPickerResponse(res); // Saves the picker's repsonse to the component's state
                    if (res.assets?.length) {
                        SendImageToAPI(res.assets[0].base64, res.assets[0].type); // Selects information from the image
                    }
                    // res.assets[0].base64 --> Contains Base64 string of image data
                    // res.assets[0].type --> holds the type of image
                }
             });
        }, []) // Empty array singals the function is memorized and wont be rerendered later


const onCameraPress = useCallback(() => {
        launchCamera({
            saveToPhotos: false, // Determines whether the image should be saved to the user's gallery 
            mediaType: 'photo',   // Photos are the only media type displayed
            includeBase64: true,  // Photos are packaged with Base64 encoded string
            }, 
            res => {
            if (res.didCancel) { // if the user cancels request, it simply logs a message 
                console.log('User cancelled image picker');
            } else if (res.errorCode) { // if any error occur, it logs the error
                console.log( 'ImagePicker Error: ', res.errorMessage)
            } else { // If user successfully captures an image
                setPickerResponse(res); // Saves the response object to the state
                if (res.assets?.length) {
                SendImageToAPI(res.assets[0].base64, res.assets[0].type);        
            }}   
        });
    }, []);

    async function SendImageToAPI(base64, type) {
        if (
            type == 'image/jpeg' ||
            type == 'image/png' ||
            type == 'image/jpg' ||
            type == 'image/webp' ||
            type == 'image/gif' // || <-- This led to trailing on the if statement, causing an error
        ) {
            try {
                await axios.post('https://your-server-url.com/upload', {
                    image: base64,
                    mimeType: type,
                });
                console.log('Image uploaded succesfully');
            } catch(error) {
                console.error('Error uploading image:', error);
            }
        } else {
            setImageFormatError(true);
        }
    }
        


        async function getUserImage() {

            try {
                axios 
                    .get(

                    })
                    .then(Response.data.imageAsBase64);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } catch (error) {
                console.error(error);
            }  
        }
        
        const uri = pickerResponse?.assets && pickerResponse.assets[0].uri

        return (

        )
    }

export default Profile;

