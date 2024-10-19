//! api loading 
let allPets = [];
const loadAllPetsCategories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
        .catch(error => console.log(error))
}
const loadAllPets = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/pets')
        .then(res => res.json())
        .then(data => {
            allPets = data.pets;
            displayAllPets(allPets)
        })
        .catch(error => console.log(error))
}
const loadDetails = (petId) => {
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
        .then(res => res.json())
        .then(data => modalWindow(data.petData))
}

const displayCategory = (category) => {
    fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
        .then(res => res.json())
        .then(data => {
            removeActive()
            const activeBtn = document.getElementById(`Btn-${category}`)
            activeBtn.classList.add('bg-teal-100')
            activeBtn.classList.add("border-teal-600")
            displayAllPets(data.data)
        })
        .catch(error => console.log(error))
}

const removeActive = () => {
    const custom = document.getElementsByClassName('custom');
    for (let cus of custom) {
        cus.classList.remove('bg-teal-100')
        cus.classList.remove('border-teal-600')

    }
}
//! display data 
const sortBy = (pets) => {
    return pets.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceB - priceA;
    })
};

document.getElementById('sortbyPrice').addEventListener('click', () => {
    const sorted = sortBy([...allPets]);
    displayAllPets(sorted);
})

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('buttonsContainer')
    categories.forEach(category => {
        const newCategory = document.createElement('div')
        newCategory.innerHTML =
            `
            <div id="Btn-${category.category}" onclick="timeout('${category.category}')" class="custom btn border bg-transparent w-full flex flex-col md:flex-row justify-center h-fit gap-2">
            <img class="py-2" src="${category.category_icon}" />
           <p class="font-bold text-xl">${category.category}</p>
            </div>
        `
        categoryContainer.appendChild(newCategory)
    })
}

const categoryActive = () => {
    const categoryBtn = document.getElementById(`categoryBtn-${category.category}`)
    console.log(categoryBtn);
}

const timeout = (categoryName) => {
    const spinner = document.getElementById('spinner')
    const petsContainer = document.getElementById('petsContainer');
    spinner.classList.remove('hidden')
    petsContainer.innerHTML = ' ';
    setTimeout(() => {
        displayCategory(categoryName)
        spinner.classList.add('hidden')

    }, 2000)
}

const displayAllPets = (pets) => {
    const petsContainer = document.getElementById('petsContainer')
    petsContainer.innerHTML = "";
    if (pets?.length == 0) {
        petsContainer.classList.remove('grid')
        petsContainer.innerHTML = `
        <div class="bg-gray-100 rounded-2xl flex flex-col justify-center py-28 px-5 items-center">
        <div class="">
            <img src="./images/error.webp" alt="">
        </div>
        <div class="text-center">
            <p class="font-extrabold text-4xl my-5">No Information Available</p>
            <p class="text-gray-500 font-semibold">There are no information for this section , it seems like all pets have been sold or flied <br> stay with us , we will refill our pets within 365 working days</p>
        </div>
    </div>

        `
        return;
    }
    petsContainer.classList.add('grid')
    pets.forEach(pet => {
        const newPet = document.createElement('div')
        newPet.classList = "border w-auto rounded-xl p-5 relative"
        newPet.innerHTML =
            `
                            <div class=" border rounded-xl">
                                <img class="object-cover w-full h-full rounded-xl" src="${pet.image}"/>
                            </div>
                            <div class="my-5 space-y-2 text-gray-500 font-bold text-lg">
                                <p class="font-extrabold text-3xl text-black">${pet.pet_name ? pet.pet_name : "Not Available"}</p>
                                <p><span><i class="fa-solid fa-qrcode"></i> Breed: </span>${pet.breed ? pet.breed : " Not Available"}</p>
                                <p><span><i class="fa-regular fa-calendar"></i> Birth: </span>${pet.date_of_birth ? pet.date_of_birth : "Not Available"}</p>
                                <p><span><i class="fa-solid fa-mercury"></i> Gender: </span>${pet.gender ? pet.gender : "Not available"}</p>
                                <p><span><i class="fa-solid fa-dollar-sign"></i> Price: </span>${pet.price ? pet.price : "____"}$</p>
                            </div>
                            <hr>
                            <div class="grid grid-cols-3 gap-3 mt-5">
                                <div onclick="likeDisplay('${pet.image}')" class="btn"><i class="fa-regular fa-thumbs-up text-2xl"></i></div>
                                <div id="adopt-${pet.pet_name}" onclick="adoptPet('${pet.pet_name}')" class="btn text-teal-600 text-lg">Adopt</div>
                                <div onclick="loadDetails('${pet.petId}')" class="btn text-teal-600 text-lg ">Details</div>
                            </div>
        `
        petsContainer.appendChild(newPet);
    });
}


const adoptPet = (pet) => {
    const adopt = document.getElementById(`adopt-${pet}`);
    console.log(pet);

    let countDown = 3;
const countInterval = setInterval(() => {
    if(countDown > 0){
        adopt.innerHTML = `
        <p>${countDown}</p>
        <p class="text-lg">Adopting.....</p>
        `;
        adopt.classList = " btn text-teal-600 text-lg h-full w-full text-[150px] absolute top-[0%] left-[0%]"
        countDown--;
    }
    else{
        adopt.classList = "btn text-teal-600 text-lg"
        clearInterval(countInterval);
        adopt.innerText = 'Adopted';
        adopt.setAttribute('disabled' , true)
    }
},1000)
}

const likeDisplay = (image) => {
    const likeContainer = document.getElementById('likeContainer');
    const newImage = document.createElement('div')
    newImage.innerHTML =
        `
                        <div class="h-32 border rounded-xl overflow-hidden">
                            <img class="w-full h-full object-cover" src="${image}" alt=""></div>
    `
    likeContainer.appendChild(newImage)
}

const modalWindow = (pets) => {
    const modalContainer = document.getElementById("modalContainer")
    const { pet_name: name, breed, date_of_birth: date, price, image, gender, pet_details: details, vaccinated_status: status, } = pets
    modalContainer.innerHTML =
        `
<div class="w-full h-64 border rounded-xl overflow-hidden">
                    <img class="object-cover h-full w-full" src="${image}" alt="">
                </div>
                <div class="">
                    <p class="font-bold text-2xl mb-3">${name}</p>
                    <div class="grid grid-cols-2 text-gray-400">
                        <p><span><i class="fa-solid fa-qrcode"></i> Breed: </span>${breed ? breed : "Not available"}</p>
                        <p><span><i class="fa-regular fa-calendar"></i> Birth: </span>${date ? date : "Not available"}</p>
                        <p><span><i class="fa-solid fa-mercury"></i> Gender: </span>${gender ? gender : "Not available"}</p>
                        <p><span><i class="fa-solid fa-dollar-sign"></i> Price: </span>${price ? price : "____"}$</p>
                        <p><span><i class="fa-solid fa-dollar-sign"></i> Vaccinated status : </span>${status ? status : "Not available"}</p>
                    </div>
                </div>
                <hr>
                <div class="">
                    <p class="text-xl font-bold mb-4">Details Information</p>
                    <p class="text-gray-400">${details}</p>
                </div>


                <div class="modal-action">
                    <form method="dialog" class="w-full">
                        <button
                            class="btn w-full bg-teal-50 border-teal-600 text-teal-600 font-bold text-xl">Cancel</button>
                    </form>
                </div>
    `
    document.getElementById('modalWindow').showModal()
}









loadAllPetsCategories()

loadAllPets()