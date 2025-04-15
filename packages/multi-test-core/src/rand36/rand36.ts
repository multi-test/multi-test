/**
 * Implementation of the RAND 36-Item Health Survey (SF-36) scoring algorithm.
 * This module provides functions to calculate scale scores from raw survey responses.
 * 
 * The survey measures eight health concepts: physical functioning, role limitations
 * due to physical health problems, bodily pain, general health, vitality, social functioning,
 * role limitations due to emotional problems, and mental health.
 *
 * @see {@link https://www.rand.org/health-care/surveys_tools/mos/36-item-short-form/scoring.html} for official documentation
 */
import combineReducers from "../util/combineReducers";
import {createBlankScales, IRAND36Scales} from "./scales";

// Merged data structure for item groups, their indices, and recoding rules
const itemGroups = [
    { 
        indices: [1, 2, 20, 22, 34, 36],
        recode: {1: 100, 2: 75, 3: 50, 4: 25, 5: 0}
    },
    {
        indices: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        recode: {1: 0, 2: 50, 3: 100}
    },
    {
        indices: [13, 14, 15, 16, 17, 18, 19],
        recode: {1: 0, 2: 100}
    },
    {
        indices: [21, 23, 26, 27, 30],
        recode: {1: 100, 2: 80, 3: 60, 4: 40, 5: 20, 6: 0}
    },
    {
        indices: [24, 25, 28, 29, 31],
        recode: {1: 0, 2: 20, 3: 40, 4: 60, 5: 80, 6: 100}
    },
    {
        indices: [32, 33, 35],
        recode: {1: 0, 2: 25, 3: 50, 4: 75, 5: 100}
    }
];

// Precalculated lookup map of item index -> recode rules
const itemRecodeMap = new Map<number, Record<number, number>>();

// Initialize the lookup maps
itemGroups.forEach(group => {
    group.indices.forEach(index => {
        itemRecodeMap.set(index, group.recode);
    });
});

// Define items for each scale for averaging
const scaleItems = {
    "PF": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    "RP": [13, 14, 15, 16],
    "RE": [17, 18, 19],
    "VT": [23, 27, 29, 31],
    "MH": [24, 25, 26, 28, 30],
    "SF": [20, 32],
    "BP": [21, 22],
    "GH": [1, 33, 34, 35, 36]
};

/**
 * Normative data from the Medical Outcomes Study (N=2471)
 * "scale": [items, alpha, mean, sd]
 */
const stats = {
  "PF": [10, 0.93, 70.61, 27.42],
  "RP": [4, 0.84, 52.97, 40.78],
  "RE": [3, 0.83, 65.78, 40.71],
  "VT": [4, 0.86, 52.15, 22.39],
  "MH": [5, 0.90, 70.38, 21.97],
  "SF": [2, 0.85, 78.77, 25.43],
  "BP": [2, 0.78, 70.77, 25.46],
  "GH": [5, 0.78, 56.99, 21.11],
};

// Generate recoding reducers using the itemRecodeMap
const recodedValuesReducer = combineReducers<Record<number, number>>(
    // Create a reducer for each item in the recoding map
    Array.from(itemRecodeMap.entries()).map(([itemIndex, recodeRules]) => 
        (recodedValues, rawValue, index) => {
            // combineReducers already adds 1 to the index, so we don't need to do it here
            if (index === itemIndex) {
                const numericValue = Number(rawValue);
                // Apply recoding according to the item's recode rules
                if (!isNaN(numericValue) && recodeRules[numericValue] !== undefined) {
                    recodedValues[itemIndex] = recodeRules[numericValue];
                }
            }
            return recodedValues;
        }
    )
);

