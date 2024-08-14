import './styles/main.css'
import {
  navbarBtnActiveAction,
  toggleTempUnit,
  enableDragScroll
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

const container = document.querySelector('.climate-overview-24hr-forecast')
enableDragScroll(container)