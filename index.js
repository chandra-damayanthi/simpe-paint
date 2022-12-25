const paintBoard = document.querySelector(".paint-board");

class PaintCanvas {
  constructor(parent) {
    this.parent = parent;
    this.isRenderd = false;
    this.canvas = null;
    this.ctx = null;
    this.create();
    this.currentCoords = { x: 0, y: 0 };
    this.lastCoords = { x: 0, y: 0 };

    this.drawable = false;
    this.drawingOption = "pen";
    this.penBtn = null;
    this.eraserBtn = null;
    this.#addEventHandlers();
  }

  create() {
    this.parent.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="paint-container">
        <div class="tools">
          <div class="tools__item  item-active">
              <span class="item__label tool-pen"> Pen </span>

          </div>

        <div class="tools__item">
            <span class="item__label tool-eraser"> Eraser </span>

        </div>
   </div>
     <canvas class="paint-canvas"></canvas>
  



 </div>
      
      
      `
    );

    this.canvas = this.parent.querySelector(".paint-canvas");

    this.ctx = this.canvas.getContext("2d");
    const penElement = this.parent.querySelector(".tool-pen");
    const eraserElement = this.parent.querySelector(".tool-eraser");

    this.pen = {
      element: penElement.parentElement,
      label: penElement,
    };
    this.eraser = {
      element: eraserElement.parentElement,
      label: eraserElement,
    };
  }

  #addEventHandlers() {
    this.pen.element.addEventListener("click", () => {
      this.drawingOption = "pen";
      this.eraser.element.classList.remove("item-active");
      this.pen.element.classList.add("item-active");
    });
    this.eraser.element.addEventListener("click", () => {
      this.drawingOption = "eraser";
      this.eraser.element.classList.add("item-active");
      this.pen.element.classList.remove("item-active");
    });
    this.canvas.addEventListener("mousedown", this.#onClick.bind(this));
    this.canvas.addEventListener("mouseup", this.#onRelease.bind(this));
    this.canvas.addEventListener("mousemove", this.#onMove.bind(this));
  }

  #onClick() {
    this.drawable = true;
  }
  #onRelease() {
    this.drawable = false;
  }
  #onMove(event) {
    const { pageX, pageY, target } = event;
    const { offsetTop, offsetLeft } = target;
    const x = pageX - offsetLeft;
    const y = pageY - offsetTop;
    this.currentCoords = { x, y };
    if (this.drawable) {
      if (this.drawingOption === "pen") this.#drawLine();
      if (this.drawingOption === "eraser") this.#erase();
    }

    this.lastCoords = { x, y };
  }
  #erase() {
    this.ctx.clearRect(this.currentCoords.x, this.currentCoords.y, 5, 5);
  }
  #drawLine() {
    const { x: currentX, y: currentY } = this.currentCoords;
    const { x: lastX, y: lastY } = this.lastCoords;
    this.ctx.beginPath();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "#137554";
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";

    this.ctx.moveTo(lastX, lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}

document
  .querySelector(".paint__tool-bar__new")
  .addEventListener("click", () => {
    const paintCanvas = new PaintCanvas(paintBoard);
    paintCanvas.resize(300, 200);
  });
