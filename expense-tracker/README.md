// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddNewPage from './pages/AddNewPage';
import InventoryPage from './pages/InventoryPage';
import FindMatchPage from './pages/FindMatchPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-new" element={<AddNewPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/find-match" element={<FindMatchPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// pages/HomePage.jsx
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <h1 className="main-heading">Smart Closet</h1>
      
      <div className="home-sections">
        <div className="home-section inventory-section">
          <Link to="/inventory" className="section-link">
            <div className="section-content">
              <img src="/api/placeholder/200/200" alt="Inventory" className="section-image" />
              <h2>Inventory</h2>
            </div>
          </Link>
        </div>
        
        <div className="home-section middle-section">
          <div className="middle-container">
            <Link to="/add-new" className="section-link">
              <div className="section-content">
                <img src="/api/placeholder/200/100" alt="Add New" className="section-image" />
                <h2>Add New</h2>
              </div>
            </Link>
            
            <Link to="/find-match" className="section-link">
              <div className="section-content">
                <img src="/api/placeholder/200/100" alt="Find a Match" className="section-image" />
                <h2>Find a Match</h2>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="home-section picks-section">
          <div className="section-content">
            <h2>Selected Picks</h2>
            <div className="picks-container">
              <div className="pick-item">
                <img src="/api/placeholder/150/100" alt="Top wear pick" className="pick-image" />
                <p>Top</p>
              </div>
              <div className="pick-item">
                <img src="/api/placeholder/150/100" alt="Bottom wear pick" className="pick-image" />
                <p>Bottom</p>
              </div>
              <div className="pick-item">
                <img src="/api/placeholder/150/100" alt="Footwear pick" className="pick-image" />
                <p>Footwear</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

// pages/AddNewPage.jsx
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import '../styles/AddNewPage.css';

