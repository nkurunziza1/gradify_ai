import { v4 as uuidv4 } from "uuid";
import { StableBTreeMap } from "azle";

import express from "express";
import cors from "cors";
import { Distribution, DistributionData } from "./types";

// Storage using Azle's StableBTreeMap
const distributionStore = StableBTreeMap<string, DistributionData>(1);
const studentIndex = StableBTreeMap<string, string>(2); // Registration number to key mapping

const app = express();
app.use(cors());

app.use(express.json());

// Helper function to create a key
function createKey(year: string, level: string): string {
  return `${year}-${level}`;
}

app.get("/distribution", (req, res) => {
  try {
    const allData = distributionStore.values();

    // Extract all distributions from all years/levels
    const allDistributions = allData.map((data) => data.distributions).flat();

    return res.json({
      success: true,
      count: allDistributions.length,
      data: allDistributions,
    });
  } catch (error) {
    console.error("Error retrieving distributions:", error);
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
});

app.post("/distribution", (req, res) => {
  try {
    const { year, level, distributions } = req.body;

    if (!year || !level || !distributions || !Array.isArray(distributions)) {
      return res.status(400).json({
        message:
          "Missing required fields: year, level, and distributions array",
      });
    }

    const key = createKey(year, level);
    const existingData = distributionStore.get(key);

    // Create or update the distribution data
    let distributionData: DistributionData;
    if (existingData) {
      distributionData = existingData;
    } else {
      distributionData = {
        year,
        level,
        distributions: [],
        lastUpdated: new Date(),
      };
    }

    // Process new distributions
    const newDistributions = distributions.map((dist) => {
      const {
        name,
        registrationNumber,
        assignedSchool,
        allocatedCombinations,
        explanation,
        totalMarks,
      } = dist;

      // Validate required fields
      if (!name || !registrationNumber || !assignedSchool) {
        throw new Error(`Invalid distribution data: ${JSON.stringify(dist)}`);
      }

      const newDistribution: Distribution = {
        id: uuidv4(),
        level,
        name,
        registrationNumber,
        assignedSchool,
        allocatedCombinations,
        explanation: explanation || "",
        totalMarks: totalMarks || 0,
        createdAt: new Date(),
      };

      studentIndex.insert(registrationNumber, key);
      return newDistribution;
    });

    distributionData.distributions = [
      ...distributionData.distributions,
      ...newDistributions,
    ];
    distributionData.lastUpdated = new Date();

    distributionStore.insert(key, distributionData);

    return res.status(201).json({
      success: true,
      message: `${newDistributions.length} distribution(s) created successfully`,
      data: newDistributions,
    });
  } catch (error) {
    console.error("Error creating distributions:", error);
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
});

app.get("/distributions/student/:registrationNumber", (req, res) => {
  const filteredDistributions = Array.from(distributionStore.values());
  try {
    const { registrationNumber } = req.params;
    const { year, level } = req.query;

    const normalizedRegNumber = registrationNumber.trim().toUpperCase();

    const filteredDistributions = Array.from(distributionStore.values()).filter(
      (distributionData) => {
        if (year && distributionData.year !== year) return false;
        if (level && distributionData.level !== level) return false;
        return true;
      }
    );

    let matchingStudent: Distribution | null = null;
    let containingDistribution: DistributionData | null = null;

    for (const distributionData of filteredDistributions) {
      const student = distributionData.distributions.find(
        (dist) =>
          dist.registrationNumber.trim().toUpperCase() === normalizedRegNumber
      );

      if (student) {
        matchingStudent = student;
        containingDistribution = distributionData;
        break;
      }
    }

    // If no student found
    if (!matchingStudent) {
      return res.status(404).json({
        success: false,
        message: `No student found with registration number ${registrationNumber}`,
        searchDetails: {
          normalizedRegNumber,
          yearFilter: year,
          levelFilter: level,
          totalFilteredDistributions: filteredDistributions.length,
          totalStudentsSearched: filteredDistributions.reduce(
            (total, data) => total + data.distributions.length,
            0
          ),
        },
      });
    }

    return res.json({
      success: true,
      data: matchingStudent,
      metadata: {
        year: containingDistribution?.year,
        level: containingDistribution?.level,
      },
    });
  } catch (error) {
    console.error("Error searching for student:", error);
    console.log("error data+++++++++++++", filteredDistributions);
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
});

app.get("/distribution/:year/:level", (req, res) => {
  try {
    const { year, level } = req.params;

    const key = createKey(year, level);
    const data = distributionStore.get(key);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: `No distributions found for year ${year} and level ${level}`,
      });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error retrieving distributions:", error);
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
});

app.use(express.static("/dist"));
app.listen();
