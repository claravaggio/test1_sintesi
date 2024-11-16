let rectX; // Posizione iniziale del rettangolo bianco
let rectY; // Posizione verticale del rettangolo bianco
let rectWidth = 10; // Larghezza del rettangolo bianco
let rectHeight = 50; // Altezza del rettangolo bianco

let greenRectX; // Posizione iniziale del rettangolo verde
let greenRectY; // Posizione verticale del rettangolo verde
let greenRectWidth = 80; // Larghezza del rettangolo verde
let greenRectHeight = rectHeight;
let greenSpeed = -1.5; // Velocità del rettangolo verde verso sinistra
let greenRectVisible = false; // Flag per mostrare il rettangolo verde

let containerX; // Posizione iniziale del contorno
let containerY; // Posizione verticale del contorno
let containerWidth = 800; // Larghezza del contorno (molto più lungo)
let containerHeight = rectHeight;

let counter = 0; // Contatore che funge da tachimetro
let speedIncrease = 0.5; // Velocità di aumento del contatore
let decreaseFactor = 0.1; // Fattore di riduzione del contatore
let spacePressed = false; // Flag per controllare se spacebar è premuto

// Variabili per le auto
let auto1X = 10;
let auto2X = 200;
let auto2Speed = 1.5; // Velocità della seconda auto

let gameOver = false;
let simulationStarted = false; // Controlla se la simulazione è iniziata

function preload() {
  img1 = loadImage("assets/car1.png");
  img2 = loadImage("assets/car2.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Posizioni iniziali calcolate in base al centro dello schermo
  containerX = width / 2 - containerWidth / 2;
  containerY = height / 2 + 50;

  rectX = containerX;
  rectY = containerY;
}

function draw() {
  if (gameOver) {
    //background(0);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(100);
    text("GAME OVER", width / 2, height / 2 - 100);
    return;
  }
  background(0);
  fill(255, 255, 255);
  rect(0, 0, windowWidth, 80);

  fill(255);
  textSize(50);
  textAlign(LEFT);
  text("1", 20, height - 30);

  image(img1, auto1X, 10, img1.width / 8, img1.height / 8);
  image(img2, auto2X, 10, img2.width / 8, img2.height / 8);

  if (simulationStarted) {
    // Movimento automatico dell'auto2 verso destra
    auto2X += auto2Speed;
    // Ferma auto2 quando raggiunge il bordo destro dello schermo
    if (auto2X > width - img2.width / 8) {
      auto2X = width - img2.width / 8;
      auto2Speed = 0; // Ferma auto2
    }
  }

  // Disegno del contorno
  noFill();
  stroke(255);
  rect(containerX, containerY, containerWidth, containerHeight);

  // Aumenta il contatore quando tieni premuto invio
  if (keyIsDown(ENTER)) {
    if (!simulationStarted) {
      simulationStarted = true; // Inizia la simulazione con la prima pressione di ENTER
    }
    counter += speedIncrease;
    counter = constrain(counter, 0, 100); // Limita il contatore a un massimo di 100
    rectX += 2; // Muove il rettangolo bianco verso destra

    // Muovi l'auto1 in base al contatore
    auto1X += map(counter, 0, 100, 0, 5);

    // Limita il rettangolo bianco al bordo destro del contorno
    if (rectX > containerX + containerWidth - rectWidth) {
      rectX = containerX + containerWidth - rectWidth;
    }
  } else {
    // Riduci il contatore quando non tieni premuto invio
    counter -= decreaseFactor;
    counter = max(counter, 0); // Limita il contatore a un minimo di 0

    // Movimento lento verso sinistra quando non si preme enter né spacebar
    if (!spacePressed && rectX > containerX) {
      rectX -= 0.5;
    }

    // Rallenta l'auto1 progressivamente quando il contatore scende
    auto1X += map(counter, 0, 100, 0, 3);
  }

  // Se spacebar è premuto, mostra il rettangolo verde e riduci il contatore più velocemente
  if (keyIsDown(32)) {
    if (!greenRectVisible) {
      // Imposta il rettangolo verde alla posizione attuale del rettangolo bianco
      greenRectX = rectX - greenRectWidth;
      greenRectY = rectY;
      greenRectVisible = true;
    }

    spacePressed = true;
    counter -= decreaseFactor * 3; // Scendi più velocemente
    counter = max(counter, 0); // Limita il contatore a un minimo di 0
    rectX -= 2; // Muove il rettangolo bianco verso sinistra
    auto1X += map(counter, 0, 100, 0, 1);

    // Limita il rettangolo bianco al bordo sinistro del contorno
    if (rectX < containerX) {
      rectX = containerX;
    }
  } else {
    spacePressed = false;
  }

  // Movimento del rettangolo verde
  if (greenRectVisible) {
    greenRectX += greenSpeed;

    // Nascondi il rettangolo verde se esce dal bordo sinistro del contorno
    if (greenRectX + greenRectWidth < containerX || rectX <= containerX) {
      greenRectVisible = false;
    }
  }

  // Disegna il rettangolo verde se visibile
  if (greenRectVisible) {
    fill(130, 255, 134, 255); // Colore verde con trasparenza
    noStroke();
    rect(greenRectX, greenRectY, greenRectWidth, greenRectHeight);
  }

  // Verifica collisione tra auto1 e auto2
  if (auto1X + img1.width / 8 > auto2X) {
    gameOver = true; // Imposta il flag per fermare il gioco
  }

  // Disegna il rettangolo bianco
  fill(255);
  noStroke();
  rect(rectX, rectY, rectWidth, rectHeight);

  // Visualizza il contatore al centro della tela
  if (gameOver == false) {
    textAlign(CENTER, CENTER);
    textSize(100);
    fill(255);
    textFont("aktiv-grotesk");
    textStyle(BOLD);
    text(int(counter), width / 2, height / 2 - 100);
  }
}