function AddNewPage() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedType, setSelectedType] = useState('topwear'); // Default to topwear
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access the camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
      
      // Stop the camera after capturing
      stopCamera();
    }
  };

  const saveToInventory = () => {
    // Get existing inventory or initialize empty
    const existingInventory = JSON.parse(localStorage.getItem('clothingInventory')) || {
      topwear: [],
      lowerwear: [],
      footwear: []
    };
    
    // Add the new item to the selected category
    existingInventory[selectedType].push({
      id: Date.now(),
      image: capturedImage,
      addedOn: new Date().toISOString()
    });
    
    // Save back to localStorage
    localStorage.setItem('clothingInventory', JSON.stringify(existingInventory));
    
    // Navigate to inventory page
    navigate('/inventory');
  };

  const handleCancel = () => {
    setCapturedImage(null);
    stopCamera();
  };

  return (
    <div className="add-new-page">
      <div className="header">
        <Link to="/" className="back-link">
          <ArrowLeft size={24} />
        </Link>
        <h1>Add New</h1>
      </div>

      <div className="content-container">
        <div className="camera-section">
          {!capturedImage ? (
            <>
              <div className="video-container">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="camera-preview"
                />
                {!streamRef.current && (
                  <div className="camera-placeholder">
                    <Camera size={48} />
                    <p>Click to access camera</p>
                  </div>
                )}
              </div>
              <div className="camera-controls">
                <button 
                  className="camera-button"
                  onClick={streamRef.current ? capturePhoto : startCamera}
                >
                  <Camera size={24} />
                  {streamRef.current ? 'Capture' : 'Start Camera'}
                </button>
              </div>
            </>
          ) : (
            <div className="preview-container">
              <img src={capturedImage} alt="Captured" className="captured-preview" />
            </div>
          )}
        </div>

        <div className="options-section">
          {capturedImage && (
            <>
              <div className="preview-image">
                <img src={capturedImage} alt="Preview" />
              </div>
              
              <div className="item-type-selection">
                <h3>Select Item Type:</h3>
                <div className="type-options">
                  <label>
                    <input 
                      type="radio" 
                      name="itemType" 
                      value="topwear" 
                      checked={selectedType === 'topwear'}
                      onChange={() => setSelectedType('topwear')}
                    />
                    Top wear
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="itemType" 
                      value="lowerwear" 
                      checked={selectedType === 'lowerwear'}
                      onChange={() => setSelectedType('lowerwear')}
                    />
                    Lower wear
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="itemType" 
                      value="footwear" 
                      checked={selectedType === 'footwear'}
                      onChange={() => setSelectedType('footwear')}
                    />
                    Footwear
                  </label>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                <button className="save-button" onClick={saveToInventory}>Save</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddNewPage;

// pages/InventoryPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/InventoryPage.css';

function InventoryPage() {
  const [inventory, setInventory] = useState({
    topwear: [],
    lowerwear: [],
    footwear: []
  });

  // Load inventory data from localStorage on component mount
  useEffect(() => {
    const savedInventory = JSON.parse(localStorage.getItem('clothingInventory')) || {
      topwear: [],
      lowerwear: [],
      footwear: []
    };
    setInventory(savedInventory);
  }, []);

  return (
    <div className="inventory-page">
      <div className="header">
        <Link to="/" className="back-link">
          <ArrowLeft size={24} />
        </Link>
        <h1>Inventory</h1>
      </div>

      <div className="inventory-container">
        <section className="inventory-section">
          <h2>Top Wear</h2>
          <div className="item-grid">
            {inventory.topwear.length > 0 ? (
              inventory.topwear.map(item => (
                <div key={item.id} className="item-card">
                  <img src={item.image} alt="Top wear" />
                </div>
              ))
            ) : (
              <p className="empty-message">No top wear items yet</p>
            )}
          </div>
        </section>

        <section className="inventory-section">
          <h2>Lower Wear</h2>
          <div className="item-grid">
            {inventory.lowerwear.length > 0 ? (
              inventory.lowerwear.map(item => (
                <div key={item.id} className="item-card">
                  <img src={item.image} alt="Lower wear" />
                </div>
              ))
            ) : (
              <p className="empty-message">No lower wear items yet</p>
            )}
          </div>
        </section>

        <section className="inventory-section">
          <h2>Footwear</h2>
          <div className="item-grid">
            {inventory.footwear.length > 0 ? (
              inventory.footwear.map(item => (
                <div key={item.id} className="item-card">
                  <img src={item.image} alt="Footwear" />
                </div>
              ))
            ) : (
              <p className="empty-message">No footwear items yet</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default InventoryPage;

// pages/FindMatchPage.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/FindMatchPage.css';

function FindMatchPage() {
  return (
    <div className="find-match-page">
      <div className="header">
        <Link to="/" className="back-link">
          <ArrowLeft size={24} />
        </Link>
        <h1>Find a Match</h1>
      </div>
      
      <div className="find-match-content">
        <p>Find matching outfits functionality would be implemented here.</p>
      </div>
    </div>
  );
}

export default FindMatchPage;



/* App.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #f5f5f5;
}

.App {
  max-width: 100%;
  margin: 0 auto;
}

a {
  text-decoration: none;
  color: inherit;
}

/* HomePage.css */
.home-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-heading {
  text-align: center;
  padding: 20px 0;
  background-color: #2c3e50;
  color: white;
  margin-bottom: 16px;
}

.home-sections {
  display: flex;
  flex: 1;
  padding: 0 16px;
}

.home-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.inventory-section {
  flex: 1;
  background-color: #ecf0f1;
  border-radius: 8px;
  margin-right: 8px;
}

.middle-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 8px;
}

.middle-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
}

.section-link {
  display: block;
  width: 100%;
  height: 100%;
}

.picks-section {
  flex: 1;
  background-color: #ecf0f1;
  border-radius: 8px;
  margin-left: 8px;
  padding: 16px;
}

.section-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: transform 0.2s;
}

.section-content:hover {
  transform: translateY(-3px);
}

.section-image {
  width: 100%;
  max-width: 150px;
  margin-bottom: 10px;
  border-radius: 6px;
  object-fit: cover;
}

.section-content h2 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 8px;
}

.picks-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.pick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pick-image {
  width: 100%;
  max-width: 120px;
  height: 70px;
  border-radius: 6px;
  object-fit: cover;
  margin-bottom: 5px;
}

.pick-item p {
  font-size: 0.9rem;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .home-sections {
    flex-direction: column;
  }
  
  .home-section {
    width: 100%;
    margin: 8px 0;
  }
  
  .inventory-section, .picks-section {
    margin: 8px 0;
  }
}

/* AddNewPage.css */
.add-new-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #2c3e50;
  color: white;
}

.back-link {
  display: flex;
  align-items: center;
  color: white;
  margin-right: 12px;
}

.content-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.camera-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  background-color: #34495e;
  padding: 16px;
}

.options-section {
  flex: 1;
  padding: 16px;
  background-color: #ecf0f1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.video-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2c3e50;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.camera-preview {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
}

.camera-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}

.camera-controls {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.camera-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.camera-button:hover {
  background-color: #2980b9;
}

.preview-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
}

.captured-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.item-type-selection {
  margin-bottom: 16px;
}

