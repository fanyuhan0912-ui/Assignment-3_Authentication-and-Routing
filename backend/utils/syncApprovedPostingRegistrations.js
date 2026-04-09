const Pet = require("../models/Pet");
const Registration = require("../models/Registration");

async function syncApprovedPostingRegistrations() {
  const registrations = await Registration.find({
    formType: "posting",
    approvalStatus: "Approved",
    $or: [{ petId: null }, { petId: { $exists: false } }],
  }).populate("user", "_id");

  let syncedCount = 0;

  for (const registration of registrations) {
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

    registration.petId = createdPet._id;
    await registration.save();
    syncedCount += 1;
  }

  console.log(`Approved posting registrations synced: ${syncedCount}`);
}

module.exports = syncApprovedPostingRegistrations;
