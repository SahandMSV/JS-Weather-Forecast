// Navigation
export const navBtns = document.querySelectorAll('.nav-btns')

// Control Center
export const tempContainer = document.querySelector('.controls-unit-toggle-container')
export const tempBtnC = tempContainer.querySelector('.celsius')
export const tempBtnF = tempContainer.querySelector('.fahrenheit')

// Cards (General)
export const cardsContainer = document.querySelector('.cards-container')

// Climate Overview Card
export const dragScrollContainer = document.querySelector(
  '.climate-overview-24hr-forecast-items'
)
export const dragScrollShadowStart = document.querySelector(
  '.climate-24hr-forecast-shadow-overlay-start'
)
export const dragScrollShadowEnd = document.querySelector(
  '.climate-24hr-forecast-shadow-overlay-end'
)

// World Map Card
export const worldMapNoConnectionOverlay = document.querySelector('.world-map-no-connection-overlay')

// Forecast Overview
export const forecastOverviewDetailBtns = document.querySelector(
  '.forecast-overview-control-container'
).querySelectorAll('button')
export const forecastOverviewDetailIndicator = document.querySelector(
  '.forecast-overview-selected-indicator'
)

// Daily Forecast

export const dailyForecastDetailBtns = document.querySelector(
  '.daily-forecast-control-container'
).querySelectorAll('button')
export const dailyForecastDetailIndicator = document.querySelector(
  '.daily-forecast-selected-indicator'
)

export const dailyForecastData = document.querySelector('.daily-forecast-data')
