import { Chart, registerables } from 'chart.js'
import {
  navBtns,
  tempContainer,
  tempBtnC,
  tempBtnF,
  cardsContainer,
  dragScrollContainer,
  dragScrollShadowStart,
  dragScrollShadowEnd,
  worldMapNoConnectionOverlay,
  forecastOverviewDetailBtns,
  forecastOverviewDetailIndicator,
  dailyForecastDetailBtns,
  dailyForecastDetailIndicator,
  dailyForecastData
} from './domElements.js';

// Responsiveness

export function applyHeightTransitionOnResize() {
  let previousViewportHeight = window.innerHeight
  
  window.addEventListener('resize', () => {
    const currentViewportHeight = window.innerHeight
    
    if (currentViewportHeight > previousViewportHeight) {
      cardsContainer.style.transition = 'height 0.3s ease'
    } else {
      cardsContainer.style.transition = ''
    }
    
    previousViewportHeight = currentViewportHeight
  })
}

// Navigation Bar

function navbarBtnActiveAction(e) {
  e.preventDefault()
  const btn = e.target.closest('.nav-btns')
  if (!btn) return
  
  const rect = btn.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const ripples = document.createElement('span')
  ripples.style.left = `${x}px`
  ripples.style.top = `${y}px`
  ripples.classList.add('ripple-overlay')
  btn.appendChild(ripples)
  
  setTimeout(() => {
    ripples.remove()
  }, 500)
}

export function enableNavBtnRipples() {
  navBtns.forEach(navBtn => {
    navBtn.addEventListener('click', navbarBtnActiveAction)
  })
}

// Control Center

function toggleTempUnit(tempContainer, currentUnit, selectedUnit) {
  const fahrenheitBtn = tempContainer.querySelector('.fahrenheit')
  const celsiusBtn = tempContainer.querySelector('.celsius')
  const selectedBG = tempContainer.querySelector('.selected-temp-bg')
  let transitionDuration = 250
  
  if (currentUnit === selectedUnit) return currentUnit
  
  if (selectedUnit === 'fahrenheit' && currentUnit !== 'fahrenheit') {
    celsiusBtn.disabled = true
    fahrenheitBtn.disabled = true
    
    fahrenheitBtn.style.opacity = 1
    celsiusBtn.style.opacity = 0.85
    selectedBG.style.transition = `transform ${transitionDuration}ms ease`
    selectedBG.style.transform = 'translateX(100%)'
    setTimeout(() => {
      selectedBG.style.transition = 'none'
      selectedBG.style.transform = 'none'
      selectedBG.style.left = 'auto'
      selectedBG.style.right = 0
      
      celsiusBtn.disabled = false
      fahrenheitBtn.disabled = false
    }, transitionDuration)
    
    return 'fahrenheit'
  } else if (selectedUnit === 'celsius' && currentUnit !== 'celsius') {
    celsiusBtn.disabled = true
    fahrenheitBtn.disabled = true
    
    celsiusBtn.style.opacity = 1
    fahrenheitBtn.style.opacity = 0.85
    selectedBG.style.transition = `transform ${transitionDuration}ms ease`
    selectedBG.style.transform = 'translateX(-100%)'
    
    setTimeout(() => {
      selectedBG.style.transition = 'none'
      selectedBG.style.transform = 'none'
      selectedBG.style.left = 0
      selectedBG.style.right = 'auto'
      
      celsiusBtn.disabled = false
      fahrenheitBtn.disabled = false
    }, transitionDuration)
    
    return 'celsius'
  }
}

export function enableTempUnitToggle() {
  let currentUnit = 'celsius'
  
  tempBtnC.addEventListener('click', () => {  
    currentUnit = toggleTempUnit(tempContainer, currentUnit, 'celsius')
  })
  
  tempBtnF.addEventListener('click', () => {
    currentUnit = toggleTempUnit(tempContainer, currentUnit, 'fahrenheit')
  })
}

// Climate Overview Card

