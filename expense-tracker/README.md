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
