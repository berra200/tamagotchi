const comment = document.querySelector("#pet-comment")


class Pet {
    constructor(name, type) {
        this.name = name
        this.type = type
        this.energy = 50
        this.hunger = 50
        this.social = 50
        this.happy = 50
    }
    
    // Höjer energy med 40
    // Höjer happy med 10
    // Sänker hunger med 10
    // Sänker social med 10
    sleep() {
        if (this.hunger < 10) {
            comment.innerText = "I'm too hungry too sleep"
        }else if (this.social < 10) {
            comment.innerText = "I'm too lonely"
        } else {
            comment.innerText = ""
            this.energy += 40
            this.happy += 10
            this.hunger -= 10
            this.social -= 10
            checkMinMax(this)
            this.renderStats()
        }
    }

    // Sänker happy med 30
    // Sänker hunger med 20
    // Sänker energy med 20
    // Höjer social med 10
    // Energy måste vara Över t.ex 30
    play() {
        if (this.happy < 30) {
            comment.innerText = "I'm too sad"
        } else if (this.hunger < 20) {
            comment.innerText = "I'm too hungry"
        } else if (this.energy < 30) {
            comment.innerText = "I'm too tired too play"
        } else {
            comment.innerText = ""
            this.happy -= 30
            this.hunger -= 20
            this.social += 10
            checkMinMax(this)
            this.renderStats()
        }
    }

    // Ökar hunger med 60
    // Sänker energy med 10
    eat() {
        if (this.energy < 10)  {
            comment.innerText = "I'm too tired to chew"
        } else {
            comment.innerText = ""
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
        li.addEventListener("click", function() {
            const oldActive = document.querySelector(".active")
            if(oldActive !==null){
                oldActive.classList.remove("active")
            }
            this.classList.add("active")
            pet.renderPet()
        })
    })
}

let myPets = []

document.getElementById("create-new").addEventListener("click", () => createPet())


