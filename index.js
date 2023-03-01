let comment = document.querySelector("#pet-comment")


class Pet {
    constructor(name, type) {
        this.name = name
        this.type = type
        this.energy = 50
        this.hunger = 50
        this.social = 50
        this.happy = 50
    }
    
    sleep() {
        if (this.hunger < 10) {
            negativeComment("I'm too hungry too sleep")
        }else if (this.social < 10) {
            negativeComment("I'm too lonely")
        } else {
            positiveComment(`${this.name} tog en tupplur.`)
            this.energy += 40
            this.happy += 10
            this.hunger -= 10
            this.social -= 10
            checkMinMax(this)
            this.renderStats()
        }
    }

    play() {
        if (this.happy < 30) {
            negativeComment("I'm too sad")
        } else if (this.hunger < 20) {
            negativeComment("I'm too hungry")
        } else if (this.energy < 30) {
            negativeComment("I'm too tired too play")
        } else {
            positiveComment(`Du lekte med ${this.name}.`)
            this.happy += 30
            this.social += 10
            this.hunger -= 20
            this.energy -= 20
            checkMinMax(this)
            this.renderStats()
        }
    }

    eat() {
        if (this.energy < 10)  {
            negativeComment("I'm too tired to chew")
        } else {
            positiveComment(`${this.name} tackar för maten.`)
            this.hunger += 60
            this.energy -= 10
            checkMinMax(this)
            this.renderStats()
        }
    }

    renderStats() {
        document.getElementById("energy").value = this.energy
        document.getElementById("hunger").value = this.hunger
        document.getElementById("social").value = this.social
        document.getElementById("happy").value = this.happy
    }

    renderPet() {
        document.getElementById("pet-name").innerText = this.name
        document.getElementById("image").src = `images/${this.type}.gif`
        this.renderStats()
        
        const btnWrapper = document.getElementById("pet-buttons")
        btnWrapper.innerHTML = ""

        let feedBtn = document.createElement("button")
        feedBtn.classList.add("feed-btn")
        feedBtn.innerText = "Mata"
        btnWrapper.append(feedBtn)
        feedBtn.addEventListener("click", () => this.eat())

        let playBtn = document.createElement("button")
        playBtn.classList.add("play-btn")
        playBtn.innerText = "Lek"
        btnWrapper.append(playBtn)
        playBtn.addEventListener("click", () => this.play())

        let sleepBtn = document.createElement("button")
        sleepBtn.classList.add("sleep-btn")
        sleepBtn.innerText = "Sov"
        btnWrapper.append(sleepBtn)
        sleepBtn.addEventListener("click", () => this.sleep())
    }
}

function negativeComment(str) {
    comment.style.color = "red"
    comment.innerText = str
}

function positiveComment(str) {
    comment.style.color = "black"
    comment.innerText = str
}


function checkMinMax(obj) {
    obj.energy < 0 && (obj.energy = 0)
    obj.happy < 0 && (obj.happy = 0)
    obj.hunger < 0 && (obj.hunger = 0)
    obj.social < 0 && (obj.social = 0)
    obj.energy > 100 && (obj.energy = 100)
    obj.happy > 100 && (obj.happy = 100)
    obj.hunger > 100 && (obj.hunger = 100)
    obj.social > 100 && (obj.social = 100)
}

function createPet() {
    const error = document.getElementById("error-msg")
    const petList = document.getElementById("pet-list")
    const petName = document.getElementById("name").value
    const petType = document.getElementById("type").value
    if (petName === "") {
        error.innerText = "Du måste skriva ett namn!"
    } else if (petType === "") {
        error.innerText = "Du måste ange djurtyp!"
    } else {
        error.innerText = ""
        myPets.push(new Pet(petName, petType))
    }

    petList.innerHTML = ""
    myPets.forEach(pet => {
        let li = document.createElement("li")
        li.innerText = pet.name
        petList.append(li)
        
        document.querySelectorAll(".active").forEach(node => {node.classList.remove("active")})
        li.classList.add("active")
        pet.renderPet()

        li.addEventListener("click", function() {
            document.querySelectorAll(".active").forEach(node => {node.classList.remove("active")})
            this.classList.add("active")
            pet.renderPet()
        })
    })
}

let myPets = []

document.getElementById("create-new").addEventListener("click", () => createPet())


