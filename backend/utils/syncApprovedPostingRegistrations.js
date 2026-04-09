// Sync approved pet posting registrations into the Pet collection
// If an approved posting form has not yet created a pet entry, this function creates one
const Pet = require("../models/Pet");
const Registration = require("../models/Registration");

// Creates pet documents from approved posting registrations
// and links the created pet back to the original registration
async function syncApprovedPostingRegistrations() {
  // Find approved posting forms that do not yet have a linked pet record
  const registrations = await Registration.find({
    formType: "posting",
    approvalStatus: "Approved",
    $or: [{ petId: null }, { petId: { $exists: false } }],
  }).populate("user", "_id");

  let syncedCount = 0;

  for (const registration of registrations) {
    // Create a new pet document using data from the approved registration form
    const createdPet = await Pet.create({
      name: registration.petName,
      category: registration.petType || "Unknown",
      age: registration.petAge || "Unknown",
      breed: registration.petBreed || "",
      vaccinated:
        typeof registration.vaccinated === "string"
          ? registration.vaccinated.trim().toLowerCase() === "yes"
          : Boolean(registration.vaccinated),
      description:
        registration.note || "Pet posting approved from registration form.",
      phoneNumber: registration.phoneNumber || "",
      image: registration.petImage?.dataUrl || "",
      createdBy: registration.user?._id || null,
      status: "Available",
    });

    // Save the generated pet id back to the registration document
    registration.petId = createdPet._id;
    await registration.save();
    syncedCount += 1;
  }

  console.log(`Approved posting registrations synced: ${syncedCount}`);
}

module.exports = syncApprovedPostingRegistrations;
