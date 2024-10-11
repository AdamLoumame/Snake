let tileSize = 18
let columns = 24
let rows = 24

let canvas = document.querySelector(".canvas")
let context = canvas.getContext("2d")

canvas.width = columns * tileSize
canvas.height = rows * tileSize
// set score that is on the localStorage
if (localStorage.getItem("lastScore")){
    document.querySelector(".localScore").innerHTML = localStorage.getItem("lastScore")
}
// Snake
let snakeBody = []
class Snake{
    constructor(x,y,n = -1,width = tileSize,height = tileSize,speedX = 0,speedY = 0){
        this.x = x
        this.y = y 
        this.width = width
        this.height = height
        this.speedX = speedX
        this.speedY = speedY
        this.LastKey
        this.lastCrod = {
            x : this.x,
            y : this.y,
        }
        this.n = n
    }
    creat(){
        snakeBody.push(this)
    }
    draw(){
        context.fillStyle = "#424245"
        context.fillRect(this.x,this.y,this.width,this.height)

        context.strokeStyle = "#929982"
        context.strokeRect(this.x,this.y,this.width,this.height)
    }
    move(){
        // adding the last cords so its gonna help for the positionnnig of the next part of the snake (CHAIN LOGARITHME)
        this.lastCrod.x = this.x
        this.lastCrod.y = this.y

        // this mouvment works actully just for the head so and by the CHAIN LOGARITHME those mvt get inheretating from part to part  
        if (this.n === 1){
            document.addEventListener("keyup",e =>{ 
                if (e.code === "ArrowRight" && this.LastKey !== "ArrowRight" && this.LastKey !== "ArrowLeft"){
                    head.speedX = 1
                    head.speedY = 0
                }
                if(e.code === "ArrowLeft" && this.LastKey !== "ArrowLeft" && this.LastKey !== "ArrowRight"){
                    head.speedX = -1
                    head.speedY = 0
                }
                if(e.code === "ArrowDown" && this.LastKey !== "ArrowDown" && this.LastKey !== "ArrowUp"){
                    head.speedY = 1
                    head.speedX = 0
                }
                if(e.code === "ArrowUp" && this.LastKey !== "ArrowUp" && this.LastKey !== "ArrowDown"){
                    head.speedY = -1
                    head.speedX = 0
                }
                this.LastKey = e.code    
            })
        }
    }
}
let head = new Snake(3 * tileSize,16 * tileSize,1)
head.creat()

// points
let Point = {
    x : Math.floor(Math.random() * columns) * tileSize,
    y : Math.floor(Math.random() * rows) * tileSize,
    width : tileSize,
    height : tileSize,
}
function Update(){

    context.clearRect(0,0,canvas.width,canvas.height)
    
    // snake
    // adapting the heads first so changin an applaying the CHAIN LOGARITHME
    head.draw()
    head.move()
    head.x += head.speedX * tileSize
    head.y += head.speedY * tileSize

    // other part muovement
    for (let snake of snakeBody){
        //  CHAIN LOGARITHME
        if (snakeBody.indexOf(snake) !== 0){
            snake.draw()
            snake.lastCrod.x = snake.x   // the mouvement works by the mouvement of one is the one of its previus (CHAIN LOGARITHME)
            snake.lastCrod.y = snake.y   // so we set the previus cords as the curr ones so the previus index part can take them  

            snake.x = snakeBody[snakeBody.indexOf(snake) - 1].lastCrod.x  // the part (snake) takes the cords of the prev part of the body 
            snake.y = snakeBody[snakeBody.indexOf(snake) - 1].lastCrod.y
        }
    }
        // snake parts collapse
    for (let part1 of snakeBody){
        for (let part2 of snakeBody){
            if (DetectCollision(part1,part2) && part1 !== part2){
                clearInterval(gameLoop)
                setTimeout(() => {
                    document.querySelector(".lose").style.display = "block"
                    canvas.style.display = "none"
                    document.querySelector(".score").style.display = "none"
                    document.querySelector(".localScore").style.display = "none"
                    document.querySelector(".scoreshower").innerHTML = document.querySelector(".score").innerHTML
                }, 150);
            }
        }
    }
        //  head collapse with the edges
    if (head.x + head.width > canvas.width || head.y + head.height > canvas.height || head.x < 0 || head.y < 0){
        clearInterval(gameLoop)
        setTimeout(() => {
            document.querySelector(".lose").style.display = "block"
            canvas.style.display = "none"
            document.querySelector(".score").style.display = "none"
            document.querySelector(".localScore").style.display = "none"
            document.querySelector(".scoreshower").innerHTML = document.querySelector(".score").innerHTML
        }, 150);
    }
    // points
    context.fillStyle = "#FF4C4C"
    context.fillRect(Point.x,Point.y,Point.width,Point.height)

    context.strokeStyle = "#e19494"
    context.strokeRect(Point.x,Point.y,Point.width,Point.height)
    // eat 
    if (head.x === Point.x && head.y === Point.y){
        randx = Math.floor(Math.random() * columns) * tileSize  
        randy = Math.floor(Math.random() * rows) * tileSize     
        snakeBody.forEach(p => {
            if (randx === p.x && randy === p.y){
                randx = Math.floor(Math.random() * columns) * tileSize  
                randy = Math.floor(Math.random() * rows) * tileSize    
            }
        })
        Point.x = randx  // renetialize x of the point randomly after checking for a position out of the snake
        Point.y = randy  // renetialize y of the point randomly after checking for a position out of the snake
        // new part added
        let part = new Snake()
        part.creat()
        // update Score
        let score = document.querySelector(".score")
        score.innerHTML = Number(score.innerHTML)+100

        if (localStorage.getItem("lastScore") >= Number(score.innerHTML)){
            return
        }else{
            localStorage.setItem("lastScore",Number(score.innerHTML))
        }
    }
}
let gameLoop = setInterval(Update,100) // Game loop

 // arrows Button
document.addEventListener("keydown",e=>{
    if (e.code === "ArrowRight"){
        document.querySelector(".arrows span:nth-of-type(4)").style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)"
        document.querySelector(".arrows span:nth-of-type(4)").style.backgroundColor  = "white"
    }
    if (e.code === "ArrowLeft"){
        document.querySelector(".arrows span:nth-of-type(3)").style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)"
        document.querySelector(".arrows span:nth-of-type(3)").style.backgroundColor  = "white"
    }
    if (e.code === "ArrowUp"){
        document.querySelector(".arrows span:nth-of-type(2)").style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)"
        document.querySelector(".arrows span:nth-of-type(2)").style.backgroundColor  = "white"
    }
    if (e.code === "ArrowDown"){
        document.querySelector(".arrows span:nth-of-type(5)").style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)"
        document.querySelector(".arrows span:nth-of-type(5)").style.backgroundColor  = "white"
    }
    setTimeout(() => {
        document.querySelectorAll(".arrows span").forEach(e => {
            e.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)"
            e.style.backgroundColor  = "#2c2d2f"
        })  
    },100);
}) 
function DetectCollision(rect1,rect2){
    return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y
}
// restart 
document.querySelector(".Restart").addEventListener("click",()=>location.reload())