export function enableDragScroll() {
  let isDown = false
  let startX
  let scrollLeft
  
  function updateShadows() {
    const isAtStart = dragScrollContainer.scrollLeft === 0
    const isAtEnd = dragScrollContainer.scrollLeft + dragScrollContainer.clientWidth >= dragScrollContainer.scrollWidth
    
    dragScrollShadowStart.style.opacity = isAtStart ? '0' : '1'
    dragScrollShadowEnd.style.opacity = isAtEnd ? '0' : '1'
  }
  
  dragScrollContainer.addEventListener('mousedown', (e) => {
    isDown = true
    startX = e.pageX - dragScrollContainer.offsetLeft
    scrollLeft = dragScrollContainer.scrollLeft
    dragScrollContainer.style.cursor = 'grabbing'
    updateShadows()
  })
  
  dragScrollContainer.addEventListener('mouseleave', () => {
    isDown = false
    dragScrollContainer.style.cursor = 'grab'
    updateShadows()
  })
  
  dragScrollContainer.addEventListener('mouseup', () => {
    isDown = false
    dragScrollContainer.style.cursor = 'grab'
    updateShadows()
  })
  
  dragScrollContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - dragScrollContainer.offsetLeft
    const walk = (x - startX) * 1  // Scrolling Speed
    dragScrollContainer.scrollLeft = scrollLeft - walk
    updateShadows()
  })
}

// World Map Card

function updateConnectionAlert() {
  fetch('https://www.google.com', { mode: 'no-cors' })
    .then(() => {
      // Show the connection alert
      worldMapNoConnectionOverlay.style.transition = 'opacity 0.5s ease'
      worldMapNoConnectionOverlay.style.opacity = '0'
      setTimeout(() => {  
        worldMapNoConnectionOverlay.style.transition = 'none'
      }, 500)
    })
    .catch(() => {
      // Refresh the map
      worldMapNoConnectionOverlay.style.transition = 'opacity 0.5s ease'
      worldMapNoConnectionOverlay.style.opacity = '1'
      setTimeout(() => {  
          worldMapNoConnectionOverlay.style.transition = 'none'
      }, 500)
    })
}

export function checkInternetConnection() {
  window.addEventListener('load', updateConnectionAlert)
  
  setInterval(updateConnectionAlert, 4000)
  
  window.addEventListener('online', updateConnectionAlert)
  window.addEventListener('offline', updateConnectionAlert)
}

// Forecast Overview Card

let forecastOverviewChart
let forecastOverviewPrevIndex
/// the data points should be fetched from an API later on
let humidityDataPoints = [87, 52, 110, 95, 135, 75, 125, 60, 45, 38, 118, 50]
let UVIndexDataPoints  = [42, 120, 76, 80, 150, 85, 130, 65, 55, 28, 100, 70]
let rainfallDataPoints = [35, 130, 58, 98, 145, 95, 155, 55, 40, 30, 125, 55]
let pressureDataPoints = [65, 90, 82, 70, 115, 100, 140, 75, 60, 20, 110, 68]
function updateOverviewChart(index, label) {
  // Avoid Clicking Already Selected Buttons
  if (forecastOverviewPrevIndex === index) return
  else if (forecastOverviewPrevIndex === undefined) {
    forecastOverviewPrevIndex = 0
  }
  
  forecastOverviewPrevIndex = index
  
  // Setup Canvas
  const ctx = document.getElementById('forecastOverviewChart').getContext('2d')
  Chart.register(...registerables) // Register components (plugins, etc.)
  
  // Get Corresponding Data To Display
  const dataSources = [
    humidityDataPoints,
    UVIndexDataPoints,
    rainfallDataPoints,
    pressureDataPoints,
  ]
  
  const dataPoints = dataSources[index]
  ? [...dataSources[index]] : undefined
  
  
  // Chart Colors
  const backgroundColorGradient =
  ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
  backgroundColorGradient.addColorStop(0, 'rgba(157, 198, 198, 0.85)')
  backgroundColorGradient.addColorStop(0.8, 'rgba(157, 198, 198, 0.1)')
  backgroundColorGradient.addColorStop(1, 'rgba(157, 198, 198, 0)')
  
  const borderColorGradient =
  ctx.createLinearGradient(0, 0, (window.innerWidth - 110) / 1.8, 0)
  borderColorGradient.addColorStop(0, 'rgba(157, 198, 198, 0)')
  borderColorGradient.addColorStop(0.2, 'rgba(157, 198, 198, 1)')
  borderColorGradient.addColorStop(0.8, 'rgba(157, 198, 198, 1)')
  borderColorGradient.addColorStop(1, 'rgba(157, 198, 198, 0)')
  
  const shortMonthNames = [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'
  ]
  
  if (forecastOverviewChart) {
    forecastOverviewChart.data.labels =
      dataPoints.map((_, index) => shortMonthNames[index])
    forecastOverviewChart.data.datasets[0].label = label
    forecastOverviewChart.data.datasets[0].data = dataPoints
    
    forecastOverviewChart.update()
  } else {
    forecastOverviewChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataPoints.map((_, index) => shortMonthNames[index]),
          datasets: [{
              label: label,
              data: dataPoints,
              backgroundColor: backgroundColorGradient,
              borderColor: borderColorGradient,
              borderWidth: 2,
              fill: true,
              tension: 0.4
          }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          tension: {
            duration: 350,
            easing: 'ease',
            from: 0.5,
            to: 0.5,
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            beginAtZero: true
          },
          y: {
            grid: {
              color: 'rgba(65, 65, 75, 0.5)',
            },
            beginAtZero: true,
            ticks: {
              callback: function(value, index, values) {
                return value + '%'
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || ''
                if (label) {
                  label += `: ${context.parsed.y}%`
                }
                return label
              }
            }
          }
        }
      }
    })
  }
}

