// Import necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import firebaseConfig from  './config.js'


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to initialize the counter from Firestore and set up real-time updates
async function initializeCounter(counterId) {
    try {
        const counterRef = doc(db, 'counters', counterId);
        const counterSnap = await getDoc(counterRef);
        const counterElement = document.getElementById(`${counterId}-counter`);

        if (counterSnap.exists()) {
            counterElement.textContent = counterSnap.data().count || 0;
        } else {
            // Set initial data if document doesn't exist
            await setDoc(counterRef, { count: 0 });
            counterElement.textContent = 0;
        }

        // Real-time listener for updates
        onSnapshot(counterRef, (doc) => {
            if (doc.exists()) {
                counterElement.textContent = doc.data().count;
            }
        });
    } catch (error) {
        console.error(`Error initializing counter for ${counterId}:`, error);
    }
}

// Function to increase the counter and save it to Firestore
async function increaseCounter(counterId,redirectUrl) {
    try {
        const counterRef = doc(db, 'counters', counterId);
        await updateDoc(counterRef, {
            count: increment(1)
        });
        console.log(`Counter for ${counterId} increased successfully!`);

        // Redirect after incrementing the counter
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 10); // Delay to let the user see the increment
    } catch (error) {
        console.error(`Error incrementing counter for ${counterId}:`, error);
    }
}

// Make the increaseCounter function global
window.increaseCounter = increaseCounter;

// Initialize the counter on page load
window.onload = () => {
    // Initialize the counter for 'club1' as an example
    initializeCounter('club1');
    initializeCounter('club2');
    initializeCounter('club3');
    initializeCounter('club4');
};