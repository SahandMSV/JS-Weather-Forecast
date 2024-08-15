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