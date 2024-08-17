import { Chart, registerables } from 'chart.js'

export function navbarBtnActiveAction(e) {
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

// Control Center

export function toggleTempUnit(tempContainer, currentUnit, selectedUnit) {
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

// Climate Overview Card

export function enableDragScroll(container, shadowStart, shadowEnd) {
  let isDown = false
  let startX
  let scrollLeft
  
  function updateShadows() {
    const isAtStart = container.scrollLeft === 0
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth
    
    shadowStart.style.opacity = isAtStart ? '0' : '1'
    shadowEnd.style.opacity = isAtEnd ? '0' : '1'
  }
  
  container.addEventListener('mousedown', (e) => {
    isDown = true
    startX = e.pageX - container.offsetLeft
    scrollLeft = container.scrollLeft
    container.style.cursor = 'grabbing'
    updateShadows()
  })
  
  container.addEventListener('mouseleave', () => {
    isDown = false
    container.style.cursor = 'grab'
    updateShadows()
  })
  
  container.addEventListener('mouseup', () => {
    isDown = false
    container.style.cursor = 'grab'
    updateShadows()
  })
  
  container.addEventListener('mousemove', (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 1  // Scrolling Speed
    container.scrollLeft = scrollLeft - walk
    updateShadows()
  })
}

// Forecast Overview Card

export function toggleOverviewGraph(allBtns, clickedBtn, indicator, index) {
  allBtns.forEach(btn => {
    btn.style.color = 'var(--text-light-dark)'
  })
  
  clickedBtn.style.color = 'var(--main-color)'
  const label = clickedBtn.innerText
  
  indicator.style.transform =
    `translate(calc(100% * ${index} + 8px * ${index}), -50%)`
  
  updateOverviewGraph(index, label)
}

let chart
let humidityDataPoints = [87, 52, 110, 95, 135, 75, 125, 60, 45, 38, 118, 50]
let UVIndexDataPoints  = [42, 120, 76, 80, 150, 85, 130, 65, 55, 28, 100, 70]
let rainfallDataPoints = [35, 130, 58, 98, 145, 95, 155, 55, 40, 30, 125, 55]
let pressureDataPoints = [65, 90, 82, 70, 115, 100, 140, 75, 60, 20, 110, 68]
function updateOverviewGraph(index, label) {  
  const ctx = document.getElementById('forecastOverviewChart').getContext('2d')
  Chart.register(...registerables)
  
  if (chart) {
    chart.destroy()
  }
  
  let dataPoints
  switch (index) {
    case 0:
      if (humidityDataPoints) {
        dataPoints = humidityDataPoints
      }
      break
    
    case 1:
      if (UVIndexDataPoints) {
        dataPoints = UVIndexDataPoints
      }
      break
    
    case 2:
      if (rainfallDataPoints) {
        dataPoints = rainfallDataPoints
      }
      break
    
    case 3:
      if (pressureDataPoints) {
        dataPoints = pressureDataPoints
      }
      break
    
    default:
      console.log('Failed To Fetch Data Points')
      break
  }
  
  const backgroundColorGradient =
  ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
  backgroundColorGradient.addColorStop(0, 'rgba(157, 198, 198, 0.85)')
  backgroundColorGradient.addColorStop(0.8, 'rgba(157, 198, 198, 0.1)')
  backgroundColorGradient.addColorStop(1, 'rgba(157, 198, 198, 0)')
  const borderColorGradient =
    ctx.createLinearGradient(0, 0, window.innerWidth / 2 + 165, 0)
  borderColorGradient.addColorStop(0, 'rgba(157, 198, 198, 0)')
  borderColorGradient.addColorStop(0.2, 'rgba(157, 198, 198, 1)')
  borderColorGradient.addColorStop(0.8, 'rgba(157, 198, 198, 1)')
  borderColorGradient.addColorStop(1, 'rgba(157, 198, 198, 0)')
  
  const shortMonthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataPoints.map((_, index) => shortMonthNames[index]),
      datasets: [{
        label: label,
        data: dataPoints,
        borderColor: borderColorGradient,
        backgroundColor: backgroundColorGradient,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      animation: {
        tension: {
          duration: 500,
          easing: 'ease',
          from: 0.8,
          to: 0.4,
          loop: false
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
            color: 'rgba(65, 65, 75, 0.5)'
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
              let label = context.dataset.label || '';
              if (label) {
                label += `: ${context.parsed.y}%`;
              }
              return label;
            }
          }
        }
      }
    }
  })
}