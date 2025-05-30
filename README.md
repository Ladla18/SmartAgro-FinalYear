# Smart Agriculture App 🌱

A comprehensive web application designed to empower farmers with modern agricultural tools and technologies. This application combines AI-powered disease detection, weather forecasting, marketplace features, and crop price predictions to help farmers make informed decisions.

## 🌟 Features

### 1. Crop Disease Detection

- AI-powered image analysis for crop disease identification
- Support for multiple crops including cereals, vegetables, fruits, and medicinal plants
- Detailed disease information including:
  - Disease description
  - Recommended treatments
  - Severity level
  - Common symptoms
  - Seasonal information
- Real-time camera capture and image upload capabilities
- Multi-language support (including Hindi)
- Text-to-speech functionality for accessibility

### 2. Weather Forecasting

- Real-time weather updates
- 5-day weather forecast
- Weather-based farming recommendations
- Special alerts for:
  - Thunderstorms
  - Heavy rainfall
  - Heat stress conditions
  - Optimal farming conditions

### 3. Buy & Sell Marketplace

- List your crops for sale
- Browse available crops from other farmers
- Detailed crop listings with:
  - Crop images
  - Quantity and pricing
  - Harvest dates
  - Location information
  - Organic certification status
- Manage your listings (add, edit, delete)

### 4. Crop Price Prediction

- AI-powered price forecasting
- Support for common crops:
  - Rice, Wheat, Maize
  - Potato, Tomato, Onion
  - Soybean, Cotton
  - Sugarcane, Groundnut
- State-wise price predictions
- Seasonal analysis (Kharif/Rabi)

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Google Generative AI (Gemini)
- Lucide Icons
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Serverless Framework
- AWS Lambda (optional)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (if running locally)
- Google Cloud API key (for Gemini AI features)
- OpenWeather API key (for weather features)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/smart-agriculture-app.git
cd smart-agriculture-app
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Install backend dependencies:

```bash
cd ../backend
npm install
```

4. Set up environment variables:

   - Create `.env` file in frontend directory:

   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_WEATHER_API_KEY=your_openweather_api_key
   VITE_API_URL=http://localhost:3000
   ```

   - Create `.env` file in backend directory:

   ```
   MONGODB_URI=your_mongodb_uri
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```

5. Start the development servers:
   - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```
   - Backend:
   ```bash
   cd backend
   npm run dev
   ```

## 📱 Usage

1. **Crop Disease Detection**

   - Navigate to the Disease Detection feature
   - Upload an image or use the camera
   - Get instant analysis with treatment recommendations
   - Save results to history for future reference

2. **Weather Forecasting**

   - Access the Weather Forecast feature
   - View current conditions and 5-day forecast
   - Follow farming recommendations based on weather

3. **Marketplace**

   - Add your crops with details and images
   - Browse available crops from other farmers
   - Manage your listings
   - Contact sellers/buyers

4. **Price Prediction**
   - Select crop type and state
   - Enter current market price
   - Get AI-powered price predictions
   - View seasonal trends

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Generative AI for disease detection capabilities
- OpenWeather API for weather data
- All contributors and supporters of the project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Made with ❤️ for farmers
