import './styles/main.css'
import {
  enableNavBtnRipples,
  enableTempUnitToggle,
  enableDragScroll,
  enableOverviewDetailBtnToggle,
} from './eventHandlers.js'

// Navigation Buttons:
// Apply ripple effect to navigation buttons when clicked
enableNavBtnRipples()

// Control Center:
// Enable functionality to toggle temp units (Celsius/Fahrenheit)
enableTempUnitToggle()

// Climate Overview Card:
// Enable drag scrolling functionality for the 24-hour forecast
// within the Climate Overview Card
enableDragScroll()

// Forecast Overview Card:
// Initialize button toggle functionality for the "Overview" and
// "Details" buttons in the Forecast Overview Card
enableOverviewDetailBtnToggle()