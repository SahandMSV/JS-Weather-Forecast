import './styles/main.css'
import {
  applyHeightTransitionOnResize,
  enableNavBtnRipples,
  enableTempUnitToggle,
  checkInternetConnection,
  enableDragScroll,
  enableForecastOverviewDetailBtnToggle,
  enableDailyForecastDetailBtnToggle,
  initializeDomStructure
} from './eventHandlers.js'

// Cards Container:
// Apply a smooth height transition to the `cardsContainer` element
// only when the viewport height increases
applyHeightTransitionOnResize()

// Navigation Buttons:
// Apply ripple effect to navigation buttons when clicked
enableNavBtnRipples()

// Control Center:
// Enable functionality to toggle temp units (Celsius/Fahrenheit)
enableTempUnitToggle()

// World Map:
// Verify the user's internet connection status by attempting to fetch
checkInternetConnection()

// Climate Overview Card:
// Enable drag scrolling functionality for the 24-hour forecast
// within the Climate Overview Card
enableDragScroll()

// Forecast Overview Card:
// Initialize button toggle functionality for the "Forecast Overview" and
// "Daily Forecast" detail buttons in the card headings
enableForecastOverviewDetailBtnToggle()
enableDailyForecastDetailBtnToggle()

// Daily Forecast Card:
initializeDomStructure()
