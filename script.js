// Akan Name Data Arrays
const maleNames = ["Kwasi", "Kwadwo", "Kwabena", "Kwaku", "Yaw", "Kofi", "Kwame"];
const femaleNames = ["Akosua", "Adwoa", "Abenaa", "Akua", "Yaa", "Afua", "Ama"];
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// DOM Elements
const birthdateInput = document.getElementById("birthdate");
const genderRadios = document.querySelectorAll('input[name="gender"]');
const akanResult = document.getElementById("akan-result");
const akanNameDisplay = document.getElementById("akan-name");

// Function to calculate day of the week using the provided formula
function calculateDayOfWeek(day, month, year) {
    // Extract CC and YY from year
    const yearStr = year.toString();
    let CC, YY;
    
    if (yearStr.length === 4) {
        CC = parseInt(yearStr.substring(0, 2));
        YY = parseInt(yearStr.substring(2, 4));
    } else if (yearStr.length === 2) {
        CC = 0;
        YY = parseInt(yearStr);
    } else {
        // For years like 2005, 1998, etc.
        CC = parseInt(yearStr.substring(0, 2));
        YY = parseInt(yearStr.substring(2, 4));
    }
    
    const MM = month;
    const DD = day;
    
    // Apply the formula: d = ((4CC - 2×CC - 1) + (45×YY) + (1026×(MM+1)) + DD) mod 7
    // IMPORTANT: The formula in instructions has (4CC - 2×CC - 1) which simplifies to (2CC - 1)
    const part1 = (4 * CC) - (2 * CC - 1);  // This equals 2CC + 1
    const part2 = 45 * YY;
    const part3 = 1026 * (MM + 1);
    const d = (part1 + part2 + part3 + DD) % 7;
    
    // The formula returns: 
    // 0 = Saturday, 1 = Sunday, 2 = Monday, 3 = Tuesday, 
    // 4 = Wednesday, 5 = Thursday, 6 = Friday
    // But our array is: 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 
    // 4 = Thursday, 5 = Friday, 6 = Saturday
    // So we need to map: formula result -> array index
    const dayMap = {
        0: 6, // Saturday -> index 6
        1: 0, // Sunday -> index 0
        2: 1, // Monday -> index 1
        3: 2, // Tuesday -> index 2
        4: 3, // Wednesday -> index 3
        5: 4, // Thursday -> index 4
        6: 5  // Friday -> index 5
    };
    
    return dayMap[d] !== undefined ? dayMap[d] : 0;
}

// Function to validate date inputs
function validateDate(day, month, year) {
    // Basic validation
    if (day < 1 || day > 31) {
        return { valid: false, message: "Day must be between 1 and 31" };
    }
    
    if (month < 1 || month > 12) {
        return { valid: false, message: "Month must be between 1 and 12" };
    }
    
    if (year < 1900 || year > 2100) {
        return { valid: false, message: "Year must be between 1900 and 2100" };
    }
    
    // Validate days in month
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Adjust for leap year (February has 29 days in leap years)
    if (month === 2) {
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        if (isLeapYear && day > 29) {
            return { valid: false, message: "February has only 29 days in leap years" };
        } else if (!isLeapYear && day > 28) {
            return { valid: false, message: "February has only 28 days in non-leap years" };
        }
    } else if (day > daysInMonth[month - 1]) {
        return { valid: false, message: `Month ${month} has only ${daysInMonth[month - 1]} days` };
    }
    
    return { valid: true, message: "Date is valid" };
}

// Function to get akan name based on day and gender
function getAkanName(dayIndex, gender) {
    if (gender === "male") {
        return maleNames[dayIndex];
    } else {
        return femaleNames[dayIndex];
    }
}

// Function to display the result
function displayResult(dayIndex, gender, akanName) {
    const dayOfWeek = daysOfWeek[dayIndex];
    const genderText = gender === "male" ? "Male" : "Female";
    
    // Display the akan name and day of week
    akanNameDisplay.textContent = `${akanName} (Born on a ${dayOfWeek})`;
    akanResult.style.display = "block";
    
    // Add some visual feedback
    akanResult.style.animation = "fadeIn 0.5s ease-in";
    
    // Also log to console for debugging
    console.log(`Day of week: ${dayOfWeek} (index: ${dayIndex})`);
    console.log(`Gender: ${genderText}`);
    console.log(`Akan Name: ${akanName}`);
}

// Function to display error
function displayError(message) {
    alert(message); // Using alert for simplicity with your HTML structure
    akanResult.style.display = "none";
}

// Function to get selected gender
function getSelectedGender() {
    for (const radio of genderRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

// Main function to handle form submission
function generateAkanName() {
    // Get birthdate value
    const birthdateValue = birthdateInput.value;
    
    if (!birthdateValue) {
        displayError("Please enter your birthdate");
        return;
    }
    
    // Get selected gender
    const gender = getSelectedGender();
    if (!gender) {
        displayError("Please select your gender");
        return;
    }
    
    // Parse birthdate
    const birthdate = new Date(birthdateValue);
    const day = birthdate.getDate();
    const month = birthdate.getMonth() + 1; // JavaScript months are 0-indexed
    const year = birthdate.getFullYear();
    
    // Validate date
    const validation = validateDate(day, month, year);
    if (!validation.valid) {
        displayError(validation.message);
        return;
    }
    
    // Calculate day of week using the provided formula
    const dayIndex = calculateDayOfWeek(day, month, year);
    
    // Verify with JavaScript Date object (for debugging)
    const jsDate = new Date(year, month - 1, day);
    const jsDayIndex = jsDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    console.log(`Formula result: ${dayIndex} (${daysOfWeek[dayIndex]}), JS result: ${jsDayIndex} (${daysOfWeek[jsDayIndex]})`);
    
    // Get Akan name
    const akanName = getAkanName(dayIndex, gender);
    
    // Display result
    displayResult(dayIndex, gender, akanName);
}

// Set up event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Set max date to today
    const today = new Date();
    const maxDate = today.toISOString().split("T")[0];
    birthdateInput.max = maxDate;
    
    // Set a default date for testing (optional)
    // birthdateInput.value = "1990-05-15";
    
    // Auto-select male for testing (optional)
    // document.getElementById("male").checked = true;
    
    // Add event listeners to form inputs
    birthdateInput.addEventListener("change", generateAkanName);
    
    genderRadios.forEach(radio => {
        radio.addEventListener("change", generateAkanName);
    });
});

// Add CSS animation for fadeIn effect
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);