function forecastOverviewBtnAction(clickedBtn, index) {
  forecastOverviewDetailBtns.forEach(btn => {
    btn.style.color = 'var(--text-light-dark)'
  })
  
  clickedBtn.style.color = 'var(--main-color)'
  const label = clickedBtn.innerText
  
  forecastOverviewDetailIndicator.style.transform =
    `translate(calc(100% * ${index} + 8px * ${index}), -50%)`
  updateOverviewChart(index, label)
}

export function enableForecastOverviewDetailBtnToggle() {
  forecastOverviewDetailBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      forecastOverviewBtnAction(btn, index)
    })
  })
  
  forecastOverviewDetailBtns[0].click()
}

// Daily Forecast Card

let dailyForecastPrevIndex
function updateDailyForecastData(index) {
  // Avoid Clicking Already Selected Buttons
  if (dailyForecastPrevIndex === index) return
  else if (dailyForecastPrevIndex === undefined) {
    dailyForecastPrevIndex = 0
  }
  
  dailyForecastPrevIndex = index

  /// Updating the forecast list
}

function dailyForecastBtnAction(clickedBtn, index) {
  dailyForecastDetailBtns.forEach(btn => {
    btn.style.color = 'var(--text-light-dark)'
  })
  
  clickedBtn.style.color = 'var(--main-color)'
  
  dailyForecastDetailIndicator.style.transform =
    `translate(calc(100% * ${index} + 8px * ${index}), -50%)`
  updateDailyForecastData(index)
}

export function enableDailyForecastDetailBtnToggle() {
  dailyForecastDetailBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      dailyForecastBtnAction(btn, index)
    })
  })
  
  dailyForecastDetailBtns[0].click()
}

export function initializeDomStructure() {
  const today = new Date()
  today.setDate(today.getDate() + 1)

  for (let i = 0; i < 10; i++) {
    const div = document.createElement('div')
    div.classList.add('daily-forecast-item')
    const dateDiv = document.createElement('div')
    dateDiv.classList.add('date-container')

    const currentDayDate = today.getDate()
    const currentMonth = today.toLocaleString('default', { month: 'short' })
    const currentDayName = today.toLocaleString('default', { weekday: 'short' })

    dateDiv.innerHTML = `<span>${currentDayDate}</span> ${currentMonth}, ${currentDayName}`

    div.appendChild(dateDiv)
    dailyForecastData.appendChild(div)

    today.setDate(today.getDate() + 1)
  }
}
