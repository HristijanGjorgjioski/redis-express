const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    // Read data from CSV or JSON file
    const data = fs.readFileSync("large_data.csv", "utf-8");
    const rows = data.split("\n").map((row) => {
      const [email, name] = row.split(",");
      return { email, name };
    });

    // Batch insert using Prisma's createMany
    await prisma.user.createMany({
      data: rows.map((row) => ({
        email: row.email,
        name: row.name,
      })),
      skipDuplicates: true, // Skip duplicates if necessary
    });

    console.log("Data import completed.");
  } catch (error) {
    console.error("Error importing data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Error in main:", err);
  process.exit(1);
});
