const fileInput = document.querySelector('[fileInput]')
const imageOutputWrapper = document.querySelector('[imageOutputWrapper]')
const userControlsWrapper = document.querySelector('[userControls]')
const xAxisDensity = document.querySelector('[xAxisDensity]')
const circleSize = document.querySelector('[circleSize]')
const gapSize = document.querySelector('[gapSize]')
const resetButtonTrigger = document.querySelector('[resetTrigger]')
const showHideNodes = document.querySelectorAll('[showHide]')
const outputHandle = document.querySelector('[output]')

const calculateLines = (imageDimension, rowOutput) => {
    const numberOfLines = rowOutput - 1
    const equalDimension =  imageDimension / rowOutput
    
    const output = []
    let lastDimensionAdded = 0
    
    for (let index = 0; index < numberOfLines; index++) {
        lastDimensionAdded += equalDimension
        
        output.push(lastDimensionAdded)
    }
    return output
}

const toggleShowHide = nodes => {
    nodes.forEach(node => node.classList.toggle('hide'))
}

const maxOutputImageRatio = () => {
    const controlWrapperHeight= userControlsWrapper.offsetHeight
    const height = window.innerHeight - controlWrapperHeight 
    const calcPercentage = (100 / height) * (height - controlWrapperHeight)
    outputHandle.style.height = `${calcPercentage}vh`
}
maxOutputImageRatio()

const fileInputChanged = event => {
    if (!event.target.files.length) return 
    
    const url = URL.createObjectURL(event.target.files[0]);

    toggleShowHide(showHideNodes)
    
    const uploadedImg = new Image();
    uploadedImg.src = url;
    uploadedImg.onload =  newImg => {

        const {width, height} = newImg.path[0] 
    
        const outputWidth = xAxisDensity.value
        
        const rowOutputWidth = Math.floor(width / outputWidth)
        const outputHeight = Math.floor(height / rowOutputWidth)
  
        const lineXArray = calculateLines(height, outputHeight);
        const lineYArray = calculateLines(width, outputWidth);
      
        const imageToSlices = window.imageToSlices;
    
        imageToSlices(url, lineXArray, lineYArray, {saveToDataUrl: true}, createImageOutputs);
    }; 

}

const createImageOutputs = dataUrlList => {
    const colorThief = new ColorThief();
    imageOutputWrapper.classList.toggle('visibility')
    
    dataUrlList.forEach((dataUrl, index) => {
        
        const newImgElement = new Image();
        newImgElement.src = dataUrl.dataURI
        newImgElement.onload =  () => {          
            const imageColors = colorThief.getColor(newImgElement)

            const red = imageColors[0]
            const green = imageColors[1]
            const blue = imageColors[2]
    
            const newSVG = `<svg enable-background="new 0 0 325.4 325.4" style="height:2rem;width:2rem;" version="1.1" viewBox="0 0 325.4 325.4" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
            <circle cx="162.7" cy="162.7" r="162.7" style="fill:rgb(${red}, ${green}, ${blue})"/>
            </svg>`

            imageOutputWrapper.insertAdjacentHTML('beforeend', newSVG)

            if (index === dataUrlList.length - 1) {
                imageOutputWrapper.classList.toggle('visibility')   
                
            }
        }
    });
    if (imageOutputWrapper.classList.contains('hide')) {
        imageOutputWrapper.classList.toggle('hide')
    }  
}

const setCircleSize = input => {
    const defaultValue = 30
    const value = input ? input.target.value : defaultValue
    const allSVGs = imageOutputWrapper.querySelectorAll('svg')

    allSVGs.forEach(svg => {
        svg.style.width = `${value}px`
        svg.style.height = `${value}px`
    })
    circleSize.value = value
}

const setGapSize = input => {
    const defaultValue = .5
    const value = input ? input.target.value : defaultValue
    imageOutputWrapper.style.gap = `${value}rem`
    gapSize.value = value
}

const setGridTemplateColumns = input => {
    const defaultValue = 12
    const value = input ? input.target.value : defaultValue
    imageOutputWrapper.style.gridTemplateColumns = `repeat(${value}, 1fr)`
    xAxisDensity.value = value
}

const resetProcess = () => {
    toggleShowHide(showHideNodes)
    fileInput.value = ""
    imageOutputWrapper.innerHTML = ""
    setGridTemplateColumns()
    setGapSize()
    imageOutputWrapper.classList.toggle('hide')  
}


fileInput.addEventListener('change', fileInputChanged)
circleSize.addEventListener('change', setCircleSize)
gapSize.addEventListener('change', setGapSize)
xAxisDensity.addEventListener('change', setGridTemplateColumns)
resetButtonTrigger.addEventListener('click', resetProcess)
