const game = document.querySelector('[data-attr="game-container"]')
const startBtn = document.querySelector('button#start')
const scale = +game.getAttribute("data-scale")
document.querySelector(':root').style.setProperty("--scale", scale)

class Food {
    constructor() {
        this.x = Math.floor(Math.random() * scale);
        this.y = Math.floor(Math.random() * scale);
    }
}

class Game {
    positionX = 0
    positionY = 0
    count = 0
    constructor() {
        for (let i = 0; i < scale * scale; i++) {
            const div = document.createElement('div')
            div.className = "game-grid"
            game.appendChild(div)
        }
        this.grids = document.querySelectorAll('.game-grid')
    }

    start() {
        let num = Math.floor(Math.random() * scale ** 2)
        this.positionX = num % scale
        this.positionY = Math.floor(num / scale)
        this.grids[num].classList.add("head")
        document.querySelector('.game-grid.head').style.transform = 'rotateZ(' + this.rotation + 'deg)'
        document.addEventListener('keydown', this.changeDirection)
        this.addFood();
        this.collisionInterval = setInterval(this.checkCollision, 0.1)
        this.moveInterval = setInterval(this.move, 150)
    }

    update = (prevPosX = this.positionX,prevPosY = this.positionY) => {
        this.grids[prevPosY * scale + prevPosX]?.classList.remove("head")
        this.body.push([prevPosX, prevPosY])
        this.grids[this.positionY * scale + this.positionX].style.setProperty('--rotation',this.rotation)
        this.grids[this.positionY * scale + this.positionX]?.classList.add("head")
        this.grids[this.body[0][1] * scale + this.body[0][0]]?.classList.remove("body")
        this.body.shift()
        this.grids[this.body[this.body.length - 1][1] * scale + this.body[this.body.length - 1][0]]?.classList.add("body")
        this.grids.forEach(e => {
            e.style.removeProperty("transform")
        })
        startBtn.innerHTML = "Score: " + this.count
    }

    changeDirection = (e) => {
        if (this.direction !== "down" && e.key === "ArrowUp") {
            this.direction = "up"
            this.rotation = "0deg"
        }
        if (this.direction !== "up" && e.key === "ArrowDown") {
            this.direction = "down"
            this.rotation = "180deg"
        }
        if (this.direction !== "left" && e.key === "ArrowRight") {
            this.direction = "right"
            this.rotation = "90deg"
        }
        if (this.direction !== "right" && e.key === "ArrowLeft") {
            this.direction = "left"
            this.rotation = "270deg"
        }
    }

    move = () => {
        if (this.direction === "up") {
            this.update(this.positionX, this.positionY--)
        }
        else if (this.direction === "down") {
            this.update(this.positionX, (this.positionY++))
        }
        else if (this.direction === "right") {
            this.update(this.positionX++, this.positionY)
        }
        else if (this.direction === "left") {
            this.update(this.positionX--, this.positionY)
        }
    }

    add = (x = this.positionX, y = this.positionY) => {
        this.body.push([x - 1, y - 1])
    }

    addFood = () => {
        document.querySelector(".game-grid.food")?.classList.remove("food")
        let foodGrid;
        do{
            this.food = new Food();
            foodGrid = this.grids[this.food.y * scale + this.food.x]
        }while(foodGrid.classList.contains("head") || foodGrid.classList.contains("body"));
        foodGrid.classList.add("food")
    }

    checkFoodCollison = () => {
        if (this.food.x === this.positionX && this.food.y === this.positionY) {
            this.grids[this.food.y * scale + this.food.x].classList.remove("food")
            this.addFood()
            this.add()
            this.count++
        }
    }

    checkCollision = () => {
        this.checkFoodCollison()
        if(document.querySelector('.game-grid.body.head')!==null){
            gameOver();
            return;
        }
        if(this.direction==="left" && this.body[this.body.length-1][0]===1){
            gameOver();
            return
        }
        if(this.direction==="right" && this.body[this.body.length-1][0]===scale-2){
            gameOver();
            return
        }
        if(this.direction==="up" && this.body[this.body.length-1][1]===1){
            gameOver();
            return
        }
        if(this.direction==="down" && this.body[this.body.length-1][1]===scale-2){
            gameOver();
            return
        }
    }


}
const gamepad = new Game();

gameOver = () => {
    startBtn.innerHTML = 'Game Over'
    setTimeout(() => {
        startBtn.innerHTML = 'Start Game'
    }, 1000);
    document.removeEventListener('keydown', gamepad.changeDirection)
    clearInterval(gamepad.moveInterval)
    clearInterval(gamepad.collisionInterval)
    startBtn.disabled = false
    return
}

startBtn.addEventListener('click', () => {
    gamepad.grids.forEach(e => {
        e.className = 'game-grid'
    })
    gamepad.count = 0
    gamepad.positionX = 0
    gamepad.positionY = 0
    gamepad.direction = null
    gamepad.rotation = "0deg"
    gamepad.body = []
    gamepad.add()
    gamepad.add()
    gamepad.add()
    gamepad.start()
    startBtn.disabled = true;
})