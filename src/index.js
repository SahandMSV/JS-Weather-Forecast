import './styles/main.css'
import {
  navbarBtnActiveAction,
  toggleTempUnit,
  enableDragScroll,
  toggleOverviewGraph
} from './eventHandlers.js'

// Navigation buttons active state
const navBtns = document.querySelectorAll('.nav-btns')
navBtns.forEach(navBtn => {
  navBtn.addEventListener('click', navbarBtnActiveAction)
})

// Control Center

// Temperature unit toggle action
let currentUnit = 'celsius'
const tempContainer = document.querySelector('.controls-unit-toggle-container')
const tempBtnC = tempContainer.querySelector('.celsius')
const tempBtnF = tempContainer.querySelector('.fahrenheit')

tempBtnC.addEventListener('click', () => {
  currentUnit = toggleTempUnit(tempContainer, currentUnit, 'celsius')
})
tempBtnF.addEventListener('click', () => {
  currentUnit = toggleTempUnit(tempContainer, currentUnit, 'fahrenheit')
})

// Climate Overview Card

const climateOverviewContainer = document.querySelector('.climate-overview-24hr-forecast-items')
const climateOverviewShadowStart = document.querySelector('.climate-24hr-forecast-shadow-overlay-start')
const climateOverviewShadowEnd = document.querySelector('.climate-24hr-forecast-shadow-overlay-end')

enableDragScroll(
  climateOverviewContainer,
  climateOverviewShadowStart,
  climateOverviewShadowEnd
)

// Forecast Overview Card

const forecastOverviewDetailContainer =
  document.querySelector('.forecast-overview-control-container')
const forecastOverviewDetailBtns =
  forecastOverviewDetailContainer.querySelectorAll('button')
const forecastOverviewDetailIndicator = 
  document.querySelector('.forecast-overview-selected-indicator')

forecastOverviewDetailBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    toggleOverviewGraph(
      forecastOverviewDetailBtns, btn,
      forecastOverviewDetailIndicator, index
    )
  })
})

forecastOverviewDetailBtns[0].click()