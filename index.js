// HTML params
let comment = document.querySelector("#pet-comment")
const inputText = document.getElementById("input-text")
const error = document.getElementById("error-msg")

// Game params
let user

// Api params
const API_BASE = "https://birgell.se/test-api"
const appName = "Tamagotchi"
let listID

class Pet {
    constructor(name, type, energy = 50, hunger = 50, social = 50, happy = 50) {
        this.name = name
        this.type = type
        this.energy = energy
        this.hunger = hunger
        this.social = social
        this.happy = happy
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
        updateItem()
    }

    renderPet() {
        document.getElementById("pet-name").innerText = this.name
        document.getElementById("image").src = `images/${this.type}.gif`
        this.renderStats()
        
        const btnWrapper = document.getElementById("pet-buttons")
        btnWrapper.innerHTML = ""

        let feedBtn = document.createElement("button")
        feedBtn.classList.add("feed-btn", "button")
        feedBtn.innerText = "Mata"
        btnWrapper.append(feedBtn)
        feedBtn.addEventListener("click", () => this.eat())

        let playBtn = document.createElement("button")
        playBtn.classList.add("play-btn", "button")
        playBtn.innerText = "Lek"
        btnWrapper.append(playBtn)
        playBtn.addEventListener("click", () => this.play())

        let sleepBtn = document.createElement("button")
        sleepBtn.classList.add("sleep-btn", "button")
        sleepBtn.innerText = "Sov"
        btnWrapper.append(sleepBtn)
        sleepBtn.addEventListener("click", () => this.sleep())
    }
}

const renderPetList = () => {
    const petList = document.getElementById("pet-list")
    petList.innerHTML = ""
    user.pets.forEach(pet => {
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



// Api functions

// gets or creates new "app list"
const getList = async () => {
    let res = await fetch(`${API_BASE}/listsearch?listname=${appName}`)
    let data = await res.json()

    // If there are no list created in api the create one
    if (data.length === 0) {
        res = await fetch(`${API_BASE}/lists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                listname: appName,
            }),
        })
        data = await res.json()

        // fetch the new list
        res = await fetch(`${API_BASE}/listsearch?listname=${appName}`)
        data = await res.json()
    }

    return data[0]
}


// Search and copy user to local
const searchUser = async (data) => {
    let isFound = false

    // Check data for existing user
    await data.itemList.forEach((obj) => {
        if (obj.user === inputText.value.toLowerCase()){
            user = {
                user: obj.user,
                pets: [],
                _id: obj._id,
            }
            obj.pets.forEach(pet => {
                user.pets.push(new Pet(pet.name, pet.type, pet.energy, pet.hunger, pet.social, pet.happy))
            })
            isFound = true
        }
    })

    // If not found create a new one
    if (!isFound) {
        const res = await fetch(`${API_BASE}/lists/${listID}/items`,
            {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                user: inputText.value.toLowerCase(),
                pets: [],
            }),
            }
        )
        const data = await res.json().then(data => data.list.itemList.at(-1))
        user = {
            user: data.user,
            pets: [],
            _id: data._id,
        }
    }

}

// Update items
const updateItem = () => {
    fetch(`${API_BASE}/lists/${listID}/items/${user._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pets: user.pets
        }),
    })
}



// Game functions

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
    const petType = document.getElementById("type").value
    petName = inputText.value
    if (petName === "") {
        error.innerText = "Du måste skriva ett namn!"
    } else if (petType === "") {
        error.innerText = "Du måste ange djurtyp!"
    } else {
        error.innerText = ""
        user.pets.push(new Pet(petName, petType))
    }

    renderPetList()
}


// Running code

document.getElementById("input-btn").addEventListener("click",async function() {
    if (inputText.value === "") {
        error.innerText = "Du måste fylla i ett användarnamn"
    } else if (user === undefined) {
        data = await getList() // Get list
        listID = data._id // Save list id
        error.innerText = "" // Remove any error message

        // See if user exist and at the same time save localy
        await searchUser(data)
        renderPetList()


        inputText.value = ""
        inputText.placeholder = "Namn på djur"
        this.innerText = "Skapa nytt"

        document.getElementById("pet-type").classList.remove("is-hidden")

    } else {
        createPet()
    }
})