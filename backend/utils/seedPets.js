const Pet = require("../models/Pet");
const PetList = require("../data/PetList");

async function seedPets() {
  for (const pet of PetList) {
    const existingPet = await Pet.findOne({ name: pet.name });

    if (!existingPet) {
      await Pet.create(pet);
    }
  }

  console.log("Starter pets synced");
}

module.exports = seedPets;