// Calculate scale averages based on recoded values
const calculateScales = (recodedValues: Record<number, number>): IRAND36Scales => {
    const scales = createBlankScales(0);
    
    // Calculate average for each scale based on its items
    Object.entries(scaleItems).forEach(([scale, items]) => {
        let sum = 0;
        let count = 0;
        
        // Sum all recoded values for this scale's items
        items.forEach(item => {
            if (recodedValues[item] !== undefined) {
                sum += recodedValues[item];
                count++;
            }
        });
        
        // Set scale value to the average (0-100 range)
        // Only calculate average when we have at least one valid value
        scales[scale as keyof IRAND36Scales] = count > 0 ? sum / count : NaN;
    });
    
    return scales;
};

// Calculate recoded values and scale scores
const calculate = (answers: any[]): IRAND36Scales => {
    // First create an object to hold recoded values
    const recodedValues = answers.reduce(recodedValuesReducer, {});
    
    // Then calculate scale scores by averaging
    return calculateScales(recodedValues);
};

// Validate that answers are correct length and contain valid values for each item
const validateAnswers = (answers: any[]): IRAND36Scales | undefined => {
    // Check if answers exists and has the correct length
    if (!answers || answers.length !== 36) {
        return createBlankScales(NaN);
    }
    
    // Check each answer against its allowable values using the precalculated map
    for (let i = 0; i < answers.length; i++) {
        const itemIndex = i + 1; // 1-based item index
        const answer = answers[i];
        
        // Skip undefined/null values (missing answers)
        if (answer === undefined || answer === null) {
            continue;
        }
        
        const numericValue = Number(answer);
        
        // Get recode rules for this item - if the item's value exists
        // in the recode rules, it's valid
        const recodeRules = itemRecodeMap.get(itemIndex);
        
        // If this item has no defined recode rules or the answer is not valid, validation fails
        if (!recodeRules || recodeRules[numericValue] === undefined) {
            return createBlankScales(NaN);
        }
    }
    
    // All items passed validation, return undefined to continue to calculate
    return undefined;
};

/**
 * Convert a raw scale score to a Z-score using the Medical Outcomes Study norms
 * Z-score = (raw score - population mean) / population standard deviation
 */
function zScore([scale, value]: [string, number]): [string, number] {
  if (isNaN(value) || !stats[scale]) {
    return [scale, NaN];
  }
  const mean = stats[scale][2];
  const sd = stats[scale][3];
  return [scale, (value - mean) / sd];
}

/**
 * Convert a raw scale score to a T-score using the Medical Outcomes Study norms
 * T-score = 50 + (10 * Z-score)
 */
function tScore([scale, value]: [string, number]): [string, number] {
  if (isNaN(value) || !stats[scale]) {
    return [scale, NaN];
  }
  const mean = stats[scale][2];
  const sd = stats[scale][3];
  const z = (value - mean) / sd;
  return [scale, 50 + (10 * z)];
}

/**
 * Calculate the RAND 36-Item Health Survey (SF-36) scale scores from raw survey responses.
 * 
 * @param answers - An array of survey responses (1-5 scale)
 * @returns An object containing the calculated scale scores
 */
export function rand36(answers: any[]): IRAND36Scales {
    return validateAnswers(answers) || calculate(answers);
} 

/**
 * Calculate the Z-scores for the RAND 36-Item Health Survey (SF-36) scale scores.
 *
 * @param scales - An object containing the calculated raw scale scores
 * @returns An object containing the calculated Z-scores
 */
export function rand36ZScores(scales: IRAND36Scales): IRAND36Scales {
    return Object.fromEntries(
        Object.entries(scales).map(zScore),
    ) as unknown as IRAND36Scales;
}

/**
 * Calculate the T-scores for the RAND 36-Item Health Survey (SF-36) scale scores.
 *
 * @param scales - An object containing the calculated raw scale scores
 * @returns An object containing the calculated T-scores
 */
export function rand36TScores(scales: IRAND36Scales): IRAND36Scales {
    return Object.fromEntries(
        Object.entries(scales).map(tScore),
    ) as unknown as IRAND36Scales;
}