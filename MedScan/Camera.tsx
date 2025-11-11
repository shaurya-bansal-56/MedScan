import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  CameraCapturedPicture,
} from "expo-camera";

const YOUR_SERVER_IP = "***********";
const API_URL = `http://${YOUR_SERVER_IP}:5000/scan`;

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera access is required to take photos.
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        setAnalysisResult(null);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
          exif: false,
        });
        setPhoto(photo);
        console.log("Photo captured:", photo.uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!photo) return;

    setIsLoading(true);
    setAnalysisResult(null);

    const formData = new FormData(); // FormData is a way to contruct key value pairs to represent form fields and their values
    const uri = photo.uri;
    const filename = uri.split("/").pop() || "photo.jpg"; // Extracts filename from the full path
    const match = /\.(\w+)$/.exec(filename); // This finds and captures the file's extensions
    // \. <-- Looks for the literal dot
    // (\w+) <-- This looks for one or more word characters after the \.
    // $ <-- Ensures match happens at the end of the srting
    // .exec(filename) <== Executes a search on the specific filename
    const type = match ? `image/${match[1]}` : `image`; // Determnines the MIME type of the image by looking for the second part of the match array

    formData.append("photo", {
      uri: uri,
      name: filename,
      type: type,
    } as any);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Analysis success:", data);
        setAnalysisResult(data);
      } else {
        console.error("Analysis failed:", data.error);
        setAnalysisResult({ error: data.error || "Failed to analyze" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setAnalysisResult({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnalysis = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#fff" />;
    }

    if (!analysisResult) {
      return null;
    }

    if (analysisResult.why) {
      return (
        <View style={styles.resultBox}>
          <Text>{analysisResult.why}</Text>
        </View>
      );
    }

    if (analysisResult.error) {
      return (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Error</Text>
          <Text>{analysisResult.error}</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.resultBox}>
        <Text style={styles.resultTitle}>
          {analysisResult.Name || "Medication"}
        </Text>
        <Text>{analysisResult.Dosage}</Text>

        <Text style={styles.resultHeading}>Dosage:</Text>
        <Text>{analysisResult.Dosage}</Text>

        <Text style={styles.resultHeading}>Uses:</Text>
        {analysisResult.Usage?.map((use: string) => (
          <Text key={use}>- {use}</Text>
        ))}

        <Text style={styles.resultHeading}>Uncommon Side Effects:</Text>
        {analysisResult["Side Effects"]?.["Common Side Effects"]?.map(
          (effect: string) => (
            <Text key={effect}>- {effect}</Text>
          )
        )}

        <Text style={styles.resultHeading}>Uncommon Side Effects:</Text>
        {analysisResult["Side Effects"]?.["Uncommon Side Effects"]?.map(
          (effect: string) => (
            <Text key={effect}>- {effect}</Text>
          )
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.preview} />

          {renderAnalysis()}

          <View style={styles.previewControls}>
            <Button
              title="Retake"
              onPress={() => {
                setPhoto(null);
                setAnalysisResult(null);
              }}
              disabled={isLoading}
            />
            <Button
              title={isLoading ? "Analyzing..." : "Analyze Photo"}
              onPress={uploadAndAnalyze}
              disabled={isLoading || !!analysisResult}
            />
          </View>
        </View>
      ) : (
        <>
          <CameraView ref={cameraRef} style={styles.camera} />
          <View style={styles.controls}>
            <Button title="Capture Photo" onPress={takePhoto} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  camera: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    color: "#333",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  // New styles for results
  resultBox: {
    maxHeight: "60%",
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  resultHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});

// import { Image, View } from 'react-native';

// export default function HomePage() {
//     return (
//         <View>
//             <Image source= {require('./assets/icon.png')} />
//         </View>
//     )
// }

// import { Camera } from 'expo-camera' // Allows us to use all functionality of the camera
// // Rendering a camera preview
// // Request permissions
// // Take pictures
// // Access camera types (front/back)

// import { useState, useEffect, useRef} from 'react';
// // useEffect: Runs  side effects such as asking for permission only when the component first mounts
// // useRef: Allows us to create a mutable object that will be preserved across re-renders
//         // Unlike useState, useRef doesn't rerender when any change is made to the referenced object
//         // useRef also allows us to access tools within the reference

// import { Button, View, Text } from 'react-native';
// // View: The basic container for the layout
// // Button: Makes a pressable element

// export default function HomePage() {
//     const [hasPermission, setHasPermission] = useState<Camera | null>(null)
//     // hasPermission: Checks to see whether the camera has permission or not
//     // setHasPermission: Changes the permissions of the camera
//     const cameraRef = useRef(null); // Gives a continuous reference to the camera component

//     useEffect(() => {
//         (async () => {
//             const { status } = await
// Camera.requestCameraPermissionsAsync();
//     setHasPermission(status === 'granted');
//         }) ();
//     }, []);

//     const takePicture = async () => {
//         if (cameraRef.current) {
//             const photo = await cameraRef.current.takePictureAsync();
//             console.log(photo.uri);
//         }
//     };

//     if (hasPermission === null) return <View />;
//     if (hasPermission === false) return <Text>No access to the camera</Text>

//     return (
//         <Camera style={{ flex: 1}} ref={cameraRef}>
//             <Button title="Take Picture" onPress={takePicture} />
//         </Camera>
//     );
// }
