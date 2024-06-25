const searchInput = document.getElementById('search-term');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results');
const editorContainer = document.getElementById('editor-container');
const canvas = document.getElementById('image-canvas');
const addTextBtn = document.getElementById('add-text');
const addRectangleBtn = document.getElementById('add-rectangle');
const addCircleBtn = document.getElementById('add-circle');
const addTriangleBtn = document.getElementById('add-triangle');
const addPolygonBtn = document.getElementById('add-polygon');
const downloadBtn = document.getElementById('download');

let selectedImage = null;
let fabricCanvas;

let canvasLayers = [];

const apiUrl = 'https://api.unsplash.com/search/photos?query=';
const apiKey = 'IH2KXnH2W2JzgGDo0Ap3ad03yrfU2_SsT-KhS9SivAY'; 

// Function to search for images------------------------->
function searchImages(searchTerm) {
  fetch(`${apiUrl}${searchTerm}&client_id=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      resultsContainer.innerHTML = '';
      data.results.slice(0, 8).forEach(image => {
        const imgContainer = document.createElement('div');
     
        imgContainer.style.border = '2px solid black ';
        imgContainer.style.borderRadius = '6px';
        imgContainer.style.border = '2px solid black ';
        imgContainer.style.display = 'flex';
        imgContainer.style.flexDirection = 'column';
        imgContainer.style.alignItems = 'center';
        imgContainer.style.margin = '10px';
        
        const img = document.createElement('img');
        img.src = image.urls.regular;
        img.style.width = '250px';
        img.style.height = '180px';
        img.crossOrigin = 'Anonymous'; 
        
        const addButton = document.createElement('button');
        addButton.innerText = 'Add Caption';
        addButton.style.marginBottom = "5px";
        addButton.style.border = "0px"
        addButton.style.padding = "6px";
        addButton.style.backgroundColor = "#007FFF";
        addButton.style.color = "white";
        addButton.style.borderRadius = "6px";
        addButton.style.cursor = "pointer";
        addButton.addEventListener('click', () => {
          selectedImage = image;
          displayImage(image);
        });
        
        imgContainer.appendChild(img);
        imgContainer.appendChild(addButton);
        resultsContainer.appendChild(imgContainer);
      });
    })
    .catch(error => {
      console.error(error);
      alert('Error while fetching images');
    });
}

// Function to display selected image on canvas-----------------
function displayImage(image) {
  editorContainer.style.display = 'flex';
  if (!fabricCanvas) {
    fabricCanvas = new fabric.Canvas(canvas);
  }
  fabricCanvas.clear(); // Clear any previous canvas objects-->>>
  canvasLayers = []; // Clear previous layers log------------>

  fabric.Image.fromURL(image.urls.regular, function(img) {
    img.set({
      crossOrigin: 'Anonymous', 
      selectable: false 
    });
    // const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
    const scaleFactor = 500 / img.width;
    img.scale(scaleFactor);
    fabricCanvas.setWidth(500);
    fabricCanvas.setHeight(img.height * scaleFactor);
    fabricCanvas.add(img);
    fabricCanvas.sendToBack(img); 
    fabricCanvas.renderAll();
    logCanvasLayers(); // Log layers
  }, { crossOrigin: 'Anonymous' });

  // Add event listeners for adding shapes and text-----------------------------
  addTextBtn.addEventListener('click', addText);
  addRectangleBtn.addEventListener('click', addRectangle);
  addCircleBtn.addEventListener('click', addCircle);
  addTriangleBtn.addEventListener('click', addTriangle);
  addPolygonBtn.addEventListener('click', addPolygon);
  downloadBtn.addEventListener('click', downloadImage);
}

// Functions to add different objects to the canvas----------------------------
function addText() {
  const text = new fabric.Textbox('Enter your text', {
    left: 100,
    top: 100,
    fill: '#000',
    fontSize: 20,
  });
  fabricCanvas.add(text);
}

function addRectangle() {
  const rect = new fabric.Rect({
    width: 100,
    height: 50,
    left: 100,
    top: 100,
    fill: 'red',
  });
  fabricCanvas.add(rect);
}

function addCircle() {
  const circle = new fabric.Circle({
    radius: 50,
    left: 100,
    top: 100,
    fill: 'blue',
  });
  fabricCanvas.add(circle);
}

function addTriangle() {
  const triangle = new fabric.Triangle({
    width: 100,
    height: 100,
    left: 100,
    top: 100,
    fill: 'green',
  });
  fabricCanvas.add(triangle);
}

function addPolygon() {
 
  const points = [
    { x: 50, y: 0 },  
    { x: 100, y: 35 },
    { x: 80, y: 100 }, 
    { x: 20, y: 100 }, 
    { x: 0, y: 35 },   
  ];
  
  const polygon = new fabric.Polygon(points, {
    left: 100,
    top: 100,
    fill: 'yellow',
  });

  fabricCanvas.add(polygon);
  logCanvasLayers(); // Log layers
}

// Function to download the modified image-------------------------------
function downloadImage() {
  fabricCanvas.discardActiveObject().renderAll(); 

  const dataURL = fabricCanvas.toDataURL({
    format: 'png',
    quality: 1.0
  });

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'modified-image.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value;
  if (searchTerm) {
    searchImages(searchTerm);
  } else {
    alert('Please enter a search term');
  }
});






// Function to log all canvas layers------------------>
function logCanvasLayers() {
  canvasLayers = fabricCanvas.getObjects().map(obj => ({
    type: obj.type,
    left: obj.left,
    top: obj.top,
    width: obj.width ? obj.width * obj.scaleX : undefined,
    height: obj.height ? obj.height * obj.scaleY : undefined,
    radius: obj.radius ? obj.radius * obj.scaleX : undefined,
    points: obj.points,
    fill: obj.fill,
    text: obj.text,
    fontSize: obj.fontSize,
  }));
  console.log('Canvas Layers:', canvasLayers);
}














