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
        this.moveInterval = setInterval(this.move, 150)
        this.collisionInterval = setInterval(this.checkCollision, 50)
    }

    update = (prevPosX = this.positionX, posX = this.positionX, prevPosY = this.positionY, posY = this.positionY) => {
        this.grids[prevPosY * scale + prevPosX].classList.remove("head")
        this.body.push([prevPosX, prevPosY])
        this.grids[this.body[0][1] * scale + this.body[0][0]]?.classList.remove("body")
        this.body.shift()
        this.grids[this.body[this.body.length - 1][1] * scale + this.body[this.body.length - 1][0]].classList.add("body")
        this.grids.forEach(e => {
            e.style.removeProperty("transform")
        })
        this.grids[this.positionY * scale + this.positionX].classList.add("head")
        this.grids[posY * scale + posX].style.transform = 'rotateZ(' + this.rotation + 'deg)'
        startBtn.innerHTML = "Score: " + this.count
    }

    changeDirection = (e) => {
        if (this.direction !== "down" && e.key === "ArrowUp") {
            this.direction = "up"
            this.rotation = "0"
        }
        if (this.direction !== "up" && e.key === "ArrowDown") {
            this.direction = "down"
            this.rotation = "180"
        }
        if (this.direction !== "left" && e.key === "ArrowRight") {
            this.direction = "right"
            this.rotation = "90"
        }
        if (this.direction !== "right" && e.key === "ArrowLeft") {
            this.direction = "left"
            this.rotation = "270"
        }
    }

    move = () => {
        if (this.direction === "up") {
            this.update(this.positionX, this.positionX, this.positionY--, this.positionY)
        }
        else if (this.direction === "down") {
            this.update(this.positionX, this.positionX, (this.positionY++), this.positionY)
        }
        else if (this.direction === "right") {
            this.update((this.positionX++), this.positionX, this.positionY, this.positionY)
        }
        else if (this.direction === "left") {
            this.update((this.positionX--), this.positionX, this.positionY, this.positionY)
        }
    }

    add = (x = this.positionX, y = this.positionY) => {
        this.body.push([x - 1, y - 1])
    }

    addFood = () => {
        document.querySelector(".game-grid.food")?.classList.remove("food")
        this.food = new Food();
        const foodGrid = this.grids[this.food.y * scale + this.food.x]
        if (foodGrid.classList.contains("head") || foodGrid.classList.contains("body")) {
            this.addFood()
        } else {
            foodGrid.classList.add("food")
        }
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
        this.body.forEach(e => {
            if (e[0] === this.positionX && e[1] === this.positionY) {
                gameOver()
                return
            }
        })
        if (this.positionX < 0 || this.positionX >= scale || this.positionY < 0 || this.positionY >= scale) {
            gameOver()
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
    clearInterval(gamepad.collisionInterval)
    clearInterval(gamepad.moveInterval)
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
    gamepad.rotation = "0"
    gamepad.body = []
    gamepad.add()
    gamepad.add()
    gamepad.add()
    gamepad.start()
    startBtn.disabled = true;
})