.type-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.type-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.cancel-button, .save-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.cancel-button {
  background-color: #e74c3c;
  color: white;
}

.save-button {
  background-color: #2ecc71;
  color: white;
}

.cancel-button:hover {
  background-color: #c0392b;
}

.save-button:hover {
  background-color: #27ae60;
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
  }
  
  .camera-section, .options-section {
    flex: auto;
  }
  
  .options-section {
    min-height: 300px;
  }
}

/* InventoryPage.css */
.inventory-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.inventory-container {
  padding: 16px;
}

.inventory-section {
  margin-bottom: 24px;
}

.inventory-section h2 {
  color: #2c3e50;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.item-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  aspect-ratio: 3/4;
  transition: transform 0.2s;
}

.item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.item-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-message {
  color: #7f8c8d;
  font-style: italic;
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  text-align: center;
}

/* FindMatchPage.css */
.find-match-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.find-match-content {
  padding: 24px;
  text-align: center;
}

create a web page in react and a separate css for the page in which we have a heading of Add New and an icon before it which will redirect us to home page. the screen is divided into two parts: 2/3 of the screen has the functionality to capture the photo of a top wear (shirt pant etc) . there should an icon of camera ,clicking on which we can open the camera to capture. The rest 1/3 of the screen contains photo captured on the right side and at the bottom of which there is option to cancel or save the photos to the inventory . upon saving the item will go to the inventory page where the page has heading inventory and the icon before it to take us to home page. Inventory page has three parts top wear , lower and footwear . whatever was captured in the add new page will be rendered to the inventory page in the respective column of shirt pant or shoes. the home page contains the heading smart closet at the top and the screen divided into three equal sections .the leftmost section has the inventory image upon which inventory is written. It will take us to the unventory page. then in the middle, it is divide into two parts: at the above we have add new page written over an image and below we haave find a match option written over an image clicking on which we will be directed to the respective pages. at the rightmost section we have the selected picks of the day with three section top middle and bottom . this will be given in ui dynamically so that there is minimal work in integration. create the webpages and use react vite app use react routers and give the project

Edit
I'll create a React application for a Smart Closet system with the pages you've described. I'll use React Router for navigation, create separate CSS files, and implement the camera functionality for capturing clothing items.

Let's start by creating the application structure and implementing the core features:


Smart Closet App Structure
Code 
Now, let's create the CSS files for styling each component:


Smart Closet CSS Files
Code 
Now, let's create the main React project setup files to complete the application:


Smart Closet Project Setup Files
Code 
Let's create a simple interactive demonstration of the Smart Closet app:


Drafting artifact...
 



Continue

Edit
I'll continue creating the interactive demonstration of the Smart Closet app:


Smart Closet Interactive Demo
Interactive artifact 
I've created a complete Smart Closet web application using React with the following features:

Project Structure
The application is built using React and Vite, and contains these main pages:

Home Page - The main dashboard with three sections:
Left section: Inventory access
Middle section: "Add New" and "Find a Match" options
Right section: Selected picks of the day
Add New Page - For capturing new clothing items:
2/3 of the screen dedicated to camera functionality
1/3 of the screen showing the preview and options
Options to select item type (topwear, lowerwear, footwear)
Save/Cancel buttons
Inventory Page - To view all clothing items:
Items organized by category (topwear, lowerwear, footwear)
Grid layout for easy browsing
Back button to return to home
Find a Match Page - Placeholder for outfit matching functionality
Key Implementation Details
Camera Functionality
Uses the browser's Web Camera API
Captures photos and displays them for review
Can cancel or save the captured image
Navigation
Implements React Router for seamless page transitions
Each page has a back button to return to the home page
Clean, intuitive interface
Data Storage
Uses localStorage to persist the inventory data
Organizes items by category for easy retrieval
Responsive Design
Works on mobile and desktop browsers
Adjusts layout based on screen size
Interactive Demo
I've also included an interactive demo component that shows how the app works without requiring camera access. This demonstrates the user flow and UI interactions.

How to Run the Project
Install dependencies:
npm install
Start the development server:
npm run dev
Access the application in your browser (typically at http://localhost:5173)
The application is designed to be user-friendly and intuitive, with a clean visual design that focuses on functionality. The camera implementation follows best practices for web applications, requesting permissions and handling the camera stream appropriately.

Would you like me to explain any specific part of the implementation in more detail?








// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// index.css
:root {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  
  color-scheme: light dark;
  color: #213547;
  background-color: #f5f5f5;
  
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  overflow-x: hidden;
}
