import { PrismaClient, Body } from "@prisma/client";

const prisma = new PrismaClient();

const muscleGroups = [
  // Upper Body - Anterior
  {
    name: "Pectoralis Major",
    body: Body.UPPER,
    description:
      "Primary chest muscle responsible for arm adduction, flexion, and internal rotation",
  },
  {
    name: "Pectoralis Minor",
    body: Body.UPPER,
    description:
      "Deep chest muscle that aids in shoulder protraction and depression",
  },
  {
    name: "Anterior Deltoid",
    body: Body.UPPER,
    description:
      "Front shoulder muscle responsible for arm flexion and internal rotation",
  },
  {
    name: "Biceps Brachii",
    body: Body.UPPER,
    description:
      "Upper arm muscle that flexes the elbow and supinates the forearm",
  },

  // Upper Body - Posterior
  {
    name: "Latissimus Dorsi",
    body: Body.UPPER,
    description:
      "Large back muscle responsible for arm extension, adduction, and internal rotation",
  },
  {
    name: "Trapezius",
    body: Body.UPPER,
    description:
      "Upper back muscle that moves the shoulder blade and supports the arm",
  },
  {
    name: "Posterior Deltoid",
    body: Body.UPPER,
    description:
      "Rear shoulder muscle responsible for arm extension and external rotation",
  },
  {
    name: "Triceps Brachii",
    body: Body.UPPER,
    description: "Upper arm muscle that extends the elbow",
  },
  {
    name: "Rhomboids",
    body: Body.UPPER,
    description: "Upper back muscles that retract the shoulder blades",
  },

  // Core
  {
    name: "Rectus Abdominis",
    body: Body.CORE,
    description: "Front abdominal muscle responsible for trunk flexion",
  },
  {
    name: "Obliques",
    body: Body.CORE,
    description:
      "Side abdominal muscles responsible for rotation and lateral flexion",
  },
  {
    name: "Transverse Abdominis",
    body: Body.CORE,
    description:
      "Deep core muscle that stabilizes the spine and compresses the abdomen",
  },
  {
    name: "Erector Spinae",
    body: Body.CORE,
    description: "Back muscles responsible for spine extension and posture",
  },

  // Lower Body - Anterior
  {
    name: "Quadriceps",
    body: Body.LOWER,
    description:
      "Front thigh muscles responsible for knee extension and hip flexion",
  },
  {
    name: "Hip Flexors",
    body: Body.LOWER,
    description: "Muscle group that flexes the hip and stabilizes the spine",
  },
  {
    name: "Tibialis Anterior",
    body: Body.LOWER,
    description: "Front shin muscle responsible for dorsiflexion of the foot",
  },

  // Lower Body - Posterior
  {
    name: "Gluteus Maximus",
    body: Body.LOWER,
    description:
      "Large hip muscle responsible for hip extension and external rotation",
  },
  {
    name: "Hamstrings",
    body: Body.LOWER,
    description:
      "Rear thigh muscles responsible for knee flexion and hip extension",
  },
  {
    name: "Gastrocnemius",
    body: Body.LOWER,
    description: "Main calf muscle responsible for plantar flexion of the foot",
  },
  {
    name: "Soleus",
    body: Body.LOWER,
    description: "Deep calf muscle responsible for plantar flexion of the foot",
  },
];

async function main() {
  console.log("Starting to seed muscle groups...");

  for (const muscleGroup of muscleGroups) {
    const result = await prisma.muscleGroup.create({
      data: {
        name: muscleGroup.name,
        body: muscleGroup.body,
        description: muscleGroup.description,
      },
    });
    console.log(`Created muscle group: ${result.name}`);
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error("